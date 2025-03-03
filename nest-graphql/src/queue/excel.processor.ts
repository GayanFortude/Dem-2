import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as xlsx from 'xlsx';
import { Workbook } from 'exceljs';
import {
  BadRequestException,
} from '@nestjs/common';
import { environment } from 'src/common/environment';
import { StudentService } from 'src/Students/student.service';
import { DataSource, Repository } from 'typeorm';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ExcelService } from './excel.service';

@Processor('studentqueue')
export class ExcelProcessor {
  constructor(
    private readonly studentsService: StudentService,
    private readonly dataSource: DataSource,
    private readonly excelService: ExcelService,
  ) {}

  @Process('read-excel')
  async handleReadExcel(job: Job<{ object: any }>) {
    const { object } = job.data;
    console.log("--- Reading Excel")
    if (!fs.existsSync(object.filePath)) {
      throw new BadRequestException('File not found');
    }

    try {
      await this.readExcel(object.filePath, object.user);
      return { success: true };
    } catch (error) {
    
      await this.studentsService.createTopic(
        `Error in handleReadExcel: ${error.message}`,
        object.user,
        '',
        'error',
      );
      throw error; // This ensures Bull handles the failure
    }
  }

  @Process('download-excel')
  async handleDownloadExcel(job: Job<{ object: any; token: any }>) {
    const { object, token } = job.data;
    try {
      await this.downloadExcel(object, token);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async readExcel(filePath: string, user: string) {
    //Upload read excel

    const workbook = await xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const requiredFields = environment.requiredFields;

    const excelRowCount = data.length;
    let savedCount = 0;

    const queryRunner = this.dataSource.createQueryRunner(); //transaction management
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const [index, element] of (data as any[]).entries()) {
        // Check all required fields at once
        const missingFields = requiredFields.filter((field) => !element[field]);
        console.log("----Missing fields",missingFields)
        if (missingFields.length > 0) {
          throw new BadRequestException(
            `Missing required field(s) '${missingFields.join(', ')}' in row ${index + 1}`,
          );
        }

        const student = await this.studentsService.bulkCreate(element); //create objects
        console.log("----student ",student)
        if (student) {
          await queryRunner.manager.save(student);
          savedCount++;
          console.log("----savedCount ",savedCount)
        }
      }

      await queryRunner.commitTransaction();
      await this.excelService.updateFileStatus(filePath);
      await this.studentsService.createTopic(
        `Processing complete. Total rows: ${excelRowCount}, Saved rows: ${savedCount}`,
        '',
        user,
        'success',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction(); //role back
      await this.studentsService.createTopic(
        //Error report
        `Error processing Excel: ${error.message}`,
        user,
        '',
        'error',
      );
      throw new BadRequestException(`Error processing Excel: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async downloadExcel(file: string, user: string) {
    //download excel
    try {
      const workbook = new Workbook(); //generate excel
      const worksheet = workbook.addWorksheet('Students');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'First Name', key: 'fname', width: 30 },
        { header: 'Last Name', key: 'lname', width: 30 },
        { header: 'Age', key: 'age', width: 30 },
      ];
      const students = await this.studentsService.getStudentsByAge(file);
      students.forEach((student) => {
        worksheet.addRow({
          id: student.id,
          fname: student.fname,
          lname: student.lname,
          age: student.age,
        });
      });

      const uploadDir = path.join(__dirname, '..', 'uploads');
      await fs.ensureDir(uploadDir); //upload file

      const filePath = path.join(uploadDir, `students_${1}.xlsx`);
      await workbook.xlsx.writeFile(filePath);
      await this.studentsService.createTopic(
        // Return file path
        'File Downloaded successfully',
        user,
        `students_${1}.xlsx`,
        'success',
      );
    } catch (error) {
      await this.studentsService.createTopic(
        `Error processing Excel: ${error.message}`,
        user,
        '',
        'error',
      );
      throw error; 
    }
  }
}

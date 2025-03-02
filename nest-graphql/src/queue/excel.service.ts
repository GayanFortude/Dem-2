import {  Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/Students/entities/file.entity';
import { Repository } from 'typeorm';
;

@Injectable()
export class ExcelService {
  constructor(
    @InjectQueue('studentqueue') private readonly studentqueue: Queue,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async processExcel(object: any) { //upload queue
    console.log("----File path:",object.filePath)
    await this.fileRepository.save({ path: object.filePath, status: false });
    await this.studentqueue.add(
      'read-excel',
      { object },
      {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  async processdownloadExcel(object: number, token: any) { //download queue
    await this.studentqueue.add('download-excel', { object, token });
  }

  async updateFileStatus(filePath: any){   //update file status
    await this.fileRepository.update({path:filePath}, { status:true })
  }
 
}

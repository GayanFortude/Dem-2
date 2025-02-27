import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as xlsx from 'xlsx';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { environment } from 'src/common/environment';

@Processor('studentqueue')
export class ExcelProcessor {
  @Process('read-excel')
  async handleReadExcel(job: Job) {
    console.log(job.data)
    const workbook = xlsx.readFile(job.data.filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const students = xlsx.utils.sheet_to_json(sheet);

    console.log('Processing students:', students);
    return { success: true };
  }
}

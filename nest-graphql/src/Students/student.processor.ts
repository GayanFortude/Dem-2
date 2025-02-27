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
export class StudentProcessor {
  @Process('read-excel')
  async handleReadExcel(job: Job) {
    const { students } = job.data;
    console.log('Processing students:', students);
    return { success: true };
  }
}

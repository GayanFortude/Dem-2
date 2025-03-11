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

  async processExcel(object: any) {
    try {
      console.log('----File path:', object.filePath);
  
      // Save the file record to the database or a storage system
      await this.fileRepository.save({ path: object.filePath, status: false });
  
      // Add job to the queue
      const job = await this.studentqueue.add(
        'read-excel',
        { object },
        {
          attempts: 3,
          backoff: 5000,
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
  
      // Optionally, log the job or return something useful if needed
      console.log('Job added to the queue with ID:', job.id);
  
      return job; // Returning the job can be useful for tracking or debugging purposes
  
    } catch (error) {
      console.error('Error in processExcel:', error);
      throw new Error('Error processing the Excel file');
    }
  }
  

  async processdownloadExcel(object: number, token: any) { 
    console.log("Processing download for object:", object, "with token:", token);
    
    try {
      // Add the job to the queue with the given parameters
      const job = await this.studentqueue.add('download-excel', { object, token }, {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: false,
      });
  
      // Optionally log the job ID for debugging
      console.log('Job added to the queue with ID:', job.id);
      
      return job; // Returning the job object for tracking purposes
    } catch (error) {
      console.error('Error adding job to queue:', error);
      throw new Error('Error processing download request');
    }
  }
  
  async updateFileStatus(filePath: any){   //update file status
    await this.fileRepository.update({path:filePath}, { status:true })
  }
 
}

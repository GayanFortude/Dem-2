import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ExcelService } from './excel.service';
import * as fs from 'fs';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(__dirname, '..', './uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname;
          const filename = `${uniqueSuffix}-${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const cookieHeader = req.headers['cookie'];
    if (!cookieHeader) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No token provided in cookies',
      });
    }
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No file uploaded',
      });
    }

    const filePath = path.join(__dirname, '../uploads', file.filename);
    const object = {
      filePath: filePath,
      user: cookieHeader,
    };

    try {
      // Attempt to process the file and add the job to the queue
      await this.excelService.processExcel(object);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'File uploaded and processing started successfully',
        data: {
          fileName: file.filename,
        },
      });
    } catch (error) {
      // If there is any error in processing the file or adding to the queue
      console.error('Error in file processing:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to process the file',
      });
    }
  }

  @Get('download')
  async downloadExcelNew(
    @Res() res: Response,
    @Query('filePath') filePath: string,
  ) {
    try {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      const fullPath = path.join(uploadDir, filePath);

      if (!fs.existsSync(fullPath)) {
        console.error('File not found:', fullPath);
        return res.status(404).json({ message: 'File not found' });
      }

      return res.download(fullPath, 'filename', (err) => {
        if (err) {
          res.status(500).send('Unable to download file');
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error downloading file', error });
      }
    }
  }
}

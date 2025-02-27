import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ExcelService } from './excel.service';

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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
         message: 'No file uploaded',
      };
    }
    const filePath = path.join(__dirname, '../uploads', file.filename);
    await this.excelService.processExcel(filePath);
    return {
      statusCode: HttpStatus.OK,
      message: 'File uploaded and processing started',
      fileUrl: filePath,
    };
  }

  // @Get('download')
  // async downloadExcel(@Res() res: Response, @Query('age') age: number) {
  //   try {
  //     const filePath = await this.excelService.getStudentsAndGenerateExcel(age);
  //     return res.download(filePath, 'filename', (err) => {
  //       if (err) {
  //         res.status(500).send('Unable to download file');
  //       }
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error generating file', error });
  //   }
  // }
}

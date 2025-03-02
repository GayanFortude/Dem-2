import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root', 
})
export class FileDownloadService { //File download
  constructor(private http: HttpClient) {}

  async downloadFile(filePath:any): Promise<void> {
    try {
      const fileData = 'studentNew.xlsx';
      const url = `${environment.fileUploadendpoint}/download?filePath=${filePath}`;

      const headers = new HttpHeaders({});
      const response = await this.http
        .get(url, { headers, responseType: 'blob' })
        .toPromise();
      if (!response) {
        throw new Error('Failed to download file');
      }
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileData);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      throw new Error('Error downloading file');
    }
  }
}

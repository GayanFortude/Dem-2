import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environment';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  // private socket: Socket;
  private socket: WebSocket;
  private messages: Subject<any> = new Subject();

  constructor() {
 
    document.cookie = 'token=user0; path=/';
    //`ws://localhost:${port}`
    this.socket = new WebSocket(environment.shocketio);
    this.socket.onopen = () => {
      console.log(`Connected to WebSocket on port 3006`);
      this.socket.send(JSON.stringify({ cookie: 'token=user0' }));
    };
    this.socket.onmessage = (event) => {
      this.messages.next(JSON.parse(event.data));
    };
    
  }


  sendMessage(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  listen(): Observable<any> {
    return new Observable((observer) => {
      this.socket.onmessage = (event) => {
        observer.next(event.data);
      };
      return () => {
        this.socket.onmessage = null; // Cleanup
      };
    });
  }

  disconnect() {
    this.socket.close();
  }
}

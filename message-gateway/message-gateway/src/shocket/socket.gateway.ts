import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  public connectedSockets: { [key: string]: any[] } = {};

  async handleConnection(client: any, req: Request) {
    try {
      const token = req.headers['cookie']
        .split(';')
        .map((p) => p.trim())
        .find((p) => p.split('=')[0] === 'token')
        .split('=')[1];

      client.userId = token;

      if (!this.connectedSockets[client.userId])
        this.connectedSockets[client.userId] = [];

      this.connectedSockets[client.userId].push(client);
    } catch (error) {}
  }

  handleDisconnect(client: any) {
    this.connectedSockets[client.userId] = this.connectedSockets[
      client.userId
    ].filter((p) => p.id !== client.id);
  }
}

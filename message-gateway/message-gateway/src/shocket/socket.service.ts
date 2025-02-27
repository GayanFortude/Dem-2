import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import { SocketGateway } from './socket.gateway';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';

@Injectable()
export class SocketService implements OnModuleInit, OnModuleDestroy {
  public redisClient: RedisClient;
  public publisherClient: RedisClient;
  private subscriberClient: RedisClient;
  private discoveryInterval: NodeJS.Timeout;
  private serviceId: string;

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly _consumer: ConsumerService,
  ) {
    this.serviceId = 'SOCKET_CHANNEL_' + Math.random().toString(36).slice(2);
  }

  async onModuleInit() {
    this._consumer.consume(
      'create-client',
      { topic: 'create-employee' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value
            ? JSON.parse(message.value.toString())
            : null;
          this.sendMessageToUser;
          console.log(value);
          const payloadSuccess = {
            event: 'file-uploaded',
            data: {
              message: value?.message ? value.message : null,
              filePath: value?.filePath ? value.filePath : null,
              userId: message.key?.toString(),
              type: value?.type ? value.type : null,
              timestamp: new Date().toISOString(),
            },
          };
          console.log({
            source: 'create-consumer',
            message: message.value?.toString() ?? '',
            key: message.key?.toString() ?? '',
            partition: partition.toString(),
            topic: topic.toString(),
          });
          const payload = message.value?.toString() ?? '';
          const token =
            message.key
              ?.toString()
              ?.split(';')
              ?.map((p) => p.trim())
              ?.find((p) => p.split('=')[0] === 'token')
              ?.split('=')[1] ?? '';
          console.log(token);
          await this.sendMessageToUser(token, payloadSuccess);
          // this.processExcel(message.value?.toString() ?? 'No message value');
        },
      },
    );
    this.redisClient = await this.newRedisClient();
    this.subscriberClient = await this.newRedisClient();
    this.publisherClient = await this.newRedisClient();

    this.subscriberClient.subscribe(this.serviceId);

    this.subscriberClient.on('message', (channel, message) => {
      const { userId, payload } = JSON.parse(message);
      this.sendMessage(userId, payload, true);
    });

    await this.channelDiscovery();
  }

  private async newRedisClient() {
    return createClient({
      host: 'localhost',
      port: 6379,
    });
  }

  async onModuleDestroy() {
    if (this.discoveryInterval) {
      clearTimeout(this.discoveryInterval);
    }
    await Promise.all([
      this.redisClient.quit(),
      this.subscriberClient.quit(),
      this.publisherClient.quit(),
    ]);
  }

  private async channelDiscovery() {
    this.redisClient.setex(this.serviceId, 3, Date.now().toString());
    this.discoveryInterval = setTimeout(() => {
      this.channelDiscovery();
    }, 2000);
  }

  // Public method to send a message to a specific user
  async sendMessageToUser(userId: string, payload: any) {
    console.log(userId, payload);
    await this.sendMessage(userId, JSON.stringify(payload), false);
  }

  private async sendMessage(
    userId: string,
    payload: string,
    fromRedisChannel: boolean,
  ) {
    // Send to all sockets associated with the userId
    const sockets = this.socketGateway.connectedSockets[userId];
    if (sockets && sockets.length > 0) {
      sockets.forEach((socket) => socket.send(payload));
    } else {
      console.log(`No active sockets found for userId: ${userId}`);
    }

    // Publish to Redis channels if not already from Redis
    if (!fromRedisChannel) {
      this.redisClient.keys('SOCKET_CHANNEL_*', (err, ids) => {
        if (err) {
          console.error('Error fetching Redis keys:', err);
          return;
        }
        ids
          .filter((id) => id !== this.serviceId)
          .forEach((id) => {
            this.publisherClient.publish(
              id,
              JSON.stringify({
                payload,
                userId,
              }),
            );
          });
      });
    }
  }
}

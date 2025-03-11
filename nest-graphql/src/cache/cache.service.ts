import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private redis: Redis) {}

  async cacheList(key: string, data: any[], ttl: number) {
    const pipleline = this.redis.pipeline();
    data.forEach((element) => pipleline.rpush(key, JSON.stringify(element)));
    pipleline.expire(key, ttl);
    await pipleline.exec();
  }

  async readListFromCache(key: string, start: number, end: number) {
    return await this.redis.lrange(key, start, end);
  }

  async removeCacheList(key: string) {
    await this.redis.del(key);
  }

  async removeAllCache() {
    await this.redis.flushall();
  }
}

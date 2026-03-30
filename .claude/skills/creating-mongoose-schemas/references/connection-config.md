# Mongoose Production Connection Config

## Async configuration with @nestjs/config

```typescript
// apps/api/src/core/database/database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        retryReads: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        readPreference: 'primaryPreferred',
        autoIndex: config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

## Key settings explained

| Setting | Value | Why |
|---------|-------|-----|
| `maxPoolSize` | 10 | Handles concurrent queries without exhausting connections |
| `minPoolSize` | 5 | Keeps warm connections ready |
| `w: 'majority'` | majority | Ensures writes replicate before acknowledging |
| `retryWrites` | true | Auto-retries transient write failures |
| `serverSelectionTimeoutMS` | 5000 | Fail fast if server unreachable |
| `autoIndex` | false in prod | Indexes should be created via migration scripts in production |
| `readPreference` | primaryPreferred | Falls back to secondary if primary unavailable |

## Environment validation with Zod

```typescript
// apps/api/src/config/env.validation.ts
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export type EnvConfig = z.infer<typeof envSchema>;
```

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import appConfig from './config/app.config';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { FaqModule } from './modules/faq/faq.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { StreamModule } from './modules/stream/stream.module';
import { ArtistModule } from './modules/artist/artist.module';
import { StoreModule } from './modules/store/store.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    JwtModule.register({
      secret: appConfig().jwt.secret,
      global: true,
      signOptions: { expiresIn: appConfig().jwt.expiresIn },
    }),
    PrismaModule,
    HealthModule,
    MailModule,
    AuthModule,
    UserModule,
    ArtistModule,
    StoreModule,
    StreamModule,
    ContactModule,
    FaqModule,
    ChatModule
  ]
})
export class AppModule { }

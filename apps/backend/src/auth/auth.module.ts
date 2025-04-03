import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
//import { JwtStrategy } from './jwt.strategy.ts.odloldol';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Usuario } from '../resources/usuario/entities/usuario.entity';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}

@Module({
  imports: [
    PassportModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'chave-secreta', // Melhor armazenar em variáveis de ambiente
    //   signOptions: { expiresIn: '1h' }, // Tempo de expiração do token
    // }),
    MikroOrmModule.forFeature([Usuario]),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '60m' },
      }),
      inject: [ConfigService],
    }),    
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
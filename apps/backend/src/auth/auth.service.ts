import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(user: { id: string; role: string }) {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }

  create(createAuthDto: CreateAuthDto) {
    // Implemente sua lógica de criação aqui
    return 'This action adds a new auth';
  }

  findAll() {
    // Implemente sua lógica de listagem aqui
    return `This action returns all auth`;
  }

  findOne(id: number) {
    // Implemente sua lógica de busca por ID aqui
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    // Implemente sua lógica de atualização aqui
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    // Implemente sua lógica de remoção aqui
    return `This action removes a #${id} auth`;
  }  
}

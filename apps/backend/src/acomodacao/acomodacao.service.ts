import { Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';

@Injectable()
export class AcomodacaoService {
  create(createAcomodacaoDto: CreateAcomodacaoDto) {
    return 'This action adds a new acomodacao';
  }

  findAll() {
    return `This action returns all acomodacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} acomodacao`;
  }

  update(id: number, updateAcomodacaoDto: UpdateAcomodacaoDto) {
    return `This action updates a #${id} acomodacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} acomodacao`;
  }
}

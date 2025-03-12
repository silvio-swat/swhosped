import { PartialType } from '@nestjs/mapped-types';
import { CreateAcomodacaoDto } from './create-acomodacao.dto';

export class UpdateAcomodacaoDto extends PartialType(CreateAcomodacaoDto) {}

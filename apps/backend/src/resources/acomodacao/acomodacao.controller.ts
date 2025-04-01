/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete,
   UseGuards, UseInterceptors, UploadedFile, UploadedFiles,
   BadRequestException,
   ParseIntPipe,
   Query,
   UsePipes,
   ValidationPipe} from '@nestjs/common';
import { Express } from 'express'; // Importe Express para o tipo
import { AcomodacaoService } from './acomodacao.service';
import { Acomodacao } from './entities/acomodacao.entity';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { FilterAcomodacaoDto } from './dto/filter-acomodacao.dto';
//import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer'; // Importação direta do Multer
import { extname } from 'path';

@Controller('acomodacaos')
export class AcomodacaoController {

  constructor(private readonly acomodacaoService: AcomodacaoService) {}

  // Versão para upload de um único arquivo
  
  //@Post('admin')
  @Post()
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('imagens', 5, {
    storage: diskStorage({
        destination: './apps/backend/uploads/img', // Diretório onde os arquivos serão salvos
        filename: (req, file, cb) => {
          // Gera um nome de arquivo único
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    }),
  }))
  async create(
    @Body() createAcomodacaoDto: CreateAcomodacaoDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // console.log('Dados recebidos:', {
    //   dto: createAcomodacaoDto,
    //   files: files?.map(f => ({
    //     originalname: f.originalname,
    //     size: f.size
    //   }))
    // });

    try {
      return await this.acomodacaoService.create(createAcomodacaoDto, files);
    } catch (error) {
      console.error('Erro na criação:', error);
      throw new BadRequestException('Dados inválidos: ' + error.message);
    }
  }

  // @Get()
  // async criarAcomodacoes() {
  //   // Utilize o serviço para criar acomodacoes
  // }  
  

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filters: FilterAcomodacaoDto): Promise<PaginatedAcomodacaoResult> {
    console.log('Filtros recebidos:', filters);
    return this.acomodacaoService.findAllWithFilters(filters);
  }

  // @Get()
  // findAll() {
  //   return { mensagem: 'Endpoint funcionando corretamente' };
  // }  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acomodacaoService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAcomodacaoDto: UpdateAcomodacaoDto) {
  //   return this.acomodacaoService.update(+id, updateAcomodacaoDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acomodacaoService.remove(+id);
  }
}

interface PaginatedAcomodacaoResult {
    data: Acomodacao[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

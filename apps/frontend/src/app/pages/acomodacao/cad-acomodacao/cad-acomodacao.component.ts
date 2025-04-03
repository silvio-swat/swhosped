/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, signal, OnDestroy, ViewChild, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AcomodacaoService, AcomodacaoStateService } from '../../../services/acomodacao.service';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { CreateAcomodacaoDto, TipoAcomodacao, StatusAcomodacao, AcomodacaoResponse } from './../../../interfaces/acomodacao.interface';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ImageCacheService } from '../../../services/image-cache.service';
import { CepService } from '../../../services/cep.service';
import { Endereco } from '../../../interfaces/endereco.interface';
import { GeocodingService } from '../../../services/geocoding.service';
import { TooltipModule } from 'primeng/tooltip';
import { TipoLogradouroService } from '../../../services/tipo-logradouro.service';
import { race, timer, of, Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    InputMaskModule,
    ButtonModule,
    FileUploadModule,
    TooltipModule 
  ],
  providers: [MessageService],  
  selector: 'app-cad-acomodacao',
  templateUrl: './cad-acomodacao.component.html',
  styleUrls: ['./cad-acomodacao.component.css']
})
export class CadAcomodacaoComponent implements OnDestroy, OnInit {

  private destroy$ = new Subject<void>(); // Adicione esta linha
  carregandoCoordenadas = signal(false);
  tiposLogradouro: string[] = []; 
  modoEdicao     = false; 
  idAcomodacao   = 0;
  // Usando Signals para gerenciar o estado do formulário
  acomodacao = signal<CreateAcomodacaoDto>({
    tipo: TipoAcomodacao.CASA,
    descricao: '',
    capacidade: 2,
    tipoLogradouro: 'Rua',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    complemento: '',
    cep: '',
    latitude: 0,
    longitude: 0,
    precoPorNoite: 0,
    status: StatusAcomodacao.DISPONIVEL,
    imagens: []
  });

  // Opções para os dropdowns (agora usando os enums corretamente)
  tiposAcomodacao = [
    { label: 'Casa', value: TipoAcomodacao.CASA },
    { label: 'Apartamento', value: TipoAcomodacao.APARTAMENTO },
    { label: 'Quarto de Hotel', value: TipoAcomodacao.QUARTO_HOTEL }
  ];

  estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  statusAcomodacao = [
    { label: 'Disponível', value: StatusAcomodacao.DISPONIVEL },
    { label: 'Reservado', value: StatusAcomodacao.RESERVADO },
    { label: 'Em Manutenção', value: StatusAcomodacao.EM_MANUTENCAO }
  ];
  
  acomodacaoOriginal: CreateAcomodacaoDto | null = null;  

  files = signal<File[]>([]);

    private router = inject(Router);

  constructor(
    private acomodacaoService: AcomodacaoService,
    private notificationService: NotificationService,
    private imageCache: ImageCacheService,
    private cepService: CepService,
    private geocodingService: GeocodingService,
    private tipologradouroService: TipoLogradouroService,
    // private route: ActivatedRoute,
    private acomodacaoState: AcomodacaoStateService    
  ) {
    this.tiposLogradouro = this.tipologradouroService.getTiposPadrao();    
  }

  ngOnInit() {
    this.acomodacaoState.currentAcomodacao.pipe(
      takeUntil(this.destroy$) // Garante que a subscrição será encerrada
    ).subscribe(acomodacao => {
      if (acomodacao) {
        // Limpa o cache antes de carregar novas imagens
        this.imageCache.clearCache();
        
        this.acomodacao.set({
          ...acomodacao,
          imagens: []
        });
        this.modoEdicao = true;
        this.idAcomodacao = acomodacao.id;
        this.loadImagens(acomodacao);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Encerra todas as subscrições
    this.destroy$.complete();
    this.imageCache.clearCache();
    this.acomodacaoState.clearAcomodacao();
  }  

  carregandoEndereco = signal(false);

//------- Geolocalização e preenchimento automático de latitude e longitude  
buscarCoordenadas() {
  if (!this.enderecoEstaCompleto()) {
    //this.notificationService.notify('info', 'Preencha todos os campos do endereço, incluindo número');
    return;
  }

  const enderecoCompleto = this.obterEnderecoCompleto();
  this.carregandoCoordenadas.set(true);

  // Adiciona timeout de 10 segundos
  const timeout = timer(10000).pipe(
    map(() => null),
    catchError(() => of(null))
  );

  race(
    this.geocodingService.buscarCoordenadasPrecisas(enderecoCompleto),
    timeout
  ).pipe(
    finalize(() => this.carregandoCoordenadas.set(false))
  ).subscribe({
    next: (coordenadas) => {
      if (coordenadas) {
        this.preencherCoordenadas(coordenadas);
        console.log(`Coordenadas obtidas via ${coordenadas.source} (${coordenadas.precision} precision)`);
      } else {
        this.notificationService.notify('info', 'Não foi possível obter coordenadas precisas');
      }
    },
    error: (err) => {
      this.notificationService.notify('error', 'Erro na busca de coordenadas');
      console.error('Erro na geolocalização:', err);
    }
  });
}

  private enderecoEstaCompleto(): boolean {
    const ac = this.acomodacao();

    return !!ac.logradouro && 
           !!ac.numero && 
           !!ac.bairro && 
           !!ac.cidade && 
           !!ac.estado;
  }

  private obterEnderecoCompleto(): string {
    const ac = this.acomodacao();
    return `${ac.logradouro}, ${ac.numero}, ${ac.bairro}, ${ac.cidade}, ${ac.estado}, Brasil`;
  }

  private preencherCoordenadas(coordenadas: { lat: number, lon: number }) {
    this.acomodacao.update(ac => ({
      ...ac,
      latitude: coordenadas.lat,
      longitude: coordenadas.lon
    }));
  }

  campoEnderecoIncompleto(): boolean {
    const ac = this.acomodacao();
    return !ac.logradouro || !ac.numero || !ac.bairro || !ac.cidade || !ac.estado;
  }  

//------- CEP - Métodos para preencher endereço por meio do cep
  buscarEnderecoPorCep() {
    const cep = this.acomodacao().cep;
    
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      this.notificationService.notify('info', 'CEP inválido');
      return;
    }
  
    this.carregandoEndereco.set(true);
  
    this.cepService.buscarEndereco(cep).subscribe({
      next: (endereco) => {
        if (endereco) {
          this.preencherEndereco(endereco);
        } else {
          this.notificationService.notify('info', 'CEP não encontrado');
        }
      },
      error: () => {
        this.notificationService.notify('error', 'Erro ao buscar CEP');
      },
      complete: () => this.carregandoEndereco.set(false)
    });
  }

  private preencherEndereco(endereco: Endereco) {
    this.acomodacao.update(ac => ({
      ...ac,
      tipoLogradouro: this.tipologradouroService.extrairTipo(endereco.logradouro) || ac.tipoLogradouro,
      logradouro: endereco.logradouro || ac.logradouro,
      complemento: endereco.complemento || ac.complemento,
      bairro: endereco.bairro || ac.bairro,
      cidade: endereco.localidade || ac.cidade,
      estado: endereco.uf || ac.estado
    }));
  }  

  @ViewChild('fileUpload') fileUpload: any;

handleFileSelect(event: any): void {
  console.log('Evento recebido:', event);
  console.log('event.currentFiles:', event?.currentFiles);

  if (!event?.currentFiles || !Array.isArray(event.currentFiles)) {
    console.warn('Nenhum arquivo válido encontrado.');
    return;
  }

  // Filtra arquivos válidos
  const validFiles = event.currentFiles.filter((file: File) => 
    file.size > 0 &&
    file.size <= 5000000 && // Limite de 5MB
    /^image\/(jpeg|png|gif|webp)$/i.test(file.type)
  );

  if (validFiles.length === 0) {
    this.notificationService.notify('info', 'Nenhum arquivo válido foi selecionado.');
    return;
  }

  // Salva no cache
  validFiles.forEach((file: File) => this.imageCache.addImage(file));
  //validFiles.forEach((file: File) => this.files.(file));
  validFiles.forEach((file: File) => this.addFile(file));

  // Atualiza o estado do formulário
  this.acomodacao.update(ac => ({
    ...ac,
    imagens: this.imageCache.getImages()
  }));

  console.log('Arquivos adicionados ao cache:', this.imageCache.getImages());
}

addFile(newFile: File) {
  this.files.update(currentFiles => [...currentFiles, newFile]);
};

private blobUrlToFile(blobUrl: string, fileName: string): Promise<File> {
  return fetch(blobUrl)
    .then(res => res.blob())
    .then(blob => new File([blob], fileName, { type: blob.type }));
}

private validateFile(file: any): boolean {
  if (!(file instanceof File)) {
    console.warn('Objeto não é File:', file);
    return false;
  }
  
  const isValid = (
    file.size > 0 &&
    file.size <= 1000000 && // 1MB
    /^image\/(jpe?g|png|gif|webp)$/i.test(file.type)
  );
  
  if (!isValid) {
    console.warn('Arquivo inválido:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
  }
  
  return isValid;
}

onRemove(file: File): void {
  this.imageCache.removeImage(file);
  this.files.update(currentFiles => 
    currentFiles.filter(f => !this.isSameFile(f, file)));

  this.acomodacao.update(ac => ({
    ...ac,
    imagens: this.imageCache.getImages()
  }));

  console.log('Imagem removida do cache:', file.name);
}



private isSameFile(a: File, b: File): boolean {
  return a.name === b.name && 
         a.size === b.size && 
         a.lastModified === b.lastModified;
}

  getPreview(img: File): string {
    return URL.createObjectURL(img); // Gera uma URL temporária para preview da imagem
  }

 //------- Formulário - Postagem do mesmo
  async onSubmit() {
    const formData = new FormData();

    // Adiciona os dados do formulário
    const acomodacaoData = this.acomodacao();
    for (const key in acomodacaoData) {
      if (key !== 'imagens') {
        formData.append(key, (acomodacaoData as any)[key]);
      }
    }

    // Validação antes de fazer o POST
    if(!this.isFormValid()) {
      return;
    }    
  
    //Adiciona imagens ao FormData
    this.imageCache.getImages().forEach((file, index) => {
      formData.append(`imagens`, file, file.name);
    });

    if (this.modoEdicao) {
      await this.atualizarAcomodacao(formData);
    } else {
      await this.criarAcomodacao(formData);
    }    
  }

  async criarAcomodacao(formData: FormData) {
    // Adiciona os dados do formulário
    const acomodacaoData = this.acomodacao();    
    this.acomodacaoService.createAcomodacao(formData).subscribe({
      next: () => {
        this.notificationService.notify('success', 'Acomodação cadastrada com sucesso!');
        this.imageCache.clearCache(); // Limpa o cache após envio bem-sucedido
        this.acomodacao.set({ ...acomodacaoData, imagens: [] }); // Reseta o campo imagens
        this.resetForm();
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.notificationService.notify('error', 'Erro ao cadastrar acomodação.');
        //Exibe todas as mensagens de erro de validação do Backend
        if(Array.isArray(error.error.message) && error.error.message.length > 0) {
          for(let i = 0; i < error.error.message.length; i++) {
            this.notificationService.notify('error', error.error.message[i]);
          }
          return;
        }
        this.notificationService.notify('error', error.error.message);    
      }
    });
  }
  
  async atualizarAcomodacao(formData: FormData) {
    if (!this.idAcomodacao) {
      this.notificationService.notify('error', 'ID da acomodação não encontrado');
      return;
    }
  
    // Adiciona o ID ao FormData se necessário
    formData.append('id', this.idAcomodacao.toString());
  
    this.acomodacaoService.updateAcomodacao(this.idAcomodacao, formData).subscribe({
      next: (response) => {
        this.notificationService.notify('success', 'Acomodação atualizada com sucesso!');
        this.imageCache.clearCache();
        this.resetForm();
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.notificationService.notify('error', 'Erro ao atualizar acomodação');
        
        if (error.error?.message) {
          if (Array.isArray(error.error.message)) {
            error.error.message.forEach((msg: string) => {
              this.notificationService.notify('error', msg);
            });
            return;
          } else {
            this.notificationService.notify('error', error.error.message);
          }
        }
      }
    });
  }  

  private resetForm() {
    this.acomodacao.set({
      tipo: TipoAcomodacao.CASA,
      descricao: '',
      capacidade: 2,
      tipoLogradouro: 'Rua',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: 'SP',
      complemento: '',
      cep: '',
      latitude: 0,
      longitude: 0,
      precoPorNoite: 0,
      status: StatusAcomodacao.DISPONIVEL,
      imagens: []
    });
    this.imageCache.clearCache();
  }

  private handleError(error: any) {
    if (error.error?.message) {
      if (Array.isArray(error.error.message)) {
        error.error.message.forEach((msg: string) => {
          this.notificationService.notify('error', msg);
        });
      } else {
        this.notificationService.notify('error', error.error.message);
      }
    } else {
      this.notificationService.notify('error', 'Erro ao cadastrar acomodação');
      console.error('Erro ao cadastrar acomodação', error);
    }
  }

  private isFormValid(): boolean {
    const form = this.acomodacao();
  
    // Validação do tipo de acomodação
    if (!form.tipo) {
      this.notificationService.notify('error', 'Selecione o tipo de acomodação.');
      return false;
    }
  
    // Validação da descrição (mínimo 10 caracteres)
    if (!form.descricao || form.descricao.trim().length < 10) {
      this.notificationService.notify('error', 'A descrição deve ter pelo menos 10 caracteres.');
      return false;
    }
  
    // Validação da capacidade (entre 1 e 20 pessoas)
    if (!form.capacidade || form.capacidade < 1 || form.capacidade > 40) {
      this.notificationService.notify('error', 'A capacidade deve estar entre 1 e 40 pessoas.');
      return false;
    }
  
    // Validação do endereço
    if (!form.tipoLogradouro) {
      this.notificationService.notify('error', 'Selecione o tipo de logradouro.');
      return false;
    }
    if (!form.logradouro || form.logradouro.trim() === '') {
      this.notificationService.notify('error', 'O logradouro é obrigatório.');
      return false;
    }
    if (!form.numero || form.numero.trim() === '') {
      this.notificationService.notify('error', 'O número é obrigatório.');
      return false;
    }
    if (!form.bairro || form.bairro.trim() === '') {
      this.notificationService.notify('error', 'O bairro é obrigatório.');
      return false;
    }
    if (!form.cidade || form.cidade.trim() === '') {
      this.notificationService.notify('error', 'A cidade é obrigatória.');
      return false;
    }
    if (!form.estado || form.estado.trim() === '') {
      this.notificationService.notify('error', 'O estado é obrigatório.');
      return false;
    }
  
    // Validação do CEP (deve ter 8 dígitos numéricos)
    if (!form.cep || form.cep.replace(/\D/g, '').length !== 8) {
      this.notificationService.notify('error', 'CEP inválido.');
      return false;
    }
  
    // Validação das coordenadas (se estiverem em 0, provavelmente não foram preenchidas)
    if (form.latitude === 0 && form.longitude === 0) {
      this.notificationService.notify('error', 'Não foi possível obter as coordenadas da localização.');
      return false;
    }
  
    // Validação do preço por noite (deve ser maior que 0)
    if (form.precoPorNoite == null || form.precoPorNoite <= 0) {
      this.notificationService.notify('error', 'Informe um preço por noite válido.');
      return false;
    }
  
    // Validação do status da acomodação
    if (!form.status) {
      this.notificationService.notify('error', 'Selecione o status da acomodação.');
      return false;
    }
  
    // Se todas as validações passaram, o formulário é válido
    return true;
  }

  private async loadImagens(acomodacao: any) {
    if (acomodacao.imagens && acomodacao.imagens.length > 0) {
      try {
        // 1. Primeiro converte os caminhos para URLs completas
        const imageUrls = this.acomodacaoService.getArrayImageUrl(acomodacao);
  
        // 2. Converte URLs para File objects
        const files: File[] = [];
        
        for (const url of imageUrls) {
          try {
            const fileName = url.substring(url.lastIndexOf('/') + 1);
            const file = await this.urlToFile(url, fileName);
            files.push(file);
          } catch (error) {
            console.error(`Erro ao converter a imagem ${url}:`, error);
          }
        }
  
        // 3. Adiciona ao cache e atualiza o estado
        files.forEach(file => this.imageCache.addImage(file));
        
        this.acomodacao.update(ac => ({
          ...ac,
          imagens: this.imageCache.getImages()
        }));
  
        console.log('Imagens carregadas no formulário:', this.imageCache.getImages());
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
      }
    }
  }

  // Método auxiliar para converter URL para File
  private async urlToFile(imageUrl: string, filename: string): Promise<File> {
    try {
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type || 'image/jpeg' });
    } catch (error) {
      console.error(`Erro ao converter URL para File: ${imageUrl}`, error);
      throw error;
    }
  } 

}


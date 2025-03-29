/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, signal, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AcomodacaoService } from '../../services/acomodacao.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { CreateAcomodacaoDto, TipoAcomodacao, StatusAcomodacao } from './../../interfaces/acomodacao.interface';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ImageCacheService } from '../../services/image-cache.service';
import { CepService } from '../../services/cep.service';
import { Endereco } from '../../interfaces/endereco.interface';
import { GeocodingService } from '../../services/geocoding.service';
import { TooltipModule } from 'primeng/tooltip';
import { TipoLogradouroService } from '../../services/tipo-logradouro.service';
import { race, timer, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

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
export class CadAcomodacaoComponent implements OnDestroy {

  carregandoCoordenadas = signal(false);
  tiposLogradouro: string[] = [];   
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

  files = signal<File[]>([]);

  constructor(
    private acomodacaoService: AcomodacaoService,
    private notificationService: NotificationService,
    private imageCache: ImageCacheService,
    private cepService: CepService,
    private geocodingService: GeocodingService,
    private tipologradouroService: TipoLogradouroService,
  ) {
    this.tiposLogradouro = this.tipologradouroService.getTiposPadrao();    
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
    // console.log('teste endereço completo para coordenadas');
    // console.log(ac);
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

  // //------- Imagens - Tratamento do upload de multiplas imagens do form

  // handleFileSelect(event: any): void {
  //   try {
  //     // Debug: Mostra a estrutura real do evento
  //     console.log('Estrutura completa do evento:', event);
  
  //     // Extrai arquivos de forma mais segura
  //     let files: File[] = [];
  
  //     // Caso 1: Evento padrão do PrimeNG (contém .files)
  //     if (event?.files && Array.isArray(event.files)) {
  //       files = [...event.files];
  //     } 
  //     // Caso 2: Evento pode ser o array diretamente
  //     else if (Array.isArray(event)) {
  //       files = [...event];
  //     }
  //     // Caso 3: Pode ser um único arquivo
  //     else if (event instanceof File || event?.name) {
  //       files = [event];
  //     }
  
  //     // Filtra arquivos válidos
  //     const validFiles = files.filter(file => {
  //       const isValid = file instanceof File && 
  //                      file.size > 0 && 
  //                      file.size <= 1000000 &&
  //                      /^image\/(jpeg|png|gif|webp)$/i.test(file.type);
        
  //       if (!isValid) {
  //         console.warn('Arquivo inválido ignorado:', {
  //           name: file.name,
  //           type: file.type,
  //           size: file.size
  //         });
  //       }
  //       return isValid;
  //     });
  
  //     if (validFiles.length === 0) {
  //       console.warn('Nenhum arquivo válido encontrado');
  //       return;
  //     }
  
  //     // Atualiza o estado
  //     this.acomodacao.update(ac => ({
  //       ...ac,
  //       imagens: [...(ac.imagens || []), ...validFiles]
  //     }));
  
  //     console.log('Arquivos adicionados com sucesso:', validFiles.map(f => f.name));
  //   } catch (error) {
  //     console.error('Erro ao processar seleção de arquivos:', error);
  //     this.notificationService.notify('error', 'Erro ao carregar imagens');
  //   }
  // }

  // private validarArquivo(file: File): boolean {
  //   // Verifica se é realmente um arquivo
  //   if (!(file instanceof File)) return false;
    
  //   // Verifica tipo do arquivo (opcional)
  //   const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
  //   if (!tiposPermitidos.includes(file.type)) return false;
    
  //   // Verifica tamanho máximo (opcional)
  //   const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
  //   if (file.size > tamanhoMaximo) return false;
    
  //   return true;
  // }  

  // // onRemove(event: { file: File }) {
  // //   this.removeImage(event.file);
  // // }

  // onRemove(event: { file: File }): void {
  //   if (!event?.file) return;
    
  //   this.imageCache.revokeImage(event.file);
  //   this.acomodacao.update(ac => ({
  //     ...ac,
  //     imagens: ac.imagens?.filter(img => img.name !== event.file.name) || []
  //   }));
    
  //   console.log('Arquivo removido:', event.file.name);
  // }

  // removeImage(file: File) {
  //   this.imageCache.revokeImage(file);    
  //   this.acomodacao.update(ac => ({
  //     ...ac,
  //     imagens: ac.imagens?.filter(img => img !== file) || []
  //   }));
  // }

  // // getPreview(file: File | undefined): string {
  // //   if (!file) return '';
  // //   return this.imageCache.cacheImage(file);
  // // }



  // onImageLoad(file: File) {
  //   console.log('Imagem carregada:', file.name);
  //   // Lógica adicional se necessário
  // }  

  // checkImagesBeforeSubmit(): void {
  //   const currentImages = this.acomodacao().imagens;
  //   console.log('Imagens no estado antes do envio:', currentImages);
    
  //   if (currentImages && currentImages.length > 0) {
  //     currentImages.forEach((img, index) => {
  //       console.log(`Imagem ${index + 1}:`, {
  //         name: img.name,
  //         type: img.type,
  //         size: img.size,
  //         lastModified: img.lastModified
  //       });
  //     });
  //   } else {
  //     console.warn('Nenhuma imagem encontrada no estado do componente');
  //   }
  // }
  @ViewChild('fileUpload') fileUpload: any;
// No seu componente
// async handleFileSelect(event: any): Promise<void> {
//   try {
//     const files = await this.extractFilesFromPrimeNGEvent(event);
    
//     if (files.length === 0) {
//       console.warn('Nenhum arquivo válido encontrado');
//       return;
//     }

//     this.acomodacao.update(ac => ({
//       ...ac,
//       imagens: [...(ac.imagens || []), ...files]
//     }));
    
//   } catch (error) {
//     console.error('Erro ao processar arquivos:', error);
//   }
// }

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

// private async extractFilesFromPrimeNGEvent(event: any): Promise<File[]> {
//   const fileObjects = [];
  
//   if (event?.currentFiles && Array.isArray(event.currentFiles)) {
//     fileObjects.push(...event.currentFiles);
//   }
  
//   if (event?.files && typeof event.files === 'object') {
//     fileObjects.push(...Object.values(event.files));
//   }

//   // const files: File[] = [];
  
//   for (const obj of fileObjects) {
//     try {
//       if (obj.objectURL?.changingThisBreaksApplicationSecurity) {
//         const blobUrl = obj.objectURL.changingThisBreaksApplicationSecurity;
//         const file = await this.blobUrlToFile(blobUrl, obj.name || 'imagem_' + Date.now());
//         if (file) this.files.push(file);
//       }
//     } catch (e) {
//       console.warn('Falha ao converter blob:', e);
//     }
//   }
  
//   return this.files;
// }

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

private updateImageState(files: File[]): void {
  this.acomodacao.update(ac => ({
    ...ac,
    imagens: [...(ac.imagens || []), ...files]
  }));
  
  console.log('Arquivos adicionados:', files.map(f => f.name));
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


  // onRemove(event: { file: File }): void {
  //   if (!event?.file) return;
    
  //   this.imageCache.revokeImage(event.file);
  //   this.acomodacao.update(ac => ({
  //     ...ac,
  //     imagens: ac.imagens?.filter(img => img.name !== event.file.name) || []
  //   }));
    
  //   console.log('Arquivo removido:', event.file.name);
  // }

  // removeImage(file: File) {
  //   this.imageCache.revokeImage(file);    
  //   this.acomodacao.update(ac => ({
  //     ...ac,
  //     imagens: ac.imagens?.filter(img => img !== file) || []
  //   }));
  // }

  // getPreview(file: File | undefined): string {
  //   if (!file || !(file instanceof File)) {
  //     console.warn('Arquivo inválido para preview:', file);
  //     return '';
  //   }
  //   return this.imageCache.cacheImage(file);
  // }  

  getPreview(img: File): string {
    return URL.createObjectURL(img); // Gera uma URL temporária para preview da imagem
  }

 //------- Formulário - Postagem do mesmo
  async onSubmit() {
    // if (!this.isFormValid()) {
    //   return;
    // }


    const formData = new FormData();
  
    // Adiciona os dados do formulário
    const acomodacaoData = this.acomodacao();
    for (const key in acomodacaoData) {
      if (key !== 'imagens') {
        formData.append(key, (acomodacaoData as any)[key]);
      }
    }
  
    //Adiciona imagens ao FormData
    this.imageCache.getImages().forEach((file, index) => {
      formData.append(`imagens`, file, file.name);
    });

    // console.log('Teste pra ver se tem algum arquivo de imagem!', this.files);

    // this.files().forEach(file => {
    //   formData.append('imagens', file, file.name);
    // });
  
    // this.files.forEach(file => {
    //   formData.append('imagens', file, file.name);
    // });

    this.acomodacaoService.createAcomodacao(formData).subscribe({
      next: () => {
        this.notificationService.notify('success', 'Acomodação cadastrada com sucesso!');
        this.imageCache.clearCache(); // Limpa o cache após envio bem-sucedido
        this.acomodacao.set({ ...acomodacaoData, imagens: [] }); // Reseta o campo imagens
        this.resetForm();
      },
      error: (error) => {
        this.notificationService.notify('error', 'Erro ao cadastrar acomodação.');

          //Exibe todas as mensagens de erro de validação do Backend
          if(error.error.message !== undefined && error.error.message.length > 0) {
            for(let i = 0; i < error.error.message.length; i++) {
              this.notificationService.notify('error', error.error.message[i]);
            }
          }
      }
    });





    
    // this.checkImagesBeforeSubmit(); // Adicione esta linha
  
    // const formData = new FormData();
    
    // // Adiciona todos os campos do formulário
    // Object.entries(this.acomodacao()).forEach(([key, value]) => {
    //   if (key === 'imagens') {
    //     // Adiciona cada imagem separadamente
    //     (value as File[] || []).forEach((file) => {
    //       formData.append('imagens', file, file.name);
    //     });
    //   } else if (value !== null && value !== undefined) {
    //   // Preserva números como números (não usa toString())
    //   if (typeof value === 'number') {
    //     formData.append(key, value.toString()); // Ainda precisa ser string no FormData
    //   } else {
    //     formData.append(key, value.toString());
    //   }
    //   }
    // });

    // try {
    //   const response =   await this.acomodacaoService.createAcomodacao(formData)
    //   .subscribe({
    //     next: (res) => {
    //       console.log('Sucesso!', res);
    //       this.notificationService.notify('success', 'Acomodação cadastrada com sucesso!');
    //     },
    //       error: (err) => console.error('Erro:', err)
    //   });
      
    //   // Limpar formulário após envio
    //   this.resetForm();
    // } catch (error) {
    //   this.handleError(error);
    // }
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
    
    if (!form.descricao || form.descricao.length < 10) {
      this.notificationService.notify('error', 'A descrição deve ter pelo menos 10 caracteres');
      return false;
    }

    if (!form.logradouro) {
      this.notificationService.notify('error', 'O logradouro é obrigatório');
      return false;
    }

    if (!form.cep || form.cep.replace(/\D/g, '').length !== 8) {
      this.notificationService.notify('error', 'CEP inválido');
      return false;
    }

    return true;
  }

  ngOnDestroy() {
    this.imageCache.clearCache();
  }
}
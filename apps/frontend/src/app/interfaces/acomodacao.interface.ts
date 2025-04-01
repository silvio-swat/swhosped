export interface CreateAcomodacaoDto {
    tipo: TipoAcomodacao;
    descricao: string;
    capacidade: number;
    tipoLogradouro: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
    cep: string;
    latitude: number;
    longitude: number;
    precoPorNoite: number;
    status: StatusAcomodacao;
    imagens?: File[];    
  }
  
  export interface AcomodacaoResponse {
    id: number;
    tipo: TipoAcomodacao;
    descricao: string;
    capacidade: number;
    tipoLogradouro: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
    cep: string;
    latitude: string;
    longitude: string;
    precoPorNoite: number;
    status: StatusAcomodacao;
    createdAt: Date;
    updatedAt: Date;
    imagens?: string[]; // URLs das imagens    
  }

  export interface FiltroAcomodacao {
    tipo?: string;          // Tipo da acomodação (Ex: Casa, Apartamento, Hotel)
    cidade?: string;        // Nome da cidade
    estado?: string;        // Sigla do estado (Ex: SP, RJ)
    checkin?: string;       // Data de check-in (Formato: YYYY-MM-DD)
    checkout?: string;      // Data de check-out (Formato: YYYY-MM-DD)
    capacidade?: number;    // Quantidade de pessoas que a acomodação suporta
    page?: number;
    limit?: number;
  }
  
  export enum TipoAcomodacao {
    CASA = 'Casa',
    APARTAMENTO = 'Apartamento',
    QUARTO_HOTEL = 'Quarto de Hotel',
  }
  
  export enum StatusAcomodacao {
    DISPONIVEL = 'Disponível',
    RESERVADO = 'Reservado',
    EM_MANUTENCAO = 'Em Manutenção',
  }

  export interface PaginatedAcomodacaoResult {
    data: AcomodacaoResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }  



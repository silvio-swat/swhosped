import { Cliente } from "./cliente.interface";
import { AcomodacaoResponse } from "./acomodacao.interface";

export  interface Reserva {
    id: number;
    cliente: Cliente;
    acomodacao: AcomodacaoResponse;
    dataCheckIn: Date;
    dataCheckOut: Date;
    valorTotal: number;
    status: 'Confirmada' | 'Cancelada';
}

export interface ReservaFiltroPesquisa {
    cpf?: string;          // Tipo da acomodação (Ex: Casa, Apartamento, Hotel)
    email?: string;        // Nome da cidade
    telefone?: string;        // Sigla do estado (Ex: SP, RJ)
    page?: number;
    limit?: number;
}

export interface ReservaFiltroAdminPesquisa {
    cpf?: string;
    email?: string;
    telefone?: string;
    status?: 'Confirmada' | 'Cancelada';
    dataInicio?: Date;
    dataFim?: Date;
    limit?: number;
    page?: number;
}

export interface PaginatedReservaResult {
    data: Reserva[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}  
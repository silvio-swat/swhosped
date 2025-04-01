import { Acomodacao } from "./entities/acomodacao.entity";
interface PaginatedAcomodacaoResult {
    data: Acomodacao[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}
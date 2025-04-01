import { Reserva } from "./entities/reserva.entity";

export interface PaginatedReservaResult {
    data: Reserva[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}
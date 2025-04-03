// interfaces.ts
export interface CreateUserClientDto {
  nomeUsuario: string;
  senha: string;
  tipoAcesso: 'Cliente' | 'Administrador';
  nomeCompleto: string;
  email: string;
  telefone: string;
  cpf: string;
}

export interface UserResponse {
  id: number;
  nomeUsuario: string;
  tipoAcesso: string;
  email: string;
}

export interface ClientResponse {
  id: number;
  nomeCompleto: string;
  email: string;
}

export interface UserClientResponse {
  user: UserResponse;
  cliente: ClientResponse;
}
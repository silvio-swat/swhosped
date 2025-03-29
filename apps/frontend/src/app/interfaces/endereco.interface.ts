export interface Endereco {
    cep?: string;
    logradouro: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    localidade: string;
    uf: string;    
    ibge?: string;
    gia?: string;
    numero: string;    
    ddd?: string;
    siafi?: string;
    erro?: boolean; // Usado pela ViaCEP para indicar quando o CEP não existe
  }
  
  // Tipo para a resposta da API ViaCEP
  export interface ViaCepResponse extends Endereco {
    erro?: boolean;
  }
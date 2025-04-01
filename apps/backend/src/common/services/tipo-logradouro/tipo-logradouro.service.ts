import { Injectable } from '@nestjs/common';

@Injectable()
export class TipoLogradouroService {
  private tiposPadrao = [
    'Rua', 'Avenida', 'Travessa', 'Alameda', 'Praça', 'Rodovia', 'Estrada', 'Marginal',
  ];

  private abreviacoes: Record<string, string> = {
    'av': 'Avenida',
    'av.': 'Avenida',
    'r': 'Rua',
    'r.': 'Rua',
    'tr': 'Travessa',
    'tr.': 'Travessa',
    'al': 'Alameda',
    'al.': 'Alameda',
    'pc': 'Praça',
    'pc.': 'Praça',
    'rod': 'Rodovia',
    'rod.': 'Rodovia',
    'est': 'Estrada',
    'est.': 'Estrada',
  };

  /**
   * Extrai e padroniza o tipo de logradouro
   * @param logradouroCompleto Nome completo do logradouro
   * @returns Tipo padronizado ou string vazia se não reconhecido
   */
  extrairTipo(logradouroCompleto: string): string {
    if (!logradouroCompleto?.trim()) return '';

    const palavras = this.prepararString(logradouroCompleto);

    for (const palavra of palavras) {
      // Verifica abreviações
      const tipoPorAbreviacao = this.abreviacoes[palavra.toLowerCase()];
      if (tipoPorAbreviacao) return tipoPorAbreviacao;

      // Verifica tipos completos
      const tipoEncontrado = this.tiposPadrao.find(
        tipo => tipo.toLowerCase() === palavra.toLowerCase(),
      );
      if (tipoEncontrado) return tipoEncontrado;
    }

    return '';
  }

  /**
   * Prepara a string, removendo pontuações e dividindo em palavras
   * @param texto Texto a ser processado
   * @returns Array de palavras
   */
  private prepararString(texto: string): string[] {
    return texto
      .replace(/[.,]/g, '') // Remove pontos e vírgulas
      .split(' ') // Divide em palavras
      .filter(palavra => palavra.trim().length > 0); // Remove espaços vazios
  }
}

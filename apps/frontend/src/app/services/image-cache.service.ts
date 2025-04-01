/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {
  private cache: File[] = [];

  private imageCache = new Map<string, string>();  

  // Adicionar imagem ao cache
  addImage(file: File): void {
    this.cache.push(file);
  }

  // Remover imagem do cache
  removeImage(file: File): void {
    this.cache = this.cache.filter(img => img !== file);
  }

  // Obter todas as imagens do cache
  getImages(): File[] {
    return [...this.cache];
  }

  // Limpar cache
  clearCache(): void {
    this.cache = [];
  }

  cacheImage(file: File): string {
    const cacheKey = this.generateCacheKey(file);
    if (!this.imageCache.has(cacheKey)) {
      const url = URL.createObjectURL(file);
      this.imageCache.set(cacheKey, url);
    }
    return this.imageCache.get(cacheKey)!;
  }  

  private generateCacheKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }  
}

// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// // image-cache.service.ts
// import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
// export class ImageCacheService {
//   private imageCache = new Map<string, string>();

//   cacheImage(file: File): string {
//     const cacheKey = this.generateCacheKey(file);
//     if (!this.imageCache.has(cacheKey)) {
//       const url = URL.createObjectURL(file);
//       this.imageCache.set(cacheKey, url);
//     }
//     return this.imageCache.get(cacheKey)!;
//   }

//   revokeImage(file: File) {
//     const cacheKey = this.generateCacheKey(file);
//     if (this.imageCache.has(cacheKey)) {
//       URL.revokeObjectURL(this.imageCache.get(cacheKey)!);
//       this.imageCache.delete(cacheKey);
//     }
//   }

//   clearCache() {
//     this.imageCache.forEach(url => URL.revokeObjectURL(url));
//     this.imageCache.clear();
//   }

//   private generateCacheKey(file: File): string {
//     return `${file.name}-${file.size}-${file.lastModified}`;
//   }
// }

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

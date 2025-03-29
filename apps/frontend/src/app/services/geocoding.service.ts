// src/app/services/geocoding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

export interface Coordenadas {
  lat: number;
  lon: number;
}

export interface CoordenadasDetalhadas extends Coordenadas {
  source: 'google' | 'mapbox' | 'nominatim';
  precision: 'high' | 'medium' | 'low';
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly providers = [
    this.geocodeWithGoogle.bind(this),
    this.geocodeWithMapbox.bind(this),
    this.geocodeWithNominatim.bind(this)
  ];

  constructor(private http: HttpClient) {}

  buscarCoordenadasPrecisas(enderecoCompleto: string): Observable<CoordenadasDetalhadas | null> {
    return this.tryProvidersSequentially(enderecoCompleto);
  }

  private tryProvidersSequentially(
    endereco: string,
    index = 0
  ): Observable<CoordenadasDetalhadas | null> {
    if (index >= this.providers.length) {
      return of(null); // Todos os providers falharam
    }
  
    return this.providers[index](endereco).pipe(
      catchError(() => {
        // Se falhar, tenta o próximo provider
        return this.tryProvidersSequentially(endereco, index + 1);
      }),
      switchMap(result => {
        // Se obteve resultado, retorna, senão tenta o próximo
        return result !== null ? of(result) : this.tryProvidersSequentially(endereco, index + 1);
      })
    );
  }

  private geocodeWithGoogle(endereco: string): Observable<CoordenadasDetalhadas | null> {
    const API_KEY = 'SUA_CHAVE_GOOGLE';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${API_KEY}`;
    
    return this.http.get<GoogleGeocodeResponse>(url).pipe(
      map(response => {
        if (response.results?.length > 0) {
          const loc = response.results[0].geometry.location;
          return {
            lat: loc.lat,
            lon: loc.lng, // Convertendo lng para lon
            source: 'google',
            precision: 'high'
          };
        }
        return null;
      })
    );
  }

  private geocodeWithMapbox(endereco: string): Observable<CoordenadasDetalhadas | null> {
    const API_KEY = 'pk.eyJ1Ijoic3dhdDIwMjUiLCJhIjoiY204cWZteGxuMGxiNzJzb2FxYnByZzF3biJ9.5Jc_ToORgGS1d-ggHxonCQ';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(endereco)}.json?access_token=${API_KEY}`;
    
    return this.http.get<MapboxGeocodeResponse>(url).pipe(
      map(response => {
        if (response.features?.length > 0) {
          const [lng, lat] = response.features[0].center;
          return {
            lat,
            lon: lng, // Convertendo lng para lon
            source: 'mapbox',
            precision: 'medium'
          };
        }
        return null;
      })
    );
  }

  private geocodeWithNominatim(endereco: string): Observable<CoordenadasDetalhadas | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`;
    
    return this.http.get<NominatimGeocodeResponse>(url).pipe(
      map(response => {
        if (Array.isArray(response) && response.length > 0) {
          return {
            lat: parseFloat(response[0].lat),
            lon: parseFloat(response[0].lon),
            source: 'nominatim',
            precision: 'low'
          };
        }
        return null;
      })
    );
  }
}

// Interfaces para as respostas das APIs
interface GoogleGeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

interface MapboxGeocodeResponse {
  features: Array<{
    center: [number, number];
  }>;
}

type NominatimGeocodeResponse = Array<{
  lat: string;
  lon: string;
}>;
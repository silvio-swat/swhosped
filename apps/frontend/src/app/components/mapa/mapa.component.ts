import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements AfterViewInit, OnChanges {
  @Input() latitude = -23.5505;
  @Input() longitude = -46.6333;
  private map!: L.Map;
  private marker!: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['latitude'] || changes['longitude'])) {
      this.map.setView([this.latitude, this.longitude], 13); // Mantenha o zoom
      this.marker.setLatLng([this.latitude, this.longitude]);
    }
  }

  private initMap(): void {
    try {
      this.map = L.map('map', {
        attributionControl: false,
        zoomControl: false
      }).setView([this.latitude, this.longitude], 13);

      L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      

      console.log('Dentro do mapacomponent', this.latitude, this.longitude);      
      
      this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map);

      setTimeout(() => this.map.invalidateSize(), 100);
    } catch (error) {
      console.error('Erro no mapa:', error);
    }
  }

  private updateMapPosition(): void {
    this.map.setView([this.latitude, this.longitude]);
    this.marker.setLatLng([this.latitude, this.longitude]);
  }
}
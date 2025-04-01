import { Injectable } from '@angular/core';
import { apiLinks } from '../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  apiLinks = apiLinks;

  getServerUrl() {
    return apiLinks.devNetwork;
  }
}

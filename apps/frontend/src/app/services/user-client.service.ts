import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserClientDto, UserClientResponse } from './../interfaces/user-client.interface';
import { apiLinks } from '../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class UserClientService {

  private apiUrl = apiLinks.devNetwork  + 'api/user-client';

  constructor(private http: HttpClient) {}

  createUserAndClient(data: CreateUserClientDto): Observable<UserClientResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });    
    return this.http.post<UserClientResponse>(this.apiUrl, data, {headers});
  }
}

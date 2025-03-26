/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserClientDto, UserClientResponse } from './../interfaces/user-client.interface';

@Injectable({
  providedIn: 'root'
})
export class UserClientService {

  private apiUrl = 'http://localhost:3000/api/user-client';

  constructor(private http: HttpClient) {}

  createUserAndClient(data: CreateUserClientDto): Observable<UserClientResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });    
    return this.http.post<UserClientResponse>(this.apiUrl, data, {headers});
  }
}

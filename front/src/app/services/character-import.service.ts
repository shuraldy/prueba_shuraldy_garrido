import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CharacterImportService {
  constructor(private http: HttpClient) {}

  // Este método está preparado para enviar el JSON a un endpoint futuro
  importCharacter(data: any): Observable<any> {
    console.log('[CharacterImportService] JSON para enviar (ya en español):', data);
    return this.http.post(
      'http://localhost:8000/api/personajes',
      data,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'body',
        responseType: 'json'
      }
    );
  }
}

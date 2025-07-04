import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CharacterImportService {
  constructor(private http: HttpClient) {}

  // Este método está preparado para enviar el JSON a un endpoint futuro
  importCharacter(data: any): Observable<any> {
    // Aquí se podría hacer un POST real en el futuro
    // return this.http.post('ENDPOINT_A_DEFINIR', data);
    console.log('[CharacterImportService] JSON preparado para enviar:', data);
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }
}

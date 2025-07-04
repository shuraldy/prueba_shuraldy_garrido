import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteadorService {
  private baseUrl = 'http://127.0.0.1:8000/api';
  private apiUrl = `${this.baseUrl}/reporte/generar`;

  constructor(private http: HttpClient) { }

  /**
   * Genera un reporte dinámico basado en un tipo y parámetros.
   * @param tipo El tipo de reporte a generar.
   * @param params Un objeto con los parámetros para el reporte (valor, fecha_inicio, fecha_fin).
   */
  generarReporte(tipo: string, params: any): Observable<any> {
    let httpParams = new HttpParams().set('tipo', tipo);

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  // --- Métodos para obtener las opciones de los filtros ---

  getOpcionesLocaciones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/reporte/opciones/locaciones`);
  }

  getOpcionesPersonajes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/reporte/opciones/personajes`);
  }

  getOpcionesEpisodios(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/reporte/opciones/episodios`);
  }

  getOpcionesEstados(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/reporte/opciones/estados`);
  }
}

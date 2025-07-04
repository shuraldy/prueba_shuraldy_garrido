import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportePersonaje {
  nombre_personaje: string;
  primer_episodio_nombre: string;
  primer_episodio_fecha_emision: string;
  dias_antiguedad: number;
}

export interface ReporteEpisodio {
  episodio: string;
  cantidad_personajes: number;
}

export interface ReporteLocacion {
  locacion: string;
  personajes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private baseUrl = 'http://localhost:8000/api/reporte';

  constructor(private http: HttpClient) { }

  getReportePersonajesAsc(): Observable<ReportePersonaje[]> {
    return this.http.get<ReportePersonaje[]>(`${this.baseUrl}/personajes-asc`);
  }

  getCantidadPersonajesPorEpisodio(): Observable<ReporteEpisodio[]> {
    return this.http.get<ReporteEpisodio[]>(`${this.baseUrl}/cantidad-personajes-por-episodio`);
  }

  getPersonajesPorLocacion(): Observable<ReporteLocacion[]> {
    return this.http.get<ReporteLocacion[]>(`${this.baseUrl}/personajes-por-locacion`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private apiUrl = 'https://rickandmortyapi.com/api/episode';

  constructor(private http: HttpClient) {}

  // Recibe un array de URLs, extrae los IDs y hace el fetch de todos los episodios
  getEpisodesByUrls(urls: string[]): Observable<Episode | Episode[]> {
    if (!urls.length) throw new Error('No episode URLs provided');
    const ids = urls.map(url => url.split('/').pop()).join(',');
    return this.http.get<Episode | Episode[]>(`${this.apiUrl}/${ids}`);
  }
}

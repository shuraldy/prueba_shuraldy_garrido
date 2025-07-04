import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Character } from '../services/rick-and-morty.service';
import { EpisodeService, Episode } from '../services/episode.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-detail-modal.component.html',
  styleUrl: './character-detail-modal.component.css'
})
export class CharacterDetailModalComponent implements OnInit {
  @Input() character!: Character;
  @Input() open: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() import = new EventEmitter<any>();

  episodes: Episode[] = [];
  loadingEpisodes = false;

  constructor(private episodeService: EpisodeService) {}

  ngOnInit() {
    if (this.character) {
      this.fetchEpisodes();
    }
  }

  ngOnChanges() {
    if (this.character) {
      this.fetchEpisodes();
    }
  }

  fetchEpisodes() {
    if (!this.character.episode?.length) return;
    this.loadingEpisodes = true;
    this.episodeService.getEpisodesByUrls(this.character.episode)
      .subscribe({
        next: (data) => {
          this.episodes = Array.isArray(data) ? data : [data];
          this.loadingEpisodes = false;
        },
        error: () => {
          this.episodes = [];
          this.loadingEpisodes = false;
        }
      });
  }

  handleClose() {
    this.close.emit();
  }

  handleImport() {
    // Armar el JSON directamente en español para enviar al backend
    const episodiosEs = this.episodes.map(ep => ({
      nombre: ep.name,
      fecha_emision: ep.air_date,
      codigo_episodio: ep.episode,
      url: ep.url
    }));

    const personajeEs = {
      nombre: this.character.name,
      estado: this.character.status,
      especie: this.character.species,
      tipo: this.character.type,
      genero: this.character.gender,
      imagen: this.character.image,
      url: this.character.url,
      creado: this.character.created,
      locacion: {
        nombre: this.character.location.name,
        url: this.character.location.url
      }
    };

    // Combinar todo en un solo objeto plano
    const payload = {
      ...personajeEs,
      episodios: episodiosEs
    };

    this.import.emit(payload);
  }
}

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
    // Armar el JSON según lo solicitado
    const importData = this.episodes.map(ep => ({
      id: ep.id,
      nombre: ep.name,
      fecha_emision: ep.air_date,
      codigo_episodio: ep.episode
    }));
    this.import.emit({
      personaje: {
        id: this.character.id,
        name: this.character.name,
        status: this.character.status,
        species: this.character.species,
        type: this.character.type,
        gender: this.character.gender,
        origin: this.character.origin,
        location: this.character.location,
        image: this.character.image,
        episode: this.character.episode,
        url: this.character.url,
        created: this.character.created
      },
      episodios: importData
    });
  }
}

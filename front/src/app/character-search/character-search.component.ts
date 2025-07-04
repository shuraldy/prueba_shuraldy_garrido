import { Component, OnInit } from '@angular/core';
import { RickAndMortyService, Character, ApiResponse } from '../services/rick-and-morty.service';
import { CharacterImportService } from '../services/character-import.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CharacterDetailModalComponent } from '../character-detail-modal/character-detail-modal.component';

@Component({
  selector: 'app-character-search',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterDetailModalComponent],
  templateUrl: './character-search.component.html',
  styleUrls: ['./character-search.component.css']
})
export class CharacterSearchComponent implements OnInit {
  constructor(private api: RickAndMortyService, private importService: CharacterImportService) {
    console.log('CharacterSearchComponent montado');
  }
  ngOnInit(): void {
    // Puedes cargar personajes por defecto aquí si lo deseas
    // this.getAllCharacters();
  }

  characters: Character[] = [];
  searchTerm: string = '';
  page: number = 1;
  totalPages: number = 1;
  loading = false;
  error: string | null = null;

  selectedCharacter: Character | null = null;
  modalOpen: boolean = false;


  getAllCharacters(page: number = 1) {
    this.loading = true;
    this.error = null;
    this.api.getCharacters(page).subscribe({
      next: (res: ApiResponse) => {
        this.characters = res.results;
        this.page = page;
        this.totalPages = res.info.pages;
        this.loading = false;
      },
      error: (err) => {
        this.characters = [];
        this.error = err.error?.error || 'No se encontraron personajes.';
        this.loading = false;
      }
    });
  }

  onSearch(page: number = 1) {
    if (!this.searchTerm.trim()) return;
    this.loading = true;
    this.error = null;
    this.api.searchCharacters(this.searchTerm, page).subscribe({
      next: (res: ApiResponse) => {
        this.characters = res.results;
        this.page = page;
        this.totalPages = res.info.pages;
        this.loading = false;
      },
      error: (err) => {
        this.characters = [];
        this.error = err.error?.error || 'No se encontraron personajes.';
        this.loading = false;
      }
    });
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    if (this.searchTerm.trim()) {
      this.onSearch(p);
    } else {
      this.getAllCharacters(p);
    }
  }

  openDetail(character: Character) {
    this.selectedCharacter = character;
    this.modalOpen = true;
  }

  closeDetail() {
    this.modalOpen = false;
    this.selectedCharacter = null;
  }

  handleImport(data: any) {
    console.log('Datos a importar:', data);
    this.importService.importCharacter(data).subscribe({
      next: (res) => {
        window.alert('¡Personaje importado exitosamente!');
        console.log('Respuesta del importService:', res);
        this.closeDetail();
      },
      error: (err) => {
        window.alert('Ocurrió un error al importar el personaje. Revisa la consola para más detalles.');
        console.error('--- DETALLE DEL ERROR DE VALIDACIÓN ---');
        console.error('Status:', err.status);
        console.error('Mensaje:', err.error?.message);
        console.error('Errores específicos:', err.error?.errors);
        console.error('--- FIN DEL DETALLE ---');
        console.error('Objeto de error completo:', err);
      }
    });
  }
}


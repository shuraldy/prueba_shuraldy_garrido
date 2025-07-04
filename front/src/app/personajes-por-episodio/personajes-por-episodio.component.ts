import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personajes-por-episodio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2 class="mb-4"><i class="bi bi-collection-play"></i> Personajes por Episodio</h2>
      <div class="accordion" id="episodiosAccordion">
        <div class="accordion-item" *ngFor="let ep of episodios; let i = index">
          <h2 class="accordion-header" [attr.id]="'heading' + i">
            <button class="accordion-button collapsed" type="button"
              data-bs-toggle="collapse"
              [attr.data-bs-target]="'#collapse' + i"
              [attr.aria-expanded]="false"
              [attr.aria-controls]="'collapse' + i">
              {{ ep.nombre }}
            </button>
          </h2>
          <div [attr.id]="'collapse' + i"
               class="accordion-collapse collapse"
               [attr.aria-labelledby]="'heading' + i"
               data-bs-parent="#episodiosAccordion">
            <div class="accordion-body">
              <ul>
                <li *ngFor="let p of ep.personajes">{{ p }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="alert alert-info mt-3">Este es un demo visual. Próximamente verás los datos reales.</div>
    </div>
  `
})
export class PersonajesPorEpisodioComponent {
  constructor() {
    console.log('PersonajesPorEpisodioComponent montado');
  }
  episodios = [
    {nombre:'Pilot', personajes:['Rick Sanchez','Morty Smith','Beth Smith']},
    {nombre:'Lawnmower Dog', personajes:['Rick Sanchez','Morty Smith','Snuffles']},
    {nombre:'Anatomy Park', personajes:['Rick Sanchez','Morty Smith','Annie']}
  ];
}


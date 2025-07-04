import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService, ReporteEpisodio } from '../services/reporte.service';

@Component({
  selector: 'app-personajes-por-episodio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="mb-4">Reporte: Cantidad de Personajes por Episodio</h2>
      <p class="text-muted mb-4">
        Listado de cada episodio con la cantidad total de personajes que aparecen en él.
      </p>
      
      <div *ngIf="isLoading" class="d-flex justify-content-center mt-5">
        <div class="spinner-border text-info" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger mt-4">
        <strong><i class="bi bi-exclamation-triangle-fill"></i> Error:</strong> {{ error }}
      </div>

      <div *ngIf="!isLoading && !error && reporte.length > 0" class="table-responsive shadow-sm">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Episodio</th>
              <th>Cantidad de Personajes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of reporte; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ item.episodio }}</td>
              <td>{{ item.cantidad_personajes }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!isLoading && !error && reporte.length === 0" class="alert alert-info mt-4">
          <strong><i class="bi bi-info-circle-fill"></i> No hay datos:</strong> No se encontraron episodios para mostrar en el reporte.
      </div>
    </div>
  `,
})
export class PersonajesPorEpisodioComponent implements OnInit {
  reporte: ReporteEpisodio[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.reporteService.getCantidadPersonajesPorEpisodio().subscribe({
      next: (data) => {
        this.reporte = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el reporte. Verifique que el backend esté funcionando e inténtelo de nuevo.';
        this.isLoading = false;
        console.error('Error al obtener el reporte de episodios:', err);
      }
    });
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService, ReportePersonaje } from '../services/reporte.service';

@Component({
  selector: 'app-personajes-asc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="mb-4">Reporte: Personajes por Antigüedad</h2>
      <p class="text-muted mb-4">
        Listado de personajes ordenado por la fecha de emisión de su primer episodio, indicando los días transcurridos desde entonces.
      </p>
      
      <div *ngIf="isLoading" class="d-flex justify-content-center mt-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
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
              <th>Personaje</th>
              <th>Primer Episodio</th>
              <th>Fecha De Emisión</th>
              <th>Antigüedad (Días)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of reporte; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ item.nombre_personaje }}</td>
              <td>{{ item.primer_episodio_nombre }}</td>
              <td>{{ item.primer_episodio_fecha_emision | date:'longDate':'es' }}</td>
              <td>{{ item.dias_antiguedad | number:'1.0-0' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!isLoading && !error && reporte.length === 0" class="alert alert-info mt-4">
          <strong><i class="bi bi-info-circle-fill"></i> No hay datos:</strong> No se encontraron personajes para mostrar en el reporte.
      </div>
    </div>
  `,
})
export class PersonajesAscComponent implements OnInit {
  reporte: ReportePersonaje[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.reporteService.getReportePersonajesAsc().subscribe({
      next: (data) => {
        this.reporte = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el reporte. Verifique que el backend esté funcionando e inténtelo de nuevo.';
        this.isLoading = false;
        console.error('Error al obtener el reporte:', err);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService, ReporteLocacion } from '../services/reporte.service';

@Component({
  selector: 'app-personajes-locacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personajes-locacion.component.html',
})
export class PersonajesLocacionComponent implements OnInit {
  reporte: ReporteLocacion[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.reporteService.getPersonajesPorLocacion().subscribe({
      next: (data) => {
        this.reporte = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el reporte. Verifique que el backend esté funcionando e inténtelo de nuevo.';
        this.isLoading = false;
        console.error('Error al obtener el reporte de locaciones:', err);
      }
    });
  }
}

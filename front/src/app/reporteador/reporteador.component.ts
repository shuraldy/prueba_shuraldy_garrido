import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReporteadorService } from '../services/reporteador.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-reporteador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reporteador.component.html',
})
export class ReporteadorComponent implements OnInit {
  reporteForm: FormGroup;
  resultados: any[] = [];
  columnas: string[] = [];
  isLoading = false;
  error: string | null = null;
  busquedaRealizada = false;

  // Observables para las opciones de los selectores
  locaciones$: Observable<string[]> = of([]);
  personajes$: Observable<string[]> = of([]);
  episodios$: Observable<string[]> = of([]);
  opcionesEstados$: Observable<string[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private reporteadorService: ReporteadorService
  ) {
    this.reporteForm = this.fb.group({
      tipo: ['', Validators.required],
      valor: [''],
      fecha_inicio: [''],
      fecha_fin: ['']
    });
  }

  ngOnInit(): void {
    this.cargarOpciones();
    this.onTipoChange();
  }

  cargarOpciones(): void {
    this.locaciones$ = this.reporteadorService.getOpcionesLocaciones().pipe(catchError(() => of(['Error al cargar locaciones'])));
    this.personajes$ = this.reporteadorService.getOpcionesPersonajes().pipe(catchError(() => of(['Error al cargar personajes'])));
    this.episodios$ = this.reporteadorService.getOpcionesEpisodios().pipe(catchError(() => of(['Error al cargar episodios'])));
    this.opcionesEstados$ = this.reporteadorService.getOpcionesEstados().pipe(catchError(() => of(['Error al cargar estados'])));
  }

  onTipoChange(): void {
    this.reporteForm.get('tipo')?.valueChanges.subscribe(tipo => {
      // Limpiar validadores y valores de todos los campos de filtro
      ['valor', 'fecha_inicio', 'fecha_fin'].forEach(ctrlName => {
        this.reporteForm.get(ctrlName)?.clearValidators();
        this.reporteForm.get(ctrlName)?.setValue('', { emitEvent: false });
      });

      // Establecer nuevos validadores según el tipo de reporte
      if (tipo === 'episodios_por_fecha') {
        this.reporteForm.get('fecha_inicio')?.setValidators([Validators.required]);
        this.reporteForm.get('fecha_fin')?.setValidators([Validators.required]);
      } else if (tipo) {
        this.reporteForm.get('valor')?.setValidators([Validators.required]);
      }
      
      // Actualizar el estado de validación de todos los controles
      ['valor', 'fecha_inicio', 'fecha_fin'].forEach(ctrlName => {
        this.reporteForm.get(ctrlName)?.updateValueAndValidity({ emitEvent: false });
      });

      // Limpiar resultados anteriores al cambiar de tipo
      this.resultados = [];
      this.busquedaRealizada = false;
    });
  }

  esFiltroSelector(): boolean {
    const tipo = this.reporteForm.get('tipo')?.value;
    return ['estado', 'locacion', 'episodios_por_personaje', 'personajes_por_episodio'].includes(tipo);
  }

  getOpcionesParaSelector(): Observable<string[]> {
    const tipo = this.reporteForm.get('tipo')?.value;
    switch (tipo) {
      case 'estado': return this.opcionesEstados$;
      case 'locacion': return this.locaciones$;
      case 'episodios_por_personaje': return this.personajes$;
      case 'personajes_por_episodio': return this.episodios$;
      default: return of([]);
    }
  }

  onSubmit(): void {
    if (this.reporteForm.invalid) {
      this.error = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.resultados = [];
    this.busquedaRealizada = true;

    const { tipo, ...params } = this.reporteForm.value;

    this.reporteadorService.generarReporte(tipo, params).subscribe({
      next: (data) => {
        this.resultados = data;
        this.configurarColumnas(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo generar el reporte. Verifique los parámetros y la conexión con el backend.';
        console.error('Error al generar reporte:', err);
        this.isLoading = false;
      }
    });
  }

  private configurarColumnas(data: any[]): void {
    if (data.length > 0) {
      this.columnas = Object.keys(data[0]);
    } else {
      this.columnas = [];
    }
  }

  // Helper para formatear los nombres de las columnas para la vista
  formatearNombreColumna(nombre: string): string {
    return nombre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Helper para que la plantilla pueda usar Array.isArray
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}

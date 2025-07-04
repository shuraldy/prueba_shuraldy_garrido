import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CharacterSearchComponent } from './character-search/character-search.component';
import { ReporteadorComponent } from './reporteador/reporteador.component';
import { PersonajesAscComponent } from './personajes-asc/personajes-asc.component';
import { PersonajesPorEpisodioComponent } from './personajes-por-episodio/personajes-por-episodio.component';
import { PersonajesLocacionComponent } from './personajes-locacion/personajes-locacion.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'busqueda', pathMatch: 'full' },
      { path: 'busqueda', component: CharacterSearchComponent },
      { path: 'reporteador', component: ReporteadorComponent },
      { path: 'personajes-asc', component: PersonajesAscComponent },
      { path: 'personajes-por-episodio', component: PersonajesPorEpisodioComponent },
      { path: 'personajes-por-locacion', component: PersonajesLocacionComponent },
    ]
  }
];

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersonajesAscComponent } from './personajes-asc/personajes-asc.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PersonajesAscComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'comfamiliar-angular';
}

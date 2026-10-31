import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { Header } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster, Header],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('angular');
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  imports: [RouterModule, ButtonModule, CommonModule, ToastModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
  menuAberto = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

}

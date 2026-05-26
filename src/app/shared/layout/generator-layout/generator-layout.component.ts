import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-generator-layout',
  imports: [CommonModule],
  templateUrl: './generator-layout.component.html',
  styleUrls: ['./generator-layout.component.css'],
})
export class GeneratorLayoutComponent {
  sidebarOpen = true;

  closeSidebar = () => {
    this.sidebarOpen = false;
  };
}

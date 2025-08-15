import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  private open: Record<string, any> = {};

  isOpen(id: string) {
    return !!this.open[id];
  }

  toggle(id: string) {
    this.open[id] = !this.open[id]  
  }
}

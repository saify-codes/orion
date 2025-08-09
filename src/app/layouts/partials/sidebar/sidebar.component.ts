import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  toggleDropdown(event: MouseEvent) {

    const button = event.currentTarget as HTMLElement
    button.parentElement
      ?.classList
      .toggle('open')
  }

}

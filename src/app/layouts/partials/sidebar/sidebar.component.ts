import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  toggleMenu(event: MouseEvent){

    const button = event.currentTarget as HTMLElement
    button.parentElement
      ?.classList
      .toggle('open')
  }

}

import { Component } from '@angular/core';
import { HeaderComponent } from "../partials/header/header.component";
import { SidebarComponent } from "../partials/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {

}

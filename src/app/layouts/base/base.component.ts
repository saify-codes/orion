import { Component } from '@angular/core';
import { HeaderComponent } from "../partials/header/header.component";
import { SidebarComponent } from "../partials/sidebar/sidebar.component";

@Component({
  selector: 'app-base',
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {

}

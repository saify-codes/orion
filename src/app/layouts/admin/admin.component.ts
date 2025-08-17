import { Component } from '@angular/core';
import { HeaderComponent } from "./partials/header/header.component";
import { SidebarComponent } from "./partials/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-app',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminLayout {

}

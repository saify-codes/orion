import { Component } from '@angular/core';
import { HeaderComponent } from "../../layouts/partials/header/header.component";
import { SidebarComponent } from "../../layouts/partials/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}

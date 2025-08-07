import { Component } from '@angular/core';
import { HeaderComponent } from "../../layouts/partials/header/header.component";
import { SidebarComponent } from "../../layouts/partials/sidebar/sidebar.component";
import { BaseComponent } from "../../layouts/base/base.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, BaseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
}

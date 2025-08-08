import { Component } from '@angular/core';
import { BaseComponent } from "../../layouts/base/base.component";

@Component({
  selector: 'app-dashboard',
  imports: [BaseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
}

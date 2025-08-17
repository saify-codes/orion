import { Component } from '@angular/core';
import { HeaderComponent } from "./partials/header/header.component";
import { SidebarComponent } from "./partials/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'merchant-app',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.css'
})
export class MerchantLayout {

}

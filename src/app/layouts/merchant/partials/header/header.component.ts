import { Component, inject, OnInit } from '@angular/core';
import { MerchantAuthService } from '../../../../services/merchant/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{

  public currentOpenMenu: string|null;
  public notificaitions: any[];
  public isFlushing: boolean
  private auth = inject(MerchantAuthService)

  constructor() {
    this.currentOpenMenu = null
    this.notificaitions  = [];
    this.isFlushing      = false;
  }

  isOpen(id: string){
    return this.currentOpenMenu == id
  }
  
  toggle(id: string) {
   this.currentOpenMenu = this.currentOpenMenu === id ? null : id
  }

  flushCache(){
    this.isFlushing = true

    setTimeout(() => {
      this.isFlushing = false
    }, 5000);
  }

  fetchNotifications() {
    // Simulate fetching notifications from a service
    return this.notificaitions;
  }

  logout() {
    this.auth.logout();
  }

}

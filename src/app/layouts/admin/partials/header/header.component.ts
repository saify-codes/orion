import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  public currentOpenMenu: string|null;
  public notificaitions: any[];

  constructor() {
    this.currentOpenMenu = null
    this.notificaitions  = [];
  }

  isOpen(id: string){
    return this.currentOpenMenu == id
  }
  
  toggle(id: string) {
   this.currentOpenMenu = this.currentOpenMenu === id ? null : id
  }

  fetchNotifications() {
    // Simulate fetching notifications from a service
    return this.notificaitions;
  }

  ngOnInit(): void {
    
  }

}

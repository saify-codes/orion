import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  public notificaitions: any[];
  public isUserMenuOpen: boolean;
  public isNotificationOpen: boolean; 

  constructor() {
    this.notificaitions = [];
    this.isUserMenuOpen = false;
    this.isNotificationOpen = false;
  }

  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    if (this.isNotificationOpen) this.isUserMenuOpen = false;
  }
  
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) this.isNotificationOpen = false;
  }

  fetchNotifications() {
    // Simulate fetching notifications from a service
    return this.notificaitions;
  }

  ngOnInit(): void {
    
  }

}

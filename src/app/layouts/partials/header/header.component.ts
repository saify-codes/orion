import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  public notificaitions

  constructor() {
    this.notificaitions = [
      { id: 1, message: 'New comment on your post', read: false },
      { id: 2, message: 'Your profile was viewed', read: false },
      { id: 3, message: 'New follower', read: true }
    ];
  }

  fetchNotifications() {
    // Simulate fetching notifications from a service
    return this.notificaitions;
  }

  ngOnInit(): void {
    
  }

}

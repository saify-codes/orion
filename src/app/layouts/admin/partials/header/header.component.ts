import { Component, inject } from '@angular/core';
import { AdminAuthService } from '../../../../services/admin/auth-service.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  public currentOpenMenu: string | null = null;
  public notificaitions: any[] = [];
  public auth: AdminAuthService = inject(AdminAuthService)

  isOpen(id: string) {
    return this.currentOpenMenu == id;
  }

  toggle(id: string) {
    this.currentOpenMenu = this.currentOpenMenu === id ? null : id;
  }

  fetchNotifications() {
    // Simulate fetching notifications from a service
    return this.notificaitions;
  }

  logout(){
    this.auth.logout()
  }
}

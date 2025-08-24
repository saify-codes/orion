import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PermissionsService } from '../../../../services/permissions.service';
import { AdminAuthService } from '../../../../services/admin/auth-service.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  private open: Record<string, any> = {};
  public permission = inject(PermissionsService) 
  public auth = inject(AdminAuthService) 


  isOpen(id: string) {
    return !!this.open[id];
  }

  toggle(id: string) {
    this.open[id] = !this.open[id]  
  }
}

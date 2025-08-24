import { Injectable } from '@angular/core';
import { AdminUser } from './admin/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private readonly ROLES:any = {
    SUPER_ADMIN: {
      dashboard: {
        manageAdmins: true 
      } 
    }
  };

  hasPermission(user:AdminUser, resource:string, action:string, data:any = null){
    
    const permission = this.ROLES[user.role][resource]?.[action];
    
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;

    return data != null && permission(user, data);
  }
}

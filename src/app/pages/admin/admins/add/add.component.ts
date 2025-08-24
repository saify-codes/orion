import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddAdminComponent {
  permissionGroups = [
    { name: 'dashboard',
      permissions: ['analytics', 'settings', 'geolocation', 'reports', 'export']
    },
    { name: 'merchant',
      permissions: ['create', 'edit', 'delete', 'suspend', 'restore']
    },
    { name: 'integrations',
      permissions: ['connect', 'disconnect', 'configure']
    },
    { name: 'system',
      permissions: ['backup', 'restore', 'maintenance', 'feature flags']
    },
  ];
  
  
  private fb = inject(FormBuilder)
  public form:FormGroup = this.fb.group({

  })

  hasError(path:string){
    const c = this.form.get(path);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  toggleAll(check: boolean){
    document
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach(b => b.checked = check);
  }
}

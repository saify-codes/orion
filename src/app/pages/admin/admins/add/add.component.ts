import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddAdminComponent {
  permissions = [
    'users.read','users.create','users.update','users.delete',
    'roles.read','roles.create','roles.update','roles.delete',
    'posts.read','posts.create','posts.update','posts.delete',
    'comments.read','comments.create','comments.update','comments.delete',
    'settings.read','settings.update',
    'billing.read','billing.update',
    'analytics.view','support.respond','notifications.send','backups.run','system.reboot',
  ];
  
  private fb = inject(FormBuilder)
  public form:FormGroup = this.fb.group({

  })

  hasError(path:string){
    const c = this.form.get(path);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}

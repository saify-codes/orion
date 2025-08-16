import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin/auth-service.service';

@Component({
  selector: 'app-admin-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-signin.component.html',
  styleUrl: './admin-signin.component.css',
})
export class AdminSigninComponent {
  
  public  loading         = true;
  private auth            = inject(AdminAuthService)
  private router          = inject(Router)
  public  form:FormGroup  = inject(FormBuilder).group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  })
  

  async onSubmit() {

    const {email, password, remember } = this.form.value

    try {      
      await this.auth.login(email, password, remember)
      this.router.navigate(['/admin'])
      
    } catch (error: any) {
      alert(error.message)
    }

  }
}

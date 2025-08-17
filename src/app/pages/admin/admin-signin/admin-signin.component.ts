import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin/auth-service.service';
import { withLoader } from '../../../utils';

@Component({
  selector: 'app-admin-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-signin.component.html',
  styleUrl: './admin-signin.component.css',
})
export class AdminSigninComponent {
  
  public  loading         = false;
  private auth            = inject(AdminAuthService)
  private router          = inject(Router)
  public  alert           = {
    show: false,
    text: '',
    type: 'error'
  }
  public  form:FormGroup  = inject(FormBuilder).group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  })
  

  async onSubmit() {


    const {email, password, remember } = this.form.value

    try {      

      await withLoader(() => this.auth.login(email, password, remember), (isLoading: boolean) => {
        this.loading  = isLoading
      })
      this.router.navigate(['/admin'])
      
    } catch (error: any) {
      this.alert.show = true
      this.alert.text = error.message || 'something went wrong'
    }

  }
}

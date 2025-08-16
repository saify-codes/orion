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
  
  public form: FormGroup;
  public loading: boolean = true;
  private auth = inject(AdminAuthService)
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  async onSubmit() {

    const {email, password, remember } = this.form.value

    try {
      console.log(this.form.value);
      
      await this.auth.login(email, password, remember)
      // this.router.navigate(['/admin'])
      
    } catch (error: any) {
      alert(error.message)
    }

  }
}

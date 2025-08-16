import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-signin.component.html',
  styleUrl: './admin-signin.component.css',
})
export class AdminSigninComponent {
  
  public form: FormGroup;
  public loading: boolean = true;
  
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

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      // this.router.navigate(['/']);
    }
  }
}

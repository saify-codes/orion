import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddMerchantComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    merchant: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['male', Validators.required],
    }),
    restaurant: this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    }),
    package: this.fb.group({
      tier: ['', Validators.required],
      monthlyPrice: [null, [Validators.required, Validators.min(0)]],
    }),
  });

  // convenience getters
  get merchant()   { return this.form.get('merchant') as FormGroup; }
  get restaurant() { return this.form.get('restaurant') as FormGroup; }
  get pkg()        { return this.form.get('package') as FormGroup; }

  showError(path: string): boolean {
    const c = this.form.get(path);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  onSubmit(): void {
    // TODO: replace with your API call
    console.log('Form payload:', this.form.value);
    // this.form.reset({ merchant: { gender: 'male' } }); // optional
  }
}

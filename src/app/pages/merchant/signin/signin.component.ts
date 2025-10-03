import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MerchantAuthService } from '../../../services/merchant/auth.service';
import { withLoader } from '../../../utils';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {

  public form: FormGroup;
  public loading: boolean;
  private formBuilder = inject(FormBuilder)
  private auth        = inject(MerchantAuthService)

  constructor() {
    this.loading = false
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  async onSubmit() {

    if (this.form.invalid){
      this.form.markAllAsTouched()
      return
    }

    const {username, password, remember} = this.form.value
    
    try {
      await withLoader(() => this.auth.login(username, password, remember), (state:boolean) => this.loading = state)
    } catch (error:any) {
      alert(error.message)
    }
    
  }
}

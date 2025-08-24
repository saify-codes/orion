import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddAdminComponent {
  private fb = inject(FormBuilder)
  public form:FormGroup = this.fb.group({

  })

  hasError(path:string){
    const c = this.form.get(path);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}

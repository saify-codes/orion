import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private location = inject(Location);
  private router   = inject(Router);

  goBack() {
    // If there’s history, go back; otherwise, send to a safe fallback (e.g., home)
    if (history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/'); // fallback route
    }
  }
}

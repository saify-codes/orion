import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';

type PageItem = number | '...';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  // 🔁 Two-way bound page (banana-in-a-box in parent: [(page)]="page")
  page = model.required<number>();

  // 📥 Signal-based inputs
  totalPages = input.required<number>();
  totalRecords = input.required<number>();
  limit = input.required<number>();

  // UI window with ellipses
  pages = computed<PageItem[]>(() => {
    const tp = this.totalPages();
    const cp = this.page();
    const siblings = 1;
    const out: PageItem[] = [];

    if (tp <= 7) {
      for (let i = 1; i <= tp; i++) out.push(i);
      return out;
    }

    out.push(1);
    if (cp > 2 + siblings) out.push('...');
    const start = Math.max(2, cp - siblings);
    const end = Math.min(tp - 1, cp + siblings);
    for (let i = start; i <= end; i++) out.push(i);
    if (cp < tp - (1 + siblings)) out.push('...');
    out.push(tp);
    return out;
  });

  startIndex = computed(() => {
    const total = this.totalRecords();
    if (total === 0) return 0;
    return (this.page() - 1) * this.limit() + 1;
  });

  endIndex = computed(() =>
    Math.min(this.page() * this.limit(), this.totalRecords())
  );

  nextPage(): void {
    if (this.page() < this.totalPages()) this.page.update(p => p + 1);
  }

  prevPage(): void {
    if (this.page() > 1) this.page.update(p => p - 1);
  }

  goToPage(p: PageItem): void {
    if (p === '...') return;
    const newPage = Math.max(1, Math.min(p, this.totalPages()));
    if (newPage !== this.page()) this.page.set(newPage);
  }
}

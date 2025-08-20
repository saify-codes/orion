import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounce } from '../../../decorators/debounce';
import { PaginationComponent } from '../../../components/pagination/pagination.component'; // Import SweetAlert2
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

interface Merchant {
  id: number;
  username: string;
  name: string;
  email: string;
  status: string;
  // add any other fields you return from the API
}

@Component({
  selector: 'app-admin-merchants',
  standalone: true,
  imports: [RouterLink, PaginationComponent, FormsModule],
  templateUrl: './admin-merchants.component.html',
  styleUrl: './admin-merchants.component.css',
})
export class AdminMerchantsComponent implements OnInit {
  public page = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public sort: { key: string; dir: 'asc' | 'desc' } = { key: 'id', dir: 'asc' };
  public search: string = '';
  public limit: number = 10;
  public loading: boolean = false;
  public currentOpenMenu: any = null;
  public merchants: Merchant[] = [];
  public http: HttpClient = inject(HttpClient);
  public contextMenuStyle: Record<string, any> = {};
  public statusBadgeClasses: Record<string, any> = {
    ACTIVE: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200',
    DELETED: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200',
    BLOCKED: 'bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-200',
    SUSPENDED: 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200',
  };

  ngOnInit(): void {
    this.getMerchantList();
  }

  @debounce(300)
  handleSearch() {
    this.getMerchantList();
  }

  handleLimitChange() {
    this.getMerchantList();
  }

  handleSort(key: string) {
    if (key === this.sort.key) {
      this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort = { key, dir: 'asc' };
    }

    this.getMerchantList();
  }

  onPageChange(nextPage: number) {
    this.page = nextPage;
    this.getMerchantList();
  }

  getMerchantList() {
    const params = new HttpParams()
      .set('page', this.page)
      .set('search', this.search)
      .set('limit', this.limit)
      .set('sort_by', this.sort.key)
      .set('sort_dir', this.sort.dir);

    this.loading = true;
    this.http
      .get<{ data: Merchant[]; pagination: any }>(`admin/merchant`,{ params })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.merchants = res?.data || [];
          this.totalRecords = res?.pagination.total;
          this.totalPages = res?.pagination.total_pages;
        },
        error: (err) => {
          console.error(err);
          this.merchants = [];
        },
      });
  }

  toggleMenu(id: any, event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.contextMenuStyle = {
      top: `${rect.bottom + 10}px`,
      left: `${rect.right}px`,
      transform: `translateX(-100%)`,
    };
    this.currentOpenMenu = this.currentOpenMenu == id ? null : id;
  }

  isOpen(id: any) {
    return id == this.currentOpenMenu;
  }

  @HostListener('document:click')
  closeMenu() {
    this.currentOpenMenu = null;
  }

  deleteMerchant(merchant: Merchant) {
    Swal.fire({
      title: `Delete ${merchant.name}?`,
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',

      // 🔽 shows a spinner on the confirm button
      showLoaderOnConfirm: true,

      // 🔽 run async work here (simulated 3s API)
      preConfirm: () => this.fakeDeleteRequest(merchant.id),

      // 🔽 keep the modal open while loading
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // optimistic update after the "API" finishes
        this.merchants = this.merchants.filter((m) => m.id !== merchant.id);

        Swal.fire('Deleted!', 'Merchant deleted', 'success');
      }
    });
  }

  private fakeDeleteRequest(id: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

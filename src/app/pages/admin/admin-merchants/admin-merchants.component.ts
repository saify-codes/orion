import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounce } from '../../../decorators/debounce';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
  imports: [RouterLink],
  templateUrl: './admin-merchants.component.html',
  styleUrl: './admin-merchants.component.css'
})

export class AdminMerchantsComponent implements OnInit {

  public  currentOpenMenu: string|null;
  public  merchants: Merchant[];
  public  statusBadgeClasses: Record<string, string>
  public  contextMenuStyle: Partial<CSSStyleDeclaration>;
  private http:HttpClient;

  constructor(){
    this.currentOpenMenu    = null
    this.merchants          = []
    this.http               = inject(HttpClient)
    this.contextMenuStyle   = {}
    this.statusBadgeClasses = {
      ACTIVE:   'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200',
      UNAPPROVED: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200',
    }
  }

  ngOnInit(): void {
    this.getMerchantList();
  }

  @debounce(300)
  handleMerchantSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.getMerchantList(value);
  }

  getMerchantList(search = '') {
    const params = new HttpParams().set('search', search);
    this.http
      .get<{ data: Merchant[] }>(`http://localhost:8000/api/admin/merchant`, { params })
      .subscribe({
        next: (res) => (this.merchants = res?.data || []),
        error: (err) => {
          console.error(err);
          this.merchants = [];
        }
      });
  }

  toggleMenu(id: any, event:MouseEvent) {

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.contextMenuStyle = {
      top:  `${rect.bottom + 10}px`,
      left: `${rect.right}px`,
      transform: `translateX(-100%)`
    };
    this.currentOpenMenu = this.currentOpenMenu == id ? null : id
  }

  isOpen(id:any){
    return id == this.currentOpenMenu
  }

  @HostListener('document:click')
  closeMenu() {
    this.currentOpenMenu = null
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
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        // optimistic update after the "API" finishes
        this.merchants = this.merchants.filter(m => m.id !== merchant.id);

        Swal.fire('Deleted!', 'Merchant deleted', 'success');
      }
    });
  }
  
  private fakeDeleteRequest(id: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounce } from '../../../decorators/debounce';

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
  private http:HttpClient;
  private foo:any = null

  constructor(){
    this.currentOpenMenu = null
    this.merchants       = []
    this.http            = inject(HttpClient)
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

  // ---------- Context menu handlers ----------

  toggleMenu(id: any) {
    
  }

  closeMenu() {
    
  }

  @HostListener('document:click')
  onDocumentClick() {
    // closes when clicking anywhere outside the menu/button
    this.closeMenu();
  }

  // ---------- Actions ----------

  confirmDelete(merchant: Merchant) {
    
  }

  autoLogin(merchant: Merchant) {
    
  }

}

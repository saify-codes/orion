import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditMerchantComponent implements OnInit{

  public  currentTab:string = 'payments' 
  public  merchantData: any;
  public  loading: boolean = true;
  private activeRoute = inject(ActivatedRoute)
  private http = inject(HttpClient)

  ngOnInit(): void {
    console.log(this.activeRoute.snapshot.params['id'])
    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  isTabOpen(tab: string){
    return tab === this.currentTab
  }

  openTab(tab:string){
    this.currentTab = tab
  }

  getMerchantData(){

  }

}

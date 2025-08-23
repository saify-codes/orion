import { Component } from '@angular/core';

@Component({
  selector: 'app-edit',
  imports: [],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditMerchantComponent {

  public currentTab:string = 'payments' 

  isTabOpen(tab: string){
    return tab === this.currentTab
  }

  openTab(tab:string){
    this.currentTab = tab
  }

}

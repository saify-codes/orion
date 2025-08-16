import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  public currentPage
  public totalPages
  public totalRecords
  public limit
  public pages:any


  constructor(){
    this.limit        = 10
    this.currentPage  = 1
    this.totalRecords = 1000
    this.totalPages   = Math.ceil(this.totalRecords / this.limit)
    this.pages        = []

    this.buildPages()

  }

  onPageChange(callback: Function){

  }

  nextPage(){
    this.goToPage(this.currentPage + 1)
  }
  
  prevPage(){
    this.goToPage(this.currentPage - 1)
  }

  goToPage(page:number){
    this.currentPage = Math.max(page, Math.min(page, this.totalPages))
    this.buildPages()
  }

  buildPages(){

    this.pages        = []

    const range       = 1
    const start       = Math.max(this.currentPage - range, 1)
    const end         = Math.min(this.currentPage + range, this.totalPages)

    if(start > 1){
      this.pages.push(1)
      this.pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      this.pages.push(i)      
    }

    if(end < this.totalPages){
      this.pages.push('...')
      this.pages.push(this.totalPages)
    }

  }
  

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datatable',
  imports: [],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
})
export class DatatableComponent implements OnInit{

  public x:any[] = []

  @Input() 
  public dataSourceURL:string | null = null;
  @Input() 
  public headers:string[]  = [];
  @Input() 
  public columns:any[]  = [];
  @Input() 
  public foo:any;

  public serverSide = false;
  public loading = false;
  public records:any[] = [];
  public pagination = {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  };


  constructor(){

    for (let i = 0; i < 1000; i++) {
      this.x.push({
        id: i,
        name: 'test',
        email: 'test@gmail.com'
      })
    }

    this.pagination.total = this.x.length
    this.pagination.totalPages = Math.ceil(this.x.length / this.pagination.limit)

  }

  ngOnInit(): void {
    this.getRecords()
  }

  getRecords() {

    this.records = this.x.slice((this.pagination.currentPage - 1) * this.pagination.limit , (this.pagination.currentPage - 1) * this.pagination.limit + this.pagination.limit)

  }

  // =========== ui =========== //

  buildPages(){

    const { currentPage, totalPages } = this.pagination
    const pages:any[] = []
    const range = 2
    const start = Math.max(currentPage - range, 1)
    const end   = Math.min(currentPage + range, totalPages)

    if (start > 1) {
      pages.push(1, '...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      pages.push('...', totalPages)
    }

    return pages

  }

  // =========== pagination =========== //

  prev() {
    let { currentPage } = this.pagination;
    this.pagination.currentPage = Math.max(--currentPage, 1);
    this.getRecords()
  }
  
  next() {
    let { currentPage, totalPages } = this.pagination;
    this.pagination.currentPage = Math.min(++currentPage, totalPages);
    this.getRecords()
  }
  
  goto(page: number) {
    this.pagination.currentPage = page
    this.getRecords()
  }
}

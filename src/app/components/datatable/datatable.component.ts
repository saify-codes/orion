import { Component } from '@angular/core';

@Component({
  selector: 'app-datatable',
  imports: [],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
})
export class DatatableComponent {
  public dataSourceURL = null;
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

    for (let i = 0; i < 100; i++) {
      this.records.push({
        id: i,
        name: 'test',
        email: 'test@gmail.com'
      })
    }

  }

  getRecords() {



  }

  // =========== ui =========== //

  buildPages(){

    const { currentPage, totalPages } = this.pagination
    const pages:any = []
    const range = 2
    const start = Math.max(currentPage - range, 1)
    const end   = Math.min(currentPage + range, totalPages)

    if (start > currentPage) {
      pages.concat(1, '...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      pages.concat('...', totalPages)
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

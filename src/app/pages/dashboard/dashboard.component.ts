import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { withLoader } from '../../utils';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  public filters = {
    branch: 'All',
    city  : 'All',
    source: 'All',
    txType: 'All',
    date  : ''
  };

  // per-card loading state
  public widgets: Record<string, any> = {
    total_sales: {
      data: null,
      isLoading:false,
      viewed: false,
      // add more fields here
    },
    total_orders: {
      data: null,
      isLoading:false,
      viewed: false,
      // add more fields here
    },
    avg_order_amount: {
      data: null,
      isLoading:false,
      viewed: false,
      // add more fields here
    },
    total_tip: {
      data: null,
      isLoading:false,
      viewed: false,
      // add more fields here
    },
  };

  isFiltersDisable(){
    return Object.values(this.widgets)
            .some((widget: any) => widget.isLoading)
  }

  isLoading(widget: string){
    return this.widgets[widget].isLoading
  }

  // refreshAll(){

  //   for (const widget in this.widgets) {
  //     this.refreshData(widget)
  //   }
  // }

  async fetchWidgetData(widget: string){
    
    const response = await withLoader(()=>{

      return new Promise((res:any)=>{
        setTimeout(() => {
          res(332)
        }, 2000);
      })

    }, (loading:boolean) => {      
      this.widgets[widget].isLoading = loading
    })

    this.widgets[widget].viewed = true
    this.widgets[widget].data = response
    console.log(response, this.widgets);
    
    

  }

  onFilterChange(){
    // this.refreshAll()
  }

}

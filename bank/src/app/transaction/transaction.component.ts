import { Component, OnInit } from '@angular/core';
import { elementAt, Subscriber } from 'rxjs';
import { ApiServesService } from '../services/api-serves.service';
import jspdf from 'jspdf'
import 'jspdf-autotable'
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit{
  allTransaction:any
 constructor(private api:ApiServesService){} 
 ngOnInit(): void {
     this.api.getAlltransaction()
     .subscribe((result:any)=>{    
    this.allTransaction=result.transaction
    console.log(this.allTransaction);  
     })
 }
 //generate pdf
 generatePdf(){
  var pdf= new jspdf()
  let col=['Type','FromAccno','ToAccno','Amount']
  let row:any=[]
  pdf.setFontSize(16)
  pdf.text('Transaction History',11,8)
  pdf.setFontSize(12)
  pdf.setTextColor(99)

  // convert allTransaction to nested array

  var itemNew=this.allTransaction
  console.log(itemNew);
  
  for(let element of itemNew){
    var temp =[element.type,element.fromAccno,element.toAccno,element.amount]
    row.push(temp)
  }
  (pdf as any).autoTable(col,row,{startY:10})
  // open pdf in browser
  pdf.output('dataurlnewwindow');
  //download
  pdf.save('ministatement.pdf')
 }
}

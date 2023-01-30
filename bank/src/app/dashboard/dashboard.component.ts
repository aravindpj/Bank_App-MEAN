import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ApiServesService } from '../services/api-serves.service';
import { FormBuilder, Validators } from '@angular/forms'
import party from "party-js"
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = 'user'
  accno: number = 0
  balance: number = 0
  depositMsg:string=''
  fundtranferSuccessMsg:String=''
  fundtranferErrorMsg:String=''
  logoutdiv:Boolean
  acno:any
  depositForm= this.fb.group({
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
   
  })
  fundTransferForm=this.fb.group({
    toAccno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]]
  })
  constructor(private api: ApiServesService,private fb:FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem("username") || ''
  }

  checkBalance() {
    this.accno = JSON.parse(localStorage.getItem("acno") || '')
    console.log('from localstorage (1) =>',this.accno);
    this.api.getBalance(this.accno).subscribe(
      (result: any) => {
        this.balance=result.result.balance
        console.log('Inside check balance',result.result.balance);
        
      },
      (result) => {
        console.log('inside reject=>',result.error.message);
      }
    )
  }

  deposit(){
    console.log(this.depositForm);
  
    if(this.depositForm.valid){
      let amount=this.depositForm.value.amount
      this.accno = JSON.parse(localStorage.getItem("acno") || '')
      this.api.deposit(this.accno,amount)
      .subscribe(
        (result:any)=>{
          console.log(result.result);
          this.depositMsg=result.result.message
        },
        (result:any)=>{
          this.depositMsg=result.error.message
        }
      )
      
    }else{
        alert('Invalid Form')
    }
  } 
  showconfetti(source:any){
     party.confetti(source)
  }

  // transfer //BUG 
  transfer(){
    console.log('wroking');
    console.log(this.fundTransferForm.valid);
    
    if(this.fundTransferForm.valid){
      let toAccno=this.fundTransferForm.value.toAccno
      let password=this.fundTransferForm.value.password
      let amount=this.fundTransferForm.value.amount
    
      this.api.fundTransfer(toAccno,password,amount)
      .subscribe(
        (result:any)=>{
           console.log(result.result.message);
           
           this.fundtranferSuccessMsg=result.result.message
           setTimeout(() => {
            this.fundtranferSuccessMsg=''
          }, 2500);
        },
        (result:any)=>{
          this.fundtranferErrorMsg=result.error.message
          setTimeout(() => {
            this.fundtranferErrorMsg=''
          }, 2500);
        }
      )
      
    }
  }

  //clear fundr transfer
  clearFundTransferForm(){
    this.fundTransferForm.reset()
    this.fundtranferSuccessMsg=''
    this.fundtranferErrorMsg=''
  }
  logout(){

    localStorage.removeItem("toekn")
    localStorage.removeItem("acno")
    localStorage.removeItem("username")
    this.logoutdiv=true
     setTimeout(() => {
      this.router.navigateByUrl('')
      this.logoutdiv=false
     },4000);

    
  }
  deleteAccountFromNavBar(){
    this.acno=localStorage.getItem('acno')
  }
}

import { transition } from '@angular/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'bankApplication/login',
    pathMatch:'full'
  },
  {
    path:'bankApplication/login',
    component:LoginComponent
  },
  {
    path:'bankApplication/registration',
    component:RegistrationComponent
  },
  {
    path:'bankApplication/dashboard',
    component:DashboardComponent
  },
  {
    path:'bankApplication/transaction',
    component:TransactionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

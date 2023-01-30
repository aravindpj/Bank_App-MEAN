import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(allTransaction:[],searchKey:string,propName:string):any {
    const result:any=[]
    if(!allTransaction || searchKey=='' || propName==''){ return allTransaction}
    allTransaction.forEach((item:any)=>{
      if(item[propName].trim().toLowerCase().includes(searchKey.toLowerCase()))
      {
        result.push(item)
      }
    })
    return result;
  }

}

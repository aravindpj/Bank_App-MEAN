const db = require("./db");
const jwt=require('jsonwebtoken')
const register = (uname, acno, pswd) => {
  return db.User.findOne({
    acno,
  }).then((result) => {
    if (result) {
      return {
        statusCode: 403,
        message: "Account already exist!",
      };
    } else {
      const newUser = new db.User({
        username: uname,
        acno,
        password: pswd,
        balance: 0,
        transaction: [],
      });
      newUser.save();
      return {
        statusCode: 200,
        message: "Register successfull...",
      };
    }
  });
};

const login = (acno, pswd) => {
  if (!acno || !pswd) {
    return {
      statusCode: 404,
      message: "Please provide acccno and password!"
    };
  }
  return db.User.findOne({ acno, password: pswd }).then((result) => {
    if (result) {
      const token=jwt.sign({
        currentAcno:acno
      },'mysupersecretkey3434')
      return {
        statusCode: 200,
        message: "Login successfull",
        username:result.username,
        currentAcno:acno,
        token
      };
    } else {
      return {
        statusCode: 403,
        message: "invalid account number and password",
      };
    }
  });
};
const getBalance=(acno)=>{
   return db.User.findOne({
    acno
   }).then((result)=>{
     if(result){
      return {
        statusCode:200,
        balance:result.balance
      }
     }else{
      return{
        statusCode:404,
        message:"Invalid! Acount number"
      }

     }
   })
}
const deposit=(accno,amt)=>{
  let amount= Number(amt)
  console.log(accno);
  return db.User.findOne({
    acno:accno
  }).then((result)=>{
    
    if(result){
      result.balance +=amount,
      result.transaction.push({
        type:"CREDIT",
        fromAccno:accno,
        toAccno:accno,
        amount
      })
      result.save()
      return{
        statusCode:200,
        message:'Amount succesfully deposit'
      }
    }else{
      return{
        statusCode:404,
        message:'Invalid account'
      }
    }
  })
}
//fund transfer
const fundTransfer=(fromAccno,toAccno,pswd,amt)=>{
  let amount=Number(amt)
  let from=fromAccno
  return db.User.findOne({
    acno:from,
    password:pswd
  }).then(result=>{
    console.log(result);
    if(result){
         // getting debit account detail
         let fromAccnoBalance=result.balance
         if(fromAccnoBalance>=amount){
            result.balance=fromAccnoBalance-amount
            // get credit account details 
            result.save()
            return db.User.findOne({
              acno:toAccno
            }).then(creditData=>{
              if(creditData){
                 console.log(creditData);
                 creditData.balance+=amount
                 creditData.transaction.push({
                  type:"CREDIT",
                  fromAccno:fromAccno,
                  toAccno:toAccno,
                  amount
                })
                 creditData.save()
                 return{
                  statusCode:200,
                  message:"Amount Transfer Succefully"
                 }
              }else{
                return {
                  statusCode:401,
                  message:"Invalid credit account!"
                }
              }
            })

         }else{
           return {
            statusCode:403,
            message:"Insufficient Balance"
           }
         }
    }else{
      return {
        statusCode:401,
        message:"Inavlid Debi account number or Password !"
      }
    }
  })

}

const getAllTransaction=(req)=>{
   let acno=req.fromAccno
   return db.User.findOne({
    acno
   }).then((result)=>{
    if(result){
       return {
        statusCode:200,
        transaction:result.transaction
                     
       }
    }else{
      return {
        statusCode:401,
        message:"Invalid Account number"
      }
    }
   })
}

module.exports = {
  getAllTransaction,
  register,
  login,
  getBalance,
  deposit,
  fundTransfer
};

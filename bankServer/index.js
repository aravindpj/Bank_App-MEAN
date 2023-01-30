const express = require("express");
const cors = require("cors");
const server = express();
const dataService = require("./services/dataService");
const jwt = require("jsonwebtoken");
server.use(
  cors({
    origin: `http://localhost:${4200}`,
  })
);

server.use(express.json());

//application specific middleware
const applicationSpecify = (req, res, next) => {
  console.log(" application middleware");
  next();
};

server.use(applicationSpecify);

//router specific middleware
const jwtMiddleware = (req, res, next) => {
  //get token form requested headers
  const token = req.header(`authenticate`);
  console.log(token);
  // verify token
  try {
    const data = jwt.verify(token, "mysupersecretkey3434");
    req.fromAccno=data.currentAcno
    next();
  } catch (error) {
    console.log("Invalid token");
    res.status(401).json({
      message: "Please Login",
    });
  }
};

server.get("/", function (req, res) {
  res.status(200).json({
    status: "testing GET",
  });
});

server.post("/register", async (req, res) => {
  const result = await dataService.register(
    req.body.username,
    req.body.accno,
    req.body.password
  );
  res.status(result.statusCode).json({
    status: "checking",
    result,
  });
});

server.post("/login", async (req, res) => {
  const result = await dataService.login(req.body.accno, req.body.password);
  res.status(result.statusCode).json({
    status: "success",
    result,
  });
});

server.get("/getBalance/:accno", jwtMiddleware, async (req, res) => {
  const result = await dataService.getBalance(req.params.accno);

  res.status(result.statusCode).json({
    status: "success",
    result,
  });
});
server.post("/deposit", async (req, res, next) => {
  try {
    const result = await dataService.deposit(req.body.accno, req.body.amount);
    if (result.statusCode === 404) throw new Error(result.message);

    res.status(result.statusCode).json({
      status: "success",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

server.post("/fundTransfer", jwtMiddleware, async (req, res) => {
  try {
    const result = await dataService.fundTransfer(
      req.body.fromAccno,
      req.body.toAccno,
      req.body.password,
      req.body.amount
    );
    if (result.statusCode === 404) throw new Error(result.message);
    res.status(result.statusCode)
    .json({
       status:"success",
       result
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

server.get('/all-transactions',jwtMiddleware,(req,res)=>{
   dataService.getAllTransaction(req).then((result)=>{
    res.status(result.statusCode).json(result)
   })
})

server.listen(3000, () =>
  console.log(`server running on http://localhost:${3000}`)
);

var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config();
var stockHolder =[];
var customerChoice ;
var customerAmount ;
var qtyIn ;

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(function(err) {
  if (err) throw err;
  starter();
  runThrough();
});
function starter() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Who are you?",
      choices: [
        "Customer",
        "Manager",
        "Superviser",
        "Exit"
      ]
    })
    .then((answer)=> {
      whichAnswer(answer);
    });
    
}
function runThrough(){
  const query = "SELECT product_desc FROM stock";
  connection.query(query, (err, res) => {
    if (err) throw err;

    for (let i = 0; i < res.length; i++) {
      stockHolder.push(res[i].product_desc);
    }
 //console.log(stockHolder);
  });
}
function whichAnswer(answer){
  switch (answer.action) {
    case "Customer":
    runThrough();
    customerShop();
      break;

    case "Manager":
      console.log("manager");
      break;

    case "Superviser":
      console.log("superviser");
      break;

    case "Exit":
      exit();
    }
}

function customerShop(){
  
    inquirer
      .prompt({
        name: "item",
        type: "rawlist",
        message: "Which item do you want?",
        choices: stockHolder
      })
      .then((answer)=> {
        customerChoice =answer.item;
        
        getMany();
      });
  
};
function getMany(){
 
  inquirer
  .prompt({
    name: "amount",
    type: "input",
    message: "Which how many?",
  })
  .then((answer)=> {
    customerAmount =answer.amount;
 checktheQTY();
  });
};

function checktheQTY(){
  const query = "SELECT instock_qty FROM stock where product_desc = ?";
  connection.query(query, customerChoice, (err, res) => {
    if (err) throw err;
 qtyIn =res[0].instock_qty;
    if(qtyIn > customerAmount ){
      console.log("You bought "+customerAmount+" of "+customerChoice);
      updateStock();
    }else if( qtyIn === 0){
      console.log("Sorry we are out of stock of "+customerChoice);
    }else if (qtyIn < customerAmount && qtyIn > 0){
      Console.log("All we left is "+qtyIn+ " of "+customerChoice);
      doyouwant();
    }
  });
};
function updateStock(){ 
  
  const query2 = 'UPDATE stock SET instock_qty = ? WHERE product_desc = ?';
  var newQTY= qtyIn - customerAmount;
  connection.query(query2, [newQTY, customerChoice], function(err,res) {
    if (err) throw err;

  });
};
function doyouwant(){
  inquirer
      .prompt({
        name: "yn",
        type: "rawlist",
        message: "Do you want the remianing amount?",
        choices: [
          "Yes",
          "No",
        ]
      })
      .then((answer)=> {
        if(answer.yn === "Yes"){
          const query2 = 'UPDATE stock SET instock_qty = 0 WHERE product_desc = ?';
          var newQTY= qtyIn - customerAmount;
          connection.query(query2, customerChoice, function(err,res) {
            if (err) throw err;
        
          });
        }else {
          Console.log('Sorry');
          exit();
        }
      });
}
function exit(){
  process.exit();
};
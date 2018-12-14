var mysql = require("mysql");
var inquirer = require("inquirer");
var consolet = require("console.table");
require('dotenv').config();
var stockHolder =[];
var customerChoice ;
var customerAmount ;
var qtyIn ;
var managerChoice;
var managerAmount;
var qtyHold;
var superHold1=[];
var superHold2=[];

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
function keepCustomer(){
  inquirer
    .prompt({
      name: "action",
      type: "confirm",
      message: "Keep Shopping?",
    })
    .then((answer)=> {
      if(answer){
        customer();
      }else{
        starter();
      }
    });
    
}
function stayManager(){
  inquirer
    .prompt({
      name: "action",
      type: "confirm",
      message: "Stay in manager?",
    })
    .then((answer)=> {
      if(answer){
        manager();
      }else{
        starter();
      }
    });
    
}
function whichAnswer(answer){
  switch (answer.action) {
    case "Customer":
  customer();
      break;

    case "Manager":
      manager();
      break;

    case "Superviser":
      superviser();
      break;

    case "Exit":
      exit();
    }};
function customer(){

  customerShop();
};
runThrough();

function superviser(){
  const query = " select sum(customer_price) as price, sum(instock_qty) as total, dept from stock group by dept";
  connection.query(query, (err, res) => {
    if (err) throw err;

  

  const query2 = " select * from depos";
  connection.query(query2, (err, result) => {
    if (err) throw err;
  superHold2.push(result);
    console.log(res);
    console.log(result);
  });

  
  });
 //console.log(headCost+' '+totalSt);
  
  //   if(answer.chooser === 'Produce'){
  //     const query = " select sum(customer_price) as price from stock where dept = ?";
  //     connection.query(query,answer.chooser, (err, res) => {
  //       if (err) throw err;
  //  headCost = res[0].price;});
  //   }else if(answer.chooser === 'Chilled'){
  //     const query = " select sum(customer_price) as price from stock where dept = ?";
  //     connection.query(query,answer.chooser, (err, res) => {
  //       if (err) throw err;
  //  headCost = res[0].price;});
  //   }else{
  //     const query = " select sum(customer_price) as price from stock where dept = ?";
  //     connection.query(query,answer.chooser, (err, res) => {
  //       if (err) throw err;
  //  headCost = res[0].price;});
  //   }


};
function whichAction(answer){
  switch (answer.action) {
    case "View Products for Sale":
    productView();
      break;

    case "View Low Inventory":
      lowInventory();
      break;

    case "Add to Inventory":
      addInventory();
      break;

    case "Add New Product":
    newerOne();
    break;

    case "Exit":
    exit();
  }  
};

function manager() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "what do you want to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"

      ]
    })
    .then((answer)=> {
      whichAction(answer);
    });
    
};
function productView(){
  //console.log('made it here');
  const query = "select item_id, product_desc, instock_qty from stock";
  connection.query(query, (err, res) => {
    if (err) throw err;
 for(i=0;i<res.length;i++){
   console.log("|| item id: "+res[i].item_id+"|| name: "+res[i].product_desc+"|| qty in stock: "+res[i].instock_qty+'\n');
 }
stayManager();
  
});
};

function newerOne(){
getid();
};
var id;
function getid(){
  inquirer
  .prompt([
    {
    name: "id",
    type: "input",
    message: "what is the id",
  },{
    name: "name",
    type: "input",
    message: "what is the name?"
  },{
    name: "dept",
    type: "input",
    message: "what is the dept?",
  },{
    name: "price",
    type: "input",
    message: "what is the price?",
  },{
    name: "qty",
    type: "input",
    message: "what is the qty",
  }
])
  .then((answer)=> { 
    connection.query(
      "INSERT INTO stock SET ?",
      {
        item_id: answer.id,
        product_desc: answer.name,
        dept: answer.dept,
        customer_price: answer.price,
        instock_qty:answer.qty
      },
      function(err) {
        if (err) throw err;
        console.log("You added "+answer.qty +" of "+ answer.name);
    
      }
    );
stayManager();

  }); 
};

function lowInventory(){
  const query = "select item_id, product_desc, instock_qty from stock where instock_qty < 10";
  connection.query(query, (err, res) => {
    if (err) throw err;
    if(res.length > 0){
      for(i=0;i<res.length;i++){
        console.log("|| item id: "+res[i].item_id+"|| name: "+res[i].product_desc+"|| qty in stock: "+res[i].instock_qty+'\n');
     }
    } else(console.log("all stock above 10!"));
stayManager();

  });
}
function addInventory(){
  inquirer
  .prompt({
    name: "item",
    type: "rawlist",
    message: "Which item do you want?",
    choices: stockHolder
  })
  .then((answer)=> {
    managerChoice =answer.item;
    getAmount();
  });
};
function getAmount(){
  //gets the amount the managmer wants to place
  inquirer
  .prompt({
    name: "amount",
    type: "input",
    message: "Add how much?",
  })
  .then((answer)=> {
  
    managerAmount = parseFloat(answer.amount);
    qtyUpdate();
 
  });
  
} 
function qtyUpdate(){
  const query1 = "SELECT instock_qty FROM stock where product_desc = ?";
  connection.query(query1, managerChoice, (err, res) => {
    if (err) throw err;

    qtyHold =  parseInt(res[0].instock_qty)

    instockUpdate();
    
  });
}
function instockUpdate(){

  var newHold =qtyHold + managerAmount;
    const query = "UPDATE stock SET instock_qty = ? WHERE product_desc = ?";
    connection.query(query,[newHold, managerChoice], (err, res) => {
      if (err) throw err;
      console.log("updated amount of "+managerChoice+ " to "+newHold);
     
    stayManager();
  });
    
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
    message: "How many?",
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
    keepCustomer();
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
            keepCustomer();
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
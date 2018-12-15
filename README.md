# SQLbananza

Hi all! welcome to SQLBananza where you can go shopping, be a manager or superviser.
Open the github and see  the video or do a gitpull and try it yourself.

To get started, creat a .env with :
DB_HOST=
DB_USER=
DB_PASS=
DB_PORT=
DB_NAME=

After that open mysql workbench and run the following:

DROP DATABASE IF EXISTS sqlBananzaDB;
CREATE database sqlBananzaDB;

USE sqlBananzaDB;

CREATE TABLE stock (
  position INT auto_increment,
  item_id int NOT NUll,
  product_desc VARCHAR(20) NOT NUll,
  dept VARCHAR(20) NOT NUll,
  customer_price DECIMAL(10,4) NOT NULL,
instock_qty DECIMAL(10,4) NOT NULL,
  PRIMARY KEY (position)
);

CREATE TABLE depos (
  dept_id INT auto_increment,
  dept_name VARCHAR(20) NOT NUll,
  overhead_price DECIMAL(10,4) NOT NULL,
  PRIMARY KEY (dept_id)
);


After running those import stock.csv into stock table, and insert department.csv into depos.
Ensure the data has imported correctly.

Next launch custom.js in command prompt. npm install dotenv, inquirer, mysql, console.table

After that you can select customer, manager, superviser, or exit.
Each user has there own functionality.

Have fun!
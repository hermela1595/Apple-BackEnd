// Question 1: Create a MySQL database by the name "myDB" and create a database user by
// the name "myDBuser" with a permissions to connect with the "myDB" database. Use the
// "mysql" module to create a connection with the newly created database. Display console
// message if the connection is successful or if it has an error.

const mysql = require("mysql");
const express = require("express");
// const bodyparser = require("body-parser");
var cors= require("cors")

let app = express();

app.use(cors())

app.listen(3001, () => console.log("Listening to :3001"));

app.use(express.json());

// app.use(app.json());
// app.use(app.urlencoded({
//     extended: true
// }))
var mysqlConnection = mysql.createConnection({
  user: "hermi",
  password: "hermi",
  host: "127.0.0.1",
  database: "hermi",
});

mysqlConnection.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected");
});

app.get("/install", (req, res) => {
  let message = "Tables Created";
  let createProducts = `CREATE TABLE if not exists Products(
        product_id int auto_increment,
        product_url varchar(255) not null,
        product_name varchar(255) not null,
        PRIMARY KEY (product_id))`;

  mysqlConnection.query(createProducts, (err, results, fields) => {
    if (err) console.log(err);
  });

  let createProductDescription = `CREATE TABLE if not exists ProductDescription(
    description_id int auto_increment,
    product_id int(11) not null,
    product_brief_description TEXT not null,
    product_description TEXT not null,
    product_img varchar(255) not null,
    product_link varchar(255) not null,
    PRIMARY KEY (description_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
)`;

  mysqlConnection.query(createProductDescription, (err, results, fields) => {
    if (err) console.log(err);
  });

  let createProductPrice = `CREATE TABLE if not exists ProductPrice(
    price_id int auto_increment,
    product_id int(11) not null,    
    starting_price varchar(255) not null,
    price_range varchar(255) not null,
    PRIMARY KEY (price_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
)`;

  mysqlConnection.query(createProductPrice, (err, results, fields) => {
    if (err) console.log(err);
  });

let createUser = `CREATE TABLE if not exists Users(
	user_id int auto_increment, 
	user_name VARCHAR(50) not null,
	password VARCHAR(255) not null,
	PRIMARY KEY (user_id)
	
  )`;


  mysqlConnection.query(createUser, (err, results, fields) => {
    if (err) console.log(err);
  });
  let createOrders = `CREATE TABLE if not exists Orders( 
    orders_id int auto_increment,
    product_id int(11) not null,
    user_id int (230)not null,
    PRIMARY KEY (orders_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
    )`;

  mysqlConnection.query(createOrders, (err, results, fields) => {
    if (err) console.log(err);
    // if (err) {
    //   console.error('Error creating "users" table:', err);
    // } else {
    //   console.log('"users" table created successfully');
    // }
  });
  res.end(message);
});

//End of Question 2//       
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.post("/add-product", (req, res) => {
  console.table(req.body);

  const {
    imgPath,
    iphoneLink,
    iphoneTitle,
    startPrice,
    priceRange,
    briefDescription,
    fullDescription,
    userName,
    password,
  } = req.body;

  // console.log(req.body["product_id"]);

  let insertProduct = `INSERT INTO Products (product_url, product_name) VALUES (?, ?)`;

  // console.log(iphoneLink);

  let insertDescription = `INSERT INTO ProductDescription (product_id, product_brief_description,  product_description,  product_img, product_link) VALUES (?, ?, ?, ?, ?)`;

  let insertPrice = `INSERT INTO ProductPrice (product_id, starting_price, price_range) VALUES (?, ?, ?)`;

  let insertUser = `INSERT INTO Users (user_name, password) VALUES (?, ?)`;

  let insertOrder = `INSERT INTO Orders (product_id, user_id) VALUES (?, ?)`;

  mysqlConnection.query(
    insertProduct,
    [iphoneLink, iphoneTitle],
    (err, results, fields) => {
      if (err) console.log(err);
      console.log(results);

      const id = results.insertId;
      // console.log(id);

      mysqlConnection.query(
        insertDescription,
        [id, briefDescription, fullDescription, imgPath, iphoneLink],
        (err, results, fields) => {
          if (err) console.log(err);
        });

      mysqlConnection.query(
        insertPrice,
        [id, startPrice, priceRange],
        (err, results, fields) => {
          if (err) console.log(err);
      });

      mysqlConnection.query(
        insertUser,
        [userName, password],
        (err, results, fields) => {
          if (err) console.log(err);

          const userId = results.insertId;

          mysqlConnection.query(
            insertOrder,
            [id, userId],
            (err, results, fields) => {
              if (err) console.log(err);
            });
        });
    });

  res.end("You have successfully added product...");
});

app.get("/iphones", (req, res) => {
  mysqlConnection.query(
      "SELECT * FROM Products INNER JOIN ProductDescription INNER JOIN ProductPrice ON Products.product_id = ProductDescription.product_id AND Products.product_id = ProductPrice.product_id",
      (err, rows) => {
          // let iphones = { products: [] };
          // iphones.products = rows;
          // var stringIphones = JSON.stringify(iphones);
          if (!err) res.json(rows);
          else console.log(err);
      }
  );
});
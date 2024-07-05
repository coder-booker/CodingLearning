const exp = require('express');
const mysql = require('mysql');
const main = exp();


main.get("/", (req, res) => {
  res.send("Hello World!");
});

main.get("/mysql", (req, res) => {
  console.log("MySQL connection");
  const con = mysql.createConnection({
    host: "localhost", 
    port: "1146",
    user: "bruh", 
    password: "123123",
  });
  
  con.connect((err) => {
    if (err) {
      console.log("not bruh");
      console.log(err);
      return res.send("Error: " + err);
    }
    else {
      console.log("bruh");
      return res.send("Connected to MySQL!");
    }
  }).then(() => {
    con.query("USE test_db", (err, result) => {
      if (err) {
        return res.send("Error: " + err);
      }
      else {
        return res.send("Database 'test' is used!");
      }
    });
  });
  // con.query("CREATE DATABASE IF NOT EXISTS test_db", (err, result) => {
  //   if (err) {
  //     res.send("Error: " + err);
  //     return;
  //   }
  //   else {
  //     res.send("Database 'test' is created!");
  //     return;
  //   }
  // });
  // use databases

  // // query
  // con.query("SELECT * FROM test_table", (err, result, fields) => {
  //   if (err) {
  //     res.send("Error: " + err);
  //   }
  //   else {
  //     res.send(result);
  //   }
  //   return;
  // });
});

main.listen(1145, () => {
  console.log('Server "playground" is running on port 1145');
});

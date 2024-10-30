const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "taski",
  port: "3306",
});

const saltRounds = 10;

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okey" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

// Endpoint rejestracji
app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO register (`name`,`surname`,`email`,`phone`,`bankAccount`,`pesel`,`password`,`shift_id`,`roles_id`,`departments_id`) VALUES (?)";
  //hashowanie hasła
  bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
    if (err) return res.json({ Error: "Error hashing password" });

    const values = [
      req.body.name,
      req.body.surname,
      req.body.email,
      req.body.phone,
      req.body.bankAccount,
      req.body.pesel,
      hash,
      req.body.shift_id,
      req.body.roles_id,
      req.body.departments_id,
    ];
    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Error inserting data" });
      return res.json({ Status: "success" });
    });
  });
});

// Endpoint logowania
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM register WHERE `email` = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      console.error("Database error:", err);
    }
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, result) => {
          if (err) {
            console.log({ Error: "Error comparing passwords: ", err });
          }
          if (result) {
            const name = data[0].name;
            const role = data[0].role;
            const token = jwt.sign({ name, role }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.json({ Status: "Success", role: role });
          } else {
            return res.json({ Error: "Password not matched" });
          }
        }
      );
    } else {
      return res.status(401).json("Fail");
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success logout" });
});

app.post("/schedule", (req, res) => {
  const sql = "INSERT INTO machines (`machine_name`,`number_staff`) VALUES (?)";
  const values = [req.body.machine_name, req.body.number_staff];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Error inserting data into machines" });
    return res.json({ Status: "Success " });
  });
});

app.get("/schedule", (req, res) => {
  const sql = "SELECT * FROM machines";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

app.get("/roles", (req, res) => {
  const sql = "SELECT * FROM roles";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

app.get("/departments", (req, res) => {
  const sql = "SELECT * FROM departments";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

app.get("/shifts", (req, res) => {
  const sql = "SELECT id_shifts, shift_name FROM shifts";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

app.get("/employees", (req, res) => {
  const sql = "SELECT name,surname FROM register WHERE roles_id = 2";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

// app.post("/sendHolidayInquiry",(req.res)=>{
//   const values = [req.body.name, req.body.]
// })

// Serwer nasłuchujący na porcie 5000
app.listen(5000, () => {
  console.log("Serwer działa na porcie 5000");
});

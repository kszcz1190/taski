const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dayjs = require("dayjs");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
  host: "srv27.mikr.us",
  user: "admin_taski",
  password: "ASWplo019",
  database: "taski",
  port: "20179",
});
db.connect((err) => {
  if (err) {
    console.error("Błąd połączenia z bazą danych:", err);
    return;
  }
  console.log("Połączono z bazą danych");
});

const saltRounds = 10;

const verifyUser = (req, res, next) => {
  let token;

  // Pobierz token z nagłówka Authorization lub z ciasteczka
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // token z nagłówka
  } else if (req.cookies.token) {
    token = req.cookies.token; // token z ciasteczka
  }

  if (!token) {
    return res.status(401).json({ error: "Brak tokena uwierzytelniającego" });
  }

  try {
    // Weryfikacja tokena i odczytanie jego zawartości
    const decoded = jwt.verify(token, "SECRETKEY");
    req.user = decoded; // Przechowaj dane użytkownika w obiekcie req
    next(); // Przejdź dalej
  } catch (err) {
    return res.status(401).json({ error: "Nieprawidłowy lub wygasły token" });
  }
};

app.get("/", verifyUser, (req, res) => {
  // W odpowiedzi zwracamy imię użytkownika i status
  return res.status(200).json({
    Status: "Success",
    id_user: req.user.userId,
    first_name: req.user.first_name,
    role: req.user.role,
  });
});

// Endpoint rejestracji
app.post("/register", (req, res) => {
  const sql = `
    INSERT INTO user 
    (first_name, last_name, email, phone, bank_account, date_of_birth, password, shift_id, role_id, dept_id) 
    VALUES (?)`;

  const formattedDate = dayjs(req.body.date_of_birth).format("YYYY-MM-DD");

  bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
    if (err) return res.json({ Error: "Error hashing password" });

    const values = [
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.phone,
      req.body.bank_account,
      formattedDate, // Używamy sformatowanej daty
      hash,
      req.body.shift_id,
      req.body.role_id,
      req.body.dept_id,
    ];

    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Error inserting data" });
      return res.json({ Status: "success" });
    });
  });
});

app.post("checkEmail", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (user.length > 0) {
      return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Endpoint logowania
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM user WHERE `email` = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, result) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          if (result) {
            const token = jwt.sign(
              {
                userId: data[0].id_user,
                role: data[0].role_id,
                first_name: data[0].first_name,
              },
              "SECRETKEY",
              { expiresIn: "1d" } // Dodajemy czas wygaśnięcia tokena
            );
            res.cookie("token", token, {
              //httpOnly: true, // Zabezpieczenie przed JavaScript
              secure: false, // Włącz "true" w środowisku produkcyjnym (HTTPS)
              sameSite: "Lax", // Zabezpieczenie przed CSRF
              maxAge: 24 * 60 * 60 * 1000, // Czas życia ciasteczka (1 dzień)
            });
            if (data[0].blocked === 1) {
              console.log("data[0].blocked", data[0].blocked);
              return res
                .status(401)
                .json({ success: false, error: "Account is blocked" });
            }
            return res.status(200).json({
              success: true,
              token: token,
              userId: data[0].id_user,
              role: data[0].role_id,
              first_name: data[0].first_name,
            });
          } else {
            return res
              .status(401)
              .json({ success: false, error: "Password is incorrect" });
          }
        }
      );
    } else {
      return res.status(401).json({ success: false, error: "User not found" });
    }
  });
});

//grafik dla pracownika z wyswietleniem daty , dnia tygodnia, maszyny, wspolpracownikow
app.get("/user/schedule", (req, res) => {
  const { userId, weekDates } = req.query;

  const sql = `
    SELECT 
      w.date AS schedule_date,
      IFNULL(m.machine_name, 'Brak przypisania do maszyny') AS machine_name,
      IFNULL(GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', '), '') AS colleagues
    FROM (
      SELECT ? AS date
      UNION ALL SELECT ? UNION ALL SELECT ? UNION ALL SELECT ?
      UNION ALL SELECT ? UNION ALL SELECT ? UNION ALL SELECT ?
    ) w
    LEFT JOIN schedule s ON s.schedule_date = w.date AND s.user_id = ?
    LEFT JOIN machines m ON s.machine_id = m.id_machines
    LEFT JOIN schedule s2 ON s2.schedule_date = w.date AND s2.machine_id = s.machine_id AND s2.user_id != ?
    LEFT JOIN user u ON s2.user_id = u.id_user
    GROUP BY w.date, m.machine_name
    ORDER BY w.date;
  `;

  db.query(sql, [...weekDates, userId, userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const result = data.map((row) => ({
      schedule_date: row.schedule_date,
      machine_name: row.machine_name,
      colleagues: row.colleagues
        ? row.colleagues.split(", ").map((colleague) => {
            const [first_name, last_name] = colleague.split(" ");
            return { first_name, last_name };
          })
        : [],
    }));
    return res.json(result);
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ Status: "Success" });
});

app.post("/machines", (req, res) => {
  const sql = "INSERT INTO machines (machine_name,count_staff) VALUES (?)";
  const values = [req.body.machine_name, req.body.count_staff];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Error inserting data into machines" });
    return res.json({ Status: "Success " });
  });
});

app.get("/machines", (req, res) => {
  const sql =
    "SELECT * FROM machines where id_machines!=10 ORDER BY machine_name";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching machines: ", err); // Dodaj logowanie błędów
      return res.status(500).json({ Error: "Error fetching machines" });
    }
    return res.json(data);
  });
});

app.get("/roles", (req, res) => {
  const sql = "SELECT * FROM role";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

app.get("/departments", (req, res) => {
  const sql = "SELECT * FROM department";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

app.get("/shifts", (req, res) => {
  const sql = "SELECT id_shift, shift_name FROM shift";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});

app.get("/employees", (req, res) => {
  const sql = "SELECT id_user,first_name,last_name FROM user where role_id=1";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error: ", err);
    return res.json(data);
  });
});
app.get("/employees/searchbar", (req, res) => {
  const search = req.query.search || ""; // Odczytaj parametr wyszukiwania
  const sql = `
    SELECT id_user, first_name, last_name 
    FROM user 
    WHERE first_name LIKE ? OR last_name LIKE ? 
    ORDER BY last_name, first_name;`;
  db.query(sql, [`%${search}%`, `%${search}%`], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(data);
  });
});

app.get("/employees/check", async (req, res) => {
  //Pobranie liczby pracowników którzy nie zostali przypisani do maszyn
  const { date } = req.query;
  const sql = `
    SELECT id_user, first_name, last_name
    FROM user
    WHERE id_user NOT IN (
      SELECT user_id
      FROM schedule
      WHERE schedule_date = ?
    )`;
  db.query(sql, [date], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Employees not assigned:", data);
    console.log("liczba", data.length);
    return res.json(data);
  });
});

app.post("/schedule", async (req, res) => {
  const { schedules } = req.body;
  console.log("schedules", schedules);

  if (!schedules || !Array.isArray(schedules)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const sql = `
    INSERT INTO schedule (schedule_date, machine_id, user_id)
    VALUES ?
  `;

  const values = schedules.map((s) => [
    s.schedule_date,
    s.machine_id,
    s.user_id,
  ]);

  db.query(sql, [values], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to save schedule", details: err.message });
    }
    res.json({ success: true });
  });
});

app.post("/schedule/check", async (req, res) => {
  const { userId, scheduleDate } = req.body;

  try {
    db.query(
      "SELECT * FROM schedule WHERE user_id = ? AND DATE(CONVERT_TZ(schedule_date, '+00:00', '+01:00')) = DATE(?)",
      [userId, scheduleDate],
      (error, results) => {
        if (error) {
          console.error("Error during schedule check:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
          return res.json({ isAssigned: true });
        } else {
          return res.json({ isAssigned: false });
        }
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/machines/check", async (req, res) => {
  const { date } = req.query; // Pobieramy "date" bez destrukturyzacji "scheduleDate"
  const sql = `
    SELECT *
    FROM machines
    WHERE id_machines NOT IN (
      SELECT machine_id
      FROM schedule
      WHERE schedule_date = ?
    ) AND id_machines != 10;`;
  db.query(sql, [date], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.get("/schedule/list", async (req, res) => {
  const { date } = req.query; // Pobieramy datę z query params

  let sql = `
    SELECT s.schedule_date, m.machine_name,m.id_machines, u.first_name, u.last_name
    FROM schedule s
    JOIN machines m ON s.machine_id = m.id_machines
    JOIN user u ON s.user_id = u.id_user
    WHERE s.schedule_date = ? 
    ORDER BY s.schedule_date, m.machine_name, u.last_name;`;

  db.query(sql, [date], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    // Grupowanie danych według maszyn
    const groupedData = data.reduce((acc, row) => {
      const machineName = row.machine_name;
      if (!acc[machineName]) {
        acc[machineName] = [];
      }
      acc[machineName].push(`${row.first_name} ${row.last_name}`);
      return acc;
    }, {});

    return res.json(groupedData); // Zwracamy pogrupowane dane
  });
});

app.get("/workhistory", async (req, res) => {
  const sql = `
    SELECT 
      u.id_user,
      u.first_name, 
      u.last_name, 
      w.date_start_employment, 
      w.date_end_employment, 
      w.used_days,
      w.days_to_use
    FROM workHistory w
    JOIN user u ON w.user_id = u.id_user
    ORDER BY u.last_name;`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database query error:", err); // Log błędu
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.get("/userData", async (req, res) => {
  const { user } = req.query;
  const sql = `SELECT * FROM user WHERE id_user = ?`;

  db.query(sql, [user], (err, data) => {
    if (err) {
      console.error("Database query error:", err); // Log błędu
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.put("/userData", (req, res) => {
  const {
    userId,
    first_name,
    last_name,
    email,
    phone,
    bank_account,
    city,
    street,
    house_number,
    date_of_birth,
  } = req.body;

  if (
    !userId ||
    !first_name ||
    !last_name ||
    !email ||
    !phone ||
    !bank_account ||
    !city ||
    !street ||
    !house_number ||
    !date_of_birth
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE user
    SET first_name = ?, last_name = ?, email = ?, phone = ?, bank_account = ?, city = ?, street = ?, house_number = ?, date_of_birth = ?
    WHERE id_user = ?; 
  `;
  db.query(
    sql,
    [
      first_name,
      last_name,
      email,
      phone,
      bank_account,
      city,
      street,
      house_number,
      date_of_birth,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err); // Logowanie błędów
        return res.status(500).json({ error: "Internal server error" });
      }

      // Sprawdzenie, czy rekord został zaktualizowany
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json({ message: "Success" });
    }
  );
});

app.get("/workhistory/user", async (req, res) => {
  const { user } = req.query;
  const sql = `
    SELECT 
      u.id_user,
      w.date_start_employment,
      w.date_end_employment,
      w.used_days,
      w.days_to_use
    FROM workHistory w
    JOIN user u ON w.user_id = u.id_user
    WHERE u.id_user = ?`;

  db.query(sql, [user], (err, data) => {
    if (err) {
      console.error("Database query error:", err); // Log błędu
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});
app.put("/workhistory", (req, res) => {
  const { userId, date_start_employment, date_end_employment, used_days } =
    req.body;

  if (!userId || !date_start_employment || !date_end_employment || !used_days) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE workHistory
    SET date_start_employment = ?, date_end_employment = ?, used_days = ?
    WHERE user_id = ?; -- Aktualizacja dla konkretnego user_id
  `;

  // Wykonanie zapytania SQL z przekazanymi parametrami
  db.query(
    sql,
    [date_start_employment, date_end_employment, used_days, userId],
    (err, result) => {
      if (err) {
        console.error("Database error:", err); // Logowanie błędów
        return res.status(500).json({ error: "Internal server error" });
      }

      // Sprawdzenie, czy rekord został zaktualizowany
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json({ message: "Success" });
    }
  );
});

//Kiedy zmienia supervisor
app.put("/userData/employee", (req, res) => {
  const {
    userId,
    first_name,
    last_name,
    email,
    phone,
    country,
    post_code,
    city,
    street,
    house_number,
    block_number,
    bank_account,
    shift_id,
    role_id,
    dept_id,
    date_of_birth,
  } = req.body;

  const formattedDate = dayjs(req.body.date_of_birth).format("YYYY-MM-DD");
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `
    UPDATE user
    SET 
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      country = COALESCE(?, country),
      post_code = COALESCE(?, post_code),
      city = COALESCE(?, city),
      street = COALESCE(?, street),
      house_number = COALESCE(?, house_number),
      block_number = COALESCE(?, block_number),
      bank_account = COALESCE(?, bank_account),
      shift_id = COALESCE(?, shift_id),
      role_id = COALESCE(?, role_id),
      dept_id = COALESCE(?, dept_id),
      date_of_birth = COALESCE(?, date_of_birth)
    WHERE id_user = ?;
  `;

  db.query(
    sql,
    [
      first_name || null,
      last_name || null,
      email || null,
      phone || null,
      country || null,
      post_code || null,
      city || null,
      street || null,
      house_number || null,
      block_number || null,
      bank_account || null,
      shift_id || null,
      role_id || null,
      dept_id || null,
      formattedDate || null,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json({ message: "Success" });
    }
  );
});

//Kiedy zmienia użytkownik
app.put("/user/employee", (req, res) => {
  const {
    userId,
    first_name,
    last_name,
    email,
    phone,
    country,
    post_code,
    city,
    street,
    house_number,
    block_number,
    bank_account,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `
    UPDATE user
    SET 
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      country = COALESCE(?, country),
      post_code = COALESCE(?, post_code),
      city = COALESCE(?, city),
      street = COALESCE(?, street),
      house_number = COALESCE(?, house_number),
      block_number = COALESCE(?, block_number),
      bank_account = COALESCE(?, bank_account)
    WHERE id_user = ?;
  `;

  db.query(
    sql,
    [
      first_name || null,
      last_name || null,
      email || null,
      phone || null,
      country || null,
      post_code || null,
      city || null,
      street || null,
      house_number || null,
      block_number || null,
      bank_account || null,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json({ message: "Success" });
    }
  );
});

app.put("/changePassword", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Brak wymaganych danych." });
  }

  try {
    // Pobierz aktualne hasło użytkownika
    const sqlSelect = "SELECT password FROM user WHERE id_user = ?";
    db.query(sqlSelect, [userId], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Błąd wewnętrzny serwera." });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Użytkownik nie znaleziony." });
      }

      const hashedPassword = result[0].password;

      // Sprawdzenie starego hasła
      const match = await bcrypt.compare(oldPassword, hashedPassword);
      if (!match) {
        return res.status(401).json({ error: "Nieprawidłowe stare hasło." });
      }

      // Hashowanie nowego hasła
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      // Aktualizacja hasła
      const sqlUpdate = "UPDATE user SET password = ? WHERE id_user = ?";
      db.query(sqlUpdate, [newHashedPassword, userId], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Błąd wewnętrzny serwera." });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Nie udało się zaktualizować hasła." });
        }
        res.status(200).json({ message: "Success" });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Wystąpił nieoczekiwany błąd." });
  }
});

app.post("/sendMessage", async (req, res) => {
  const { sender_id, title, content, employeesId } = req.body;
  if (!sender_id || !title || !content || !employeesId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const created_date = new Date();

  const sqlInsertMessage = `
    INSERT INTO messages (sender_id, title, content, created_date)
    VALUES (?, ?, ?, ?);
  `;
  db.query(
    sqlInsertMessage,
    [sender_id, title, content, created_date],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const messageId = result.insertId;
      const sqlInsertRecipients = `
      INSERT INTO messageRecipients (mess_id, user_id)
      VALUES ?;
    `;
      const recipientsData = employeesId.map((user_id) => [messageId, user_id]);

      db.query(sqlInsertRecipients, [recipientsData], (err) => {
        if (err) {
          console.error("Błąd podczas dodawania odbiorców:", err);
          return res
            .status(500)
            .json({ success: false, error: "Błąd serwera." });
        }

        res.json({ success: true, message: "Wiadomość wysłana pomyślnie." });
      });
    }
  );
});

app.get("/messages", async (req, res) => {
  const { user_id } = req.query;
  const sql = `
    SELECT m.id_mess, m.sender_id, u.first_name, u.last_name, m.title, m.content, m.created_date
    FROM messages m
    JOIN user u ON m.sender_id = u.id_user
    JOIN messageRecipients mr ON m.id_mess = mr.mess_id
    WHERE mr.user_id = ?
    ORDER BY m.created_date DESC;
  `;

  db.query(sql, [user_id], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.get("/employees/usersData", async (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});
app.get("/Allemployees/userData", async (req, res) => {
  const { user } = req.query;
  const sql = `SELECT * FROM user WHERE id_user = ?`;

  db.query(sql, [user], (err, data) => {
    if (err) {
      console.error("Database query error:", err); // Log błędu
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.put("/employees/blockAccount", (req, res) => {
  const { id_user } = req.body;
  const sql = "UPDATE user SET blocked = 1 WHERE id_user = ?";
  db.query(sql, [id_user], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ success: true });
  });
});

app.put("/employees/unBlockAccount", (req, res) => {
  const { id_user } = req.body;
  const sql = "UPDATE user SET blocked = 0 WHERE id_user = ?";
  db.query(sql, [id_user], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ success: true });
  });
});

app.get("/user/position-order", (req, res) => {
  const { machineName } = req.query;
  console.log("machineName", machineName);
  const sql = `
    SELECT 
      o.machine_id,
      p.name,
      o.orderPositions from machinesPositions p 
      join positionsOrder o on p.id_mPositions = o.position_id
      where o.machine_id = (select id_machines from machines where machine_name = ?);
  `;
  db.query(sql, [machineName], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
});

app.delete("/schedule/delete", (req, res) => {
  const { date, machine } = req.query;
  console.log("scheduleDate", date);
  console.log("machineId", machine);
  const sql =
    "DELETE FROM schedule WHERE schedule_date = ? AND machine_id =(select id_machines from machines where machine_name = ?) ";
  db.query(sql, [date, machine], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ success: true });
  });
});

// Serwer nasłuchujący na porcie 5000
app.listen(5000, () => {
  console.log("Serwer działa na porcie 5000");
});

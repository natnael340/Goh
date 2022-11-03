const sqlite = require('sqlite3');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

let db = new sqlite.Database('./db.sqlite', sqlite.OPEN_READWRITE, (e) => {
  if (e) {
    console.log("Error Occured", e);
  }
  else console.log("Sucessfully connected")
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,username TEXT NOT NULL UNIQUE, full_name TEXT, created_date TEXT, contact TEXT, active INTEGER NOT NULL)");
  db.run("CREATE TABLE IF NOT EXISTS blocked_user(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, created_date TEXT NOT NULL, blocked_for TEXT NOT NULL, ip TEXT NOT NULL, desc TEXT, FOREIGN KEY(uid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS login(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, mfa INTEGER NOT NULL, mfa_code TEXT,mfa_issued_at TEXT, FOREIGN KEY(uid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, title TEXT NOT NULL, price REAL NOT NULL, location_type TEXT, location TEXT, created_date TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL, category TEXT NOT NULL, other_info TEXT, FOREIGN KEY(uid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS review(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, pid INTEGER NOT NULL, comment TEXT NOT NULL, created_date TEXT NOT NULL, FOREIGN KEY(pid) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY(uid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS user_fav(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, pid INTEGER NOT NULL, FOREIGN KEY(pid) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY(uid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS user_fav(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, pid INTEGER NOT NULL, FOREIGN KEY(pid) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY(uid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)");
  //db.run(`INSERT INTO users(username, full_name, created_date, contact, active) VALUES('malik', 'Natnael Tilahun','${(new Date()).getDate()}/${(new Date()).getMonth()+1}/${(new Date()).getFullYear()}-${(new Date()).getHours()}:${(new Date()).getMinutes()}:${(new Date()).getSeconds()}','${JSON.stringify({phone_number: "0926600549", city: "Addis Abeba", street: "bole"})}',1),('nolawit', 'Fiker Yibeltal','${(new Date()).getDate()}/${(new Date()).getMonth()+1}/${(new Date()).getFullYear()}-${(new Date()).getHours()}:${(new Date()).getMinutes()}:${(new Date()).getSeconds()}','${JSON.stringify({phone_number: "0911532515", city: "Addis Abeba", street: "22"})}',1)`);
 // db.run(`INSERT INTO login(uid, email, password, mfa) VALUES(1, 'natnaeltilahun157@gmail.com', '${bcrypt.hashSync("malik", salt)}',0),(2, 'fikeryibeltal31@gmail.com', '${bcrypt.hashSync("nolawit", salt)}',0)`);
  db.all("SELECT * FROM login", [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

});
db.close();
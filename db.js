const sqlite = require('sqlite3');

let db = new sqlite.Database('./db.sqlite', sqlite.OPEN_READWRITE, (e) => {
  if (e) {
    console.log("Error Occured", e);
  }
  else console.log("Sucessfully connected")
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,username TEXT NOT NULL UNIQUE, full_name TEXT, created_date TEXT, contact TEXT, active INTEGER NOT NULL)");
  db.run("CREATE TABLE IF NOT EXISTS blocked_user(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, created_date TEXT NOT NULL, blocked_for TEXT NOT NULL, ip TEXT NOT NULL, desc TEXT, FOREIGN KEY(uid) REFERENCES users(id))");
  db.run("CREATE TABLE IF NOT EXISTS login(id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, created_date TEXT NOT NULL, blocked_for TEXT NOT NULL, ip TEXT NOT NULL, desc TEXT, FOREIGN KEY(uid) REFERENCES users(id))")
}
);
db.close();
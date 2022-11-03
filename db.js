const sqlite = require('sqlite3');

let db = new sqlite.Database('./db.sqlite', sqlite.OPEN_READWRITE, (e) => {
  if (e) {
    console.log("Error Occured", e);
  }
  else console.log("Sucessfully connected")
});

db.serialize(() => {
  db.run("CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT, full_name TEXT, created_date TEXT, contact TEXT, active INTEGER");
  db.run("CREATE TABLE blocked_user(id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, created_date TEXT, contact TEXT, active INTEGER");
}
)
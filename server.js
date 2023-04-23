const express = require("express");
const path = require("path");
const dbData = require("./db/db.json");
const PORT = 3001;
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extender: true }));
app.use(express.json());

app.use(express.static("public"));

let noteData = [];

try {
  const data = fs.readFileSync(dbData);
  noteData = JSON.parse(data);
} catch (err) {
  console.error(err);
}

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(noteData);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

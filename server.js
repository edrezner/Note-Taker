const express = require("express");
const path = require("path");
const dbData = require("./db/db.json");
const PORT = 3001;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.urlencoded({ extender: true }));
app.use(express.json());

app.use(express.static("public"));

let noteData = [];

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db", "db.json"), (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Could not retrieve notes" });
    } else {
      console.log(data);
      const notes = JSON.parse(data);
      res.json(notes);
      console.log(notes);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error saving note" });
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(
        path.join(__dirname, "db", "db.json"),
        JSON.stringify(notes),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Error saving note" });
          } else {
            res.json(newNote);
          }
        }
      );
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

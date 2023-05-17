// Set requires
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.urlencoded({ extender: true }));
app.use(express.json());

app.use(express.static("public"));

// Sets first get route to display notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Creates get route for displaying notes in database db.json file
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

// Post route for saving a new note. Uses uuid package to attach a unique id
app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  // db.json file must be read and parsed first since fs does not automatically parse or stringify json strings/javascript objects
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error saving note" });
    } else {
      // pushes note to be saved to the array of objects
      const notes = JSON.parse(data);
      notes.push(newNote);

      // updates the json file
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

// Creates a delete route
app.delete("/api/notes/:id", (req, res) => {
  // store id in a variable

  // write the file back to the json file using stringify and writeFile
  const id = req.body.id;

  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting note" });
    } else {
      const deleteNote = JSON.parse(data);

      // use findIndex() to find the matching id with the variable
      const index = deleteNote.findIndex((note) => note.id === id);

      // use splice method to remove that index
      deleteNote.splice(index, 1);

      // updates contents of the file with fs
      fs.writeFile(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(deleteNote),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Error saving note" });
          } else {
            res.json(deleteNote);
          }
        }
      );
    }
  });
});

// Sets wildcard route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

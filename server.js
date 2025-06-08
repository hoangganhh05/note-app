const path = require("path"); // <-- dòng này bị đặt sau const DATA_FILE

const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "notes.json");

function getNextId() {
  let id = 1;
  while (notes.find((note) => note.id === id)) {
    id++;
  }
  return id;
}

// Mảng để lưu ghi chú (chạy lại server thì mất)
let notes = [];
try {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  notes = JSON.parse(data);
} catch (err) {
  notes = [];
}

function saveNotes() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ error: "Nội dung ghi chú không được để trống" });
  }

  const note = notes.find((note) => note.id === id);
  if (!note) {
    return res.status(404).json({ error: "Không tìm thấy ghi chú" });
  }

  note.content = content;
  note.updatedAt = new Date();

  saveNotes(); // Lưu lại file notes.json

  res.json({ message: "Đã cập nhật ghi chú", note });
});

app.post("/notes", (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res
      .status(400)
      .json({ error: "Nội dung ghi chú không được để trống" });
  }
  const newNote = {
    id: getNextId(),
    content: content,
    createdAt: new Date(),
  };

  notes.push(newNote);
  saveNotes(); // Lưu vào file
  res.status(201).json(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((notes) => notes.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy ghi chú!" });
  }

  const deleteNote = notes.splice(index, 1);
  saveNotes(); // Lưu vào file
  res.json({ message: "Đã xóa ghi chú", note: deleteNote[0] });
});

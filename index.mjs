import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const port = 3211;

// เปิดใช้งาน CORS
app.use(cors({ origin: "*" }));

const baseDirectory = path.join(
  "D:",
  "KMUTNB-CS",
  "OOPject",
  "comfile",
  "foldercopy"
);
console.log("Base Directory:", baseDirectory);

const getFileTree = (dir) => {
  const result = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      result.push({
        name: file,
        type: "folder",
        contents: getFileTree(filePath),
      });
    } else {
      result.push({
        name: file,
        type: "file",
      });
    }
  });

  return result;
};

// file-tree
app.get("/list-files", (req, res) => {
  try {
    const fileTree = getFileTree(baseDirectory);
    res.json(fileTree);
  } catch (err) {
    console.error("Error reading directory:", err);
    res.status(500).send("Error reading directory");
  }
});

// read-jpg
app.get("/read-jpg", (req, res) => {
  const fileName = req.query.file.trim();
  const filePath = path.join(baseDirectory, fileName);

  console.log("Requested File:", fileName);
  console.log("Full Path:", filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(404).send("File not found");
    }
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.end(data);
  });
});

// read-csv
app.get("/read-csv", (req, res) => {
  const file = req.query.file; // รับชื่อไฟล์จากพารามิเตอร์
  const filePath = path.join(baseDirectory, file);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(404).send("File not found");
    }
    res.send(data);
  });
});

app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

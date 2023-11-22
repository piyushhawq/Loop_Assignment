const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(__dirname);

const csvFiles = files.filter(
  (file) => path.extname(file).toLowerCase() === ".csv"
);

csvFiles.forEach((file) => {
  fs.unlinkSync(file);
  console.log(`Deleted file: ${file}`);
});

console.log("All CSV files deleted successfully.");

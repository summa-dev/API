const fs = require("fs");

function getCSVEntries(path) {
  // Read the CSV file
  const file = fs.readFileSync(path, "utf8");

  // Split the file into lines
  const lines = file.split("\n");

  // Split each line into values
  const values = lines.map((line) => line.split(","));

  // remove the first line (header)
  values.shift();

  // create a tuple for each line
  // remove \r from the balance
  const entries = values.map((values) => {
    return {
      userID: values[0],
      balance: values[1].replace("\r", ""),
    };
  });
  return entries;
}

// export function
module.exports = getCSVEntries;

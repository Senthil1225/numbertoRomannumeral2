const http = require("http");
const url = require("url");

// Function to convert number to Roman numeral
function convertToRoman(num) {
  const romanNumerals = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };

  let roman = "";

  for (let key in romanNumerals) {
    while (num >= romanNumerals[key]) {
      roman += key;
      num -= romanNumerals[key];
    }
  }

  return roman;
}

// Create a server
http
  .createServer(function (req, res) {
    const q = url.parse(req.url, true);
    const pathName = q.pathname;

    // Handling root URL
    if (pathName === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      const fs = require("fs");
      fs.readFile("index.html", function (err, data) {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/html" });
          return res.end("404 Not Found");
        }
        res.write(data);
        return res.end();
      });
    }

    // Handling roman numeral conversion request
    else if (pathName === "/convert") {
      const query = q.query;
      const number = parseInt(query.number);

      if (!isNaN(number)) {
        const romanNumeral = convertToRoman(number);
        const jsonResponse = {
          number: number,
          romanNumeral: romanNumeral,
        };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(jsonResponse));
      } else {
        const errorResponse = {
          error: "Invalid input. Please provide a valid number.",
        };
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(errorResponse));
      }
    }

    // Handling other requests
    else {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 Not Found");
    }
  })
  .listen(8080);

console.log("Server running at http://localhost:8080/");

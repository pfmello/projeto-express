const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

//CONFIGURANDO EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Checks that for every incoming request, should check if its for a file that can be found on this folder
app.use(express.static("public"));

//Middleware para json
app.use(express.urlencoded({ extended: false }));
const filePath = path.join(__dirname, "data", "restaurants.json");

function getFileData() {
  const fileData = fs.readFileSync(filePath);
  const output = JSON.parse(fileData);

  return output;
}

app.get("/", (req, res) => {
  // const htmlFilePath = path.join(__dirname, "views", "index.html");
  // res.sendFile(htmlFilePath);

  res.render("index");
});

app.get("/restaurants", (req, res) => {
  const storedRestaurants = getFileData();
  res.render("restaurants", {
    number: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/recommend", (req, res) => {
  res.render("recommend");
});

app.post("/recommend", (req, res) => {
  const restaurant = req.body;
  const restaurantes = getFileData();
  restaurantes.push(restaurant);

  fs.writeFileSync(filePath, JSON.stringify(restaurantes));
  res.redirect("/confirm");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/confirm", (req, res) => {
  res.render("confirm");
});

app.listen(3000);

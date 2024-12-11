const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 5000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const password1 = bcrypt.hashSync("123456789", 12);
const password2 = bcrypt.hashSync("qwerty", 12);

const data = [
  { id: 1, email: "akshaybalachandran6@gmail.com", password: password1 },
  { id: 2, email: "alex@gmail.com", password: password2 },
];

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = data.find((m) => m.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    const token = jwt.sign({ id: user.id }, "secret_pass", { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.log("Error from logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Successfully running on port ${PORT}`));

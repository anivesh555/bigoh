const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const router = require("./src/routes/index");
require("./src/Database/db")
const createUsersTable = require("./src/Database/db")

const port = process.env.API_PORT || 8085;
let corsOptions = {
    origin : "http://localhost:4200"
};

app.use(cors(corsOptions));

app.use(express.json())
// createUsersTable()

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

app.use("/api", router);


// pool.on('connect', () => {
//     console.log('Connected to the database');
//   });


app.listen(process.env.PORT || 4000, ()=>{
    console.log("Server is running 4000")
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = new express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) =>{
    res.send("Welcome to Write Hub");
});

app.listen (PORT, () => {
    console.log("Welcome to WriteHub.");
    console.log(`Server is running on port:${PORT}`);
});

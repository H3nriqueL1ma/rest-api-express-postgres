const express = require("express");
const cors = require("cors");
const server = express();
const port = 8000;

server.use(express.json());

server.use(cors({
    origin: "http://localhost:3000"
}));

server.post("/createdData", (req, res) => {
    const { username, email, password, confirm } = req.body;

    
});

server.listen(port, () => {
    console.log(`Server started at: localhost:${port}`);
});
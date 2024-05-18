import express, { json } from "express";
import cors from "cors";
import { DbPostgres } from "../methods/dbPostgres";

const server = express();
const port = 8000;
const database = new DbPostgres();

server.use(json());

server.use(cors({
    origin: "http://localhost:3000"
}));

server.post("/user", async (req, res) => {
    const { username, email, password, confirm } = req.body;
    
    await database.create({
        username,
        email,
        password,
        confirm
    });

    return res.status(201).send();
});

server.get("/user", async (req) => {
    const search = req.query.search;

    const users = await database.list(search);

    return users;
});

server.listen(port, () => {
    console.log(`Server started at: localhost:${port}`);
});
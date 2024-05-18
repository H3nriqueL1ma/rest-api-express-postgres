import express, { json } from "express";
import cors from "cors";
import { DbPostgresMethods } from "../methods/dbPostgres.js"

const server = express();
const port = 8000;
const database = new DbPostgresMethods();

server.use(json());

server.use(cors({
    origin: "http://localhost:3000"
}));

server.post("/user", async (req, res) => {
    const { userNameRegistered: username, emailRegistered: email, passwordRegistered: password, confirmRegistered: confirm } = req.body;

    const clientVerify = database.read(username, password);

    try {
        if (clientVerify) {
            return res.status(409).json({
                success: false,
                message: "Credentials already registered"
            });
        } else {
            await database.create({
                username,
                email,
                password,
                confirm
            });
        
            return res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        }
    } catch (error) {
        console.log("Error during user registration: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

});

server.post("/user/verify-user-credentials", async (req, res) => {
    const { usernameLogin: username, passwordLogin: password } = req.body;

    try {
        const user = await database.read(username, password);
        if (user) {
            res.status(200).json({
                message: 1
            });
        } else {
            res.status(401).json({
                message: 0
            });
        }
    } catch (error) {
        res.status(500).send();
    }
})

server.listen(port, () => {
    console.log(`Server started at: localhost:${port}`);
});
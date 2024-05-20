import express, { json } from "express";
import cors from "cors";
import { DbPostgresMethods } from "../methods/dbPostgres.js";
import { encryptCredentials } from "../methods/encrypt.js";

const server = express();
const port = 8000;
const database = new DbPostgresMethods();

server.use(json());

server.use(cors({
    origin: "http://localhost:3000"
}));

server.post("/user", async (req, res) => {
    const { userNameRegistered: username, emailRegistered: email, passwordRegistered: password, confirmRegistered: confirm } = req.body;

    try {
        const clientVerify = await database.readRegister(username);

        if (!clientVerify) {
            const emailVerify = await database.readRegisterEmail(email);

            if (emailVerify) {
                return res.status(409).json({ message: 409 });
            } else {
                const passwordEncrypted = await encryptCredentials(password);

                await database.create({
                    username,
                    email,
                    passwordEncrypted
                });
                
                return res.status(201).json({ message: 201 });
            }
        } else {
            return res.status(409).json({ message: 409 });
        }
    } catch (error) {
        console.log("Error during user registration: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

server.post("/user/login", async (req, res) => {
    const { usernameLogin: username, passwordLogin: password } = req.body;

    try {
        const user = await database.readLogin(username, password);

        if (user === true) {
            res.status(200).json({ message: 200 });
        } else if (user === false) {
            res.status(401).json({ message: 401 });
        } else {
            res.status(404).json({ message: 404 })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

server.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
});
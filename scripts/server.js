import express, { json } from "express";
import cors from "cors";
import { DbPostgresMethods } from "../methods/dbPostgres.js";
import { encryptCredentials } from "../methods/encrypt.js";

const server = express();
const port = 8000;
const database = new DbPostgresMethods();

server.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true
}));

server.use(json());

server.post("/user", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const clientVerify = await database.readRegister(username);

        if (!clientVerify) {
            const emailDomainVerify = await database.verifyEmailDomainExists(email);

            if (emailDomainVerify) {
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
                return res.status(404).json({ message: 404 });
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
    const { username, password } = req.body;

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

server.post("/user/email-verify/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const email_Verify = await database.readRegisterEmail(email);

        if (email_Verify) {
            return res.status(409).json({ message: 409 });
        } else {
            return res.status(404).json({ message: 404 });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

server.post("/user/reset-pass", async (req, res) => {
    const { newPass, email } = req.body;

    try {
        const emailVerify = await database.readRegisterEmail(email);

        if (emailVerify) {
            const passwordEncrypted = await encryptCredentials(newPass);

            database.updatePass(passwordEncrypted, email);

            return res.status(200).json({ message: 200 });
        } else {
            return res.status(404).json({ message: 404 });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

server.post("/user/task", async (req, res) => {
    const { username: username, taskUser: task } = req.body;

    const userData = await database.readRegister(username);

    try {
        if (userData) {
            const data = {
                userID: userData.id,
                taskContent: task
            };

            await database.create_task(data);

            res.status(201).send();
        } else {
            res.status(404).send();
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

server.post("/user/task/read-user-tasks", async (req, res) => {
    const { username } = req.body;

    const userData = await database.readRegister(username);

    try {
        if (userData) {
            const tasks = await database.read_task(userData.id);

            res.status(200).json(tasks);
        } else {
            res.status(404).send();
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

server.delete("/user/task/delete-user-task", async (req, res) => {
    const { taskID } = req.body;

    await database.delete_task(taskID);
    res.status(200).send();
});

server.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
});
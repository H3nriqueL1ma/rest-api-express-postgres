import { sql } from "./db.js";
import { validateCredentials } from "./encrypt.js";
import dns from "dns";

let commonDomains = [
    "@gmail.com", "@outlook.com", "@hotmail.com", "@icloud.com", "@protonmail.com", "@yahoo.com"
];

async function checkEmailDomain (email) {
    let domain = email.substring(email.indexOf("@") + 1);
    try {
        await dns.promises.resolve(domain);
        return true;
    } catch (error) {
        return false;
    }
}

export class DbPostgresMethods {
    async readRegister (username) {
        const client = await sql`SELECT * FROM clients WHERE username = ${username}`;
        return client.length ? client[0] : false;
    }

    async readRegisterEmail (email) {
        const client = await sql`SELECT * FROM clients WHERE email = ${email}`;
        return client.length ? true : false;
    }

    async verifyEmailDomainExists(email) {
        if (commonDomains.some(domain => email.includes(domain))) {
            return true;
        } else {
            let domainExists = await checkEmailDomain(email);
            if (domainExists) {
                return true;
            } else {
                return false;
            }
        }
    }

    async readLogin (username, password) {
        const client = await sql`SELECT * FROM clients WHERE username = ${username}`;

        if (client && client.length > 0) {
            const clientHashPass = client[0].password;

            const isPassValid = await validateCredentials(password, clientHashPass);

            return isPassValid ? true : false;
        } else {
            return 0;
        }
    }

    async create (user) {
        const { username, email, passwordEncrypted, confirm } = user;
        await sql`INSERT INTO clients (username, email, password) VALUES (${username}, ${email}, ${passwordEncrypted})`
    }

    async create_task (data) {
        const { userID, taskContent } = data;
        await sql`INSERT INTO tasks (user_id, task_content) VALUES (${userID}, ${taskContent})`;
    }

    async read_task (userID) {
        const tasks = await sql`SELECT * FROM tasks WHERE user_id = ${userID}`;
        return tasks;
    }

    async delete_task (taskID) {
        await sql`DELETE FROM tasks WHERE task_id = ${taskID}`;
    }
}
import { sql } from "./db.js";
import { validateCredentials } from "./encrypt.js";

export class DbPostgresMethods {
    async readRegister (username) {
        const client = await sql`SELECT * FROM clients WHERE username = ${username}`;
        return client.length ? client[0] : false;
    }

    async readRegisterEmail (email) {
        const client = await sql`SELECT * FROM clients WHERE email = ${email}`;
        return client.length ? true : false;
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
        const { userID, taskContent, completed } = data;

        await sql`INSERT INTO tasks (user_id, task_content, completed) VALUES ()`;
    }

    // async update (username, email, password, id) {
    //     await sql`UPDATE clients set username = ${username}, email = ${email}, password = ${password} WHERE id = ${id}`;
    // }

    // async del (username) {
    //     await sql`DELETE FROM clients WHERE username = ${username}`;
    // }
}
import { sql } from "./db.js";
import { encryptCredentials, validateCredentials } from "./encrypt.js";

export class DbPostgresMethods {
    async readRegister (username) {
        const client = await sql`SELECT * FROM clients WHERE username = ${username}`;

        return client[0];
    }

    async readLogin (username, password) {
        const client = await sql`SELECT * FROM clients WHERE username = ${username}`;

        if (client && client.length > 0) {
            const clientHashPass = client[0].password;

            const isPassValid = await validateCredentials(password, clientHashPass);

            if (isPassValid) {
                return true;
            } else {
                return false;
            }
        } else {
            return 0;
        }
    }

    async create (user) {
        const { username, email, passwordEncrypted, confirm } = user;

        await sql`INSERT INTO clients (username, email, password) VALUES (${username}, ${email}, ${passwordEncrypted})`
    }

    async update (username, email, password, id) {
        await sql`UPDATE clients set username = ${username}, email = ${email}, password = ${password} WHERE id = ${id}`;
    }

    async del (username) {
        await sql`DELETE FROM clients WHERE username = ${username}`;
    }
}
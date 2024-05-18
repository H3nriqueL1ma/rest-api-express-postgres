import { randomUUID } from "crypto";
import { sql } from "./db";

export class DbPostgres {
    async read(username, password) {
        let client;

        client = await sql`SELECT * FROM clients WHERE username = ${username}, password = ${password}`;

        return client;
    }

    async create(user) {

        const { username, email, password, confirm } = user;

        await sql`INSERT INTO clients (username, email, password) VALUES (${username}, ${email}, ${password})`
    }

    async updateUsername(username, id) {
        await sql`UPDATE clients SET username = ${username} WHERE id = ${id}`;
    }

    async updateEmail(email, id) {
        await sql`UPDATE clients SET email = ${email} WHERE id = ${id}`;
    }
    
    async updatePass(password, id) {
        await sql`UPDATE clients SET password = ${password} WHERE id = ${id}`;
    }

    async del(username) {
        await sql`DELETE FROM clients WHERE username = ${username}`;
    }
}
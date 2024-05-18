import { sql } from "./db.js"

export class DbPostgresMethods {
    async read(username, password) {
        let client;

        client = await sql`SELECT * FROM clients WHERE username = ${username} AND password = ${password}`;

        return client[0];
    }

    async create(user) {
        const { username, email, password, confirm } = user;

        await sql`INSERT INTO clients (username, email, password) VALUES (${username}, ${email}, ${password})`
    }

    async update(username, email, password, id) {
        await sql`UPDATE clients set username = ${username}, email = ${email}, password = ${password} WHERE id = ${id}`;
    }

    async del(username) {
        await sql`DELETE FROM clients WHERE username = ${username}`;
    }
}
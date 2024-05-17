import { sql } from "../methods/db.js";

try {
    await sql`
        CREATE TABLE clients (
            id          TEXT PRIMARY KEY,
            username    TEXT,
            email       TEXT,
            password    TEXT
        );
    `
    console.log("Table created!");
} catch (error) {
    console.log("Error when creating table!", error)
}
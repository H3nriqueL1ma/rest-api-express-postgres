import { sql } from "../methods/db.js";

try {
    await sql`DROP TABLE IF EXISTS clients`;
    console.log("Table deleted!");

    await sql`
        CREATE TABLE clients (
            id          SERIAL PRIMARY KEY,
            username    VARCHAR(50) NOT NULL UNIQUE,
            email       VARCHAR(50) NOT NULL,
            password    VARCHAR(50) NOT NULL
        );
    `
    console.log("Table created!");
} catch (error) {
    console.log("Error when creating table!", error)
}
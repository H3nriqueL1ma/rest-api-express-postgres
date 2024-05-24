import { sql } from "../methods/db.js";

try {
    await sql`DROP TABLE IF EXISTS clients CASCADE`;
    console.log("Table clients deleted!");
    await sql`DROP TABLE IF EXISTS tasks CASCADE`;
    console.log("Table tasks deleted!");

    await sql`
        CREATE TABLE clients (
            id              SERIAL PRIMARY KEY,
            username        VARCHAR(50) NOT NULL UNIQUE,
            email           VARCHAR(50) NOT NULL UNIQUE,
            password        VARCHAR(500) NOT NULL
        );
    `
    console.log("Table clients created!");

    await sql`
        CREATE TABLE tasks (
            task_id         SERIAL PRIMARY KEY,
            user_id         INT REFERENCES clients(id) ON DELETE CASCADE,
            task_content    VARCHAR(300) NOT NULL
        );
    `
    console.log("Table tasks created!");
} catch (error) {
    console.log("Error when creating table!", error)
}
import { Client } from "pg"

export async function executeSQL(
    sql: string,
    variables: any[] = [],
) {
    console.log({
        host: process.env.POSTGRES_HOST,
        password: process.env.POSTGRES_PASSWORD,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DATABASE,
        port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    })
    const client = new Client({
        host: process.env.POSTGRES_HOST,
        password: process.env.POSTGRES_PASSWORD,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DATABASE,
        port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    });

    await client.connect();

    const result = await client.query(sql, variables);

    client.end();

    return result.rows;
}

// export class DataBase {
//     private client: Client;

    // constructor(

    // )
    // connect() {

//     }

//     private getClient(): Client {
//         if (!!this.client) {
//             return this.client;
//         }
//         this.client = new Client({
//             host: process.env.POSTGRES_HOST,
//             password: process.env.POSTGRES_PASSWORD,
//             user: process.env.POSTGRES_USER,
//             database: process.env.POSTGRES_DATABASE,
//             port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
//         });

//         return this.client;
//     }

// }

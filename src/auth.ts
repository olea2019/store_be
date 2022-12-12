import { response, Router } from "express";
import { request } from "http";
import { executeSQL } from "./db";
import { createToken } from "./jwt";

export const authRouter = Router();

authRouter.post(
    '/signIn',
    async (request, response) => {
        const { email, password } = request.body;
        console.log({ email, password })

        try {
            const [foundUser] = await executeSQL(`
                SELECT * 
                FROM "Client"
                WHERE email = $1 AND password = $2
            `,
                [email, password]);

            if (!foundUser) {
                throw new Error('Bad credentials');
            }

            const token = createToken(foundUser);
            response.status(200).send({ user: foundUser, token: token });
        } catch (error) {
            return response.status(500).send((error as any).message);
        }

    }
);

authRouter.post(
    '/signUp',
    async (request, response) => {
        const { first_name, last_name, phone, address, email, password } = request.body;

        const [Client] = await executeSQL(
            `INSERT INTO "Client"
          (first_name, last_name, phone, address, email, password)
          VALUES
          ($1, $2, $3, $4, $5, $6)
          RETURNING *
          `,
            [first_name, last_name, phone, address, email, password],
        );


        const token = createToken(Client);

        response.status(201).send({ user: Client, token });
    },
)

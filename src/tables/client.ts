import { Router } from "express";
import { executeSQL } from "../db";
import { isAuthed } from "../middlewares/auth";

export const clientRouter = Router();

// clientRouter.post(
//   '/users',
//   async (request, response) => {
//     const { first_name, last_name, phone, address, email, password } = request.body;

//     const [Client] = await executeSQL(
//       `INSERT INTO "Client"
//         (first_name, last_name, phone, address, email, password)
//         VALUES
//         ($1, $2, $3, $4, $5, $6)
//         RETURNING *
//         `,
//       [first_name, last_name, phone, address, email, password],
//     );
//     response.status(201).send({ Client });
//   },
// );

// clientRouter.get(
//   '/users',
//   async (_, response) => {
//     const list = await executeSQL('SELECT * FROM "Client"');
//     response.send(list);
//   },
// );

clientRouter.get(
  '/users/:id',
  async (request, response) => {
    const userId = request.params.id;
    const [user] = await executeSQL('SELECT * FROM "Client" WHERE id_client = $1', [userId]);
    response.send(user);
  },
);

clientRouter.get(
  '/me',
  isAuthed,
  async (request, response) => {
    const user = (request as any).user;
    response.status(200).send(user);
  }
);

clientRouter.put(
  '/users',
  isAuthed,
  async (request, response) => {
    const userId = (request as any).user?.id_client;
    const { first_name, last_name, phone, address, password } = request.body;

    const [passwordConfirmation] = await executeSQL(
      'SELECT COUNT(*) as count FROM "Client" WHERE email = $1 AND password = $2',
      [request.body.email, request.body.oldPassword],
    );
    const count = parseInt(passwordConfirmation.count, 10);
    console.log(count);
    if (count === 0) {
      return response.status(400).send('Bad credentials');
    }
    const [updatedUser] = await executeSQL(
      `
          UPDATE "Client"
          SET
          first_name = $1, 
          last_name = $2, 
          phone = $3, 
          address = $4,  
          password = $5
          WHERE id_client = $6
          RETURNING *;
        `,
      [first_name, last_name, phone, address, password, userId],
    );
    response.send(updatedUser);
  },
);

clientRouter.delete(
  '/users/:id',
  async (request, response) => {
    const userId = request.params.id;

    const [deletedUser] = await executeSQL(
      'DELETE FROM "Client" WHERE id_client = $1 RETURNING *;',
      [userId],
    );

    response.send(deletedUser);
  })
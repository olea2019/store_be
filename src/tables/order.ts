import { Router } from "express";
import { executeSQL } from "../db";
import { isAuthed } from "../middlewares/auth";

export const orderRouter = Router();

orderRouter.post(
  '/order',
  isAuthed,
  async (request, response) => {
    const { order_date, count = 1, status = 'cart' } = request.body;
    const id_client = (request as any).user.id_client;

    const [Order] = await executeSQL(
      `INSERT INTO "Order"
        (id_client, order_date, count, status)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *
        `,
      [id_client, order_date, count, status],
    );
    response.status(201).send(Order);
  },
);

orderRouter.get(
  '/order',
  isAuthed,
  async (request, response) => {
    const id_client = (request as any).user.id_client;
    const list = await executeSQL('SELECT * FROM "Order" WHERE id_client = $1 ORDER BY "createdAt" DESC', [id_client]);
    response.send(list);
  },
);

orderRouter.put(
  '/order/:id',
  async (request, response) => {
    const orderId = request.params.id;
    const { id_client, order_date, count, status } = request.body;
    const [updatedUser] = await executeSQL(
      `
          UPDATE "Order"
          SET
          id_client = $1, 
          order_date = $2, 
          count = $3, 
          status = $4
          WHERE id_order = $5
          RETURNING *;
        `,
      [id_client, order_date, count, status, orderId],
    );
    response.send(updatedUser);
  },
);

orderRouter.delete(
  '/order/:id',
  async (request, response) => {
    const orderId = request.params.id;

    const [deletedOrder] = await executeSQL(
      'DELETE FROM "Order" WHERE id_order = $1 RETURNING *;',
      [orderId],
    );

    response.send(deletedOrder);
  })
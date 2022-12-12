import { Router } from "express";
import { executeSQL } from "../db";

export const itemOrderRouter = Router();

itemOrderRouter.post(
    '/itemOrder',
    async (request, response) => {
        const { id_item, id_order } = request.body;

        const [ItemOrder] = await executeSQL(
            `INSERT INTO "ItemOrder"
        (id_item, id_order)
        VALUES
        ($1, $2)
        RETURNING *
        `,
            [id_item, id_order],
        );
        response.status(201).send({ ItemOrder: ItemOrder });
    },
);

itemOrderRouter.get(
    '/itemOrder',
    async (request, response) => {
        const orderId = request.query.orderId as string;
        const list = await executeSQL(
            `SELECT * FROM "ItemOrder" ${orderId ? 'WHERE id_order = $1' : ''}`,
            [
                ...orderId ? [orderId] : [],
            ]
        );
        response.send(list);
    },
);

// itemOrderRouter.get(
//     '/item/:id',
//     async (request, response) => {
//         const itemId = request.params.id;
//         const [item] = await executeSQL('SELECT * FROM "Item" WHERE id_item = $1', [itemId]);
//         response.send(item);
//     },
// );

itemOrderRouter.put(
    '/itemOrder/:id',
    async (request, response) => {
        const orderId = request.params.id;
        const { id_item, id_order } = request.body;
        const [updatedItem] = await executeSQL(
            `
          UPDATE "ItemOrder"
          SET
          id_item = $1, 
          id_order = $2
          WHERE id_order = $3
          RETURNING *;
        `,
            [id_item, id_order, orderId],
        );
        response.send(updatedItem);
    },
);

itemOrderRouter.delete(
    '/itemOrder/:id',
    async (request, response) => {
        const orderId = request.params.id;
        const itemId = request.query.item as string;

        const [deletedItemOrder] = await executeSQL(
            'DELETE FROM "ItemOrder" WHERE id_order = $1 AND id_item = $2 RETURNING *;',
            [orderId, itemId],
        );

        response.send(deletedItemOrder);
    })
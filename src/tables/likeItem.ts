import { Router } from "express";
import { executeSQL } from "../db";
import { isAuthed } from "../middlewares/auth";

export const likeItemRouter = Router();

likeItemRouter.post(
    '/likeItem',
    isAuthed,
    async (request, response) => {
        const { id_item } = request.body;
        const id_client = (request as any).user?.id_client;

        if (!id_client) {
            throw new Error('Missing auth data');
        }

        const [likeItem] = await executeSQL(
            `INSERT INTO "LikeItem"
        (id_client, id_item)
        VALUES
        ($1, $2)
        RETURNING *
        `,
            [id_client, id_item],
        );
        response.status(201).send({ likeItem: likeItem });
    },
);

// likeItemRouter.get(
//     '/likeItem',
//     async (_, response) => {
//         const list = await executeSQL('SELECT * FROM "ItemOrder"');
//         response.send(list);
//     },
// );

likeItemRouter.get(
    '/likeItem',
    isAuthed,
    async (request, response) => {
        const clientId = (request as any).user.id_client;
        const likeItem = await executeSQL(`SELECT * FROM "LikeItem" WHERE id_client = $1`, [clientId]);
        response.send(likeItem);
    },
);

// likeItemRouter.put(
//     '/likeItem/:id',
//     async (request, response) => {
//         const orderId = request.params.id;
//         const { id_item, id_order } = request.body;
//         const [updatedItem] = await executeSQL(
//             `
//           UPDATE "ItemOrder"
//           SET
//           id_item = $1, 
//           id_order = $2
//           WHERE id_order = $3
//           RETURNING *;
//         `,
//             [id_item, id_order, orderId],
//         );
//         response.send(updatedItem);
//     },
// );

likeItemRouter.delete(
    '/likeItem/:id',
    isAuthed,
    async (request, response) => {
        const clientId = (request as any).user.id_client;
        const itemId = request.params.id;

        const [deletedLikeItem] = await executeSQL(
            'DELETE FROM "LikeItem" WHERE id_client = $1 AND id_item = $2 RETURNING *;',
            [clientId, itemId],
        );

        response.send(deletedLikeItem);
    })
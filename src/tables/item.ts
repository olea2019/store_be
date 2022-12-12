import { Router } from "express";
import { request } from "http";
import { executeSQL } from "../db";

export const itemRouter = Router();

itemRouter.post(
    '/item',
    async (request, response) => {
        const { name, price, brand, category, img } = request.body;

        const [Item] = await executeSQL(
            `INSERT INTO "Item"
        (name, price, brand, category, img)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
        `,
            [name, price, brand, category, img],
        );
        response.status(201).send({ Item: Item });
    },
);

itemRouter.get(
    '/item',
    async (request, response) => {
        const category = request.query.category;
        const brand = request.query.brand;
        const orderDirection = request.query.orderDirection || 'ASC';
        const minPrice = request.query.minPrice || '50';
        const maxPrice = request.query.maxPrice || '50000';
        const query = `
            SELECT *
            FROM "Item"
            ${category
                ? `WHERE
                    category = $1
                    ${brand ? 'AND brand = $2' : ''}
                AND price > ${minPrice}
                AND price < ${maxPrice}`
                : ''}
            ORDER BY price ${orderDirection === 'ASC' ? 'ASC' : 'DESC'}`;
        const params = [
            ...(category ? [category] : []),
            ...(brand ? [brand] : []),
        ];
        console.log({ query })

        const list = await executeSQL(query, params);
        // const list = await executeSQL(
        //     'SELECT * FROM "Item" WHERE category = $1',
        //     [category],);
        response.send(list);
    },
);

itemRouter.get(
    '/item/:id',
    async (request, response) => {
        const itemId = request.params.id;
        const [item] = await executeSQL('SELECT * FROM "Item" WHERE id_item = $1', [itemId]);
        response.send(item);
    },
);

itemRouter.put(
    '/item/:id',
    async (request, response) => {
        const itemId = request.params.id;
        const { name, price, brand, category, img } = request.body;
        const [updatedItem] = await executeSQL(
            `
          UPDATE "Item"
          SET
          name = $1, 
          price = $2, 
          brand = $3, 
          category = $4,
          img = $5
          WHERE id_item = $6
          RETURNING *;
        `,
            [name, price, brand, category, img, itemId],
        );
        response.send(updatedItem);
    },
);

itemRouter.delete(
    '/item/:id',
    async (request, response) => {
        const itemId = request.params.id;

        const [deletedItem] = await executeSQL(
            'DELETE FROM "Item" WHERE id_item = $1 RETURNING *;',
            [itemId],
        );

        response.send(deletedItem);
    }
);
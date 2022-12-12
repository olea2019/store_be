import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { clientRouter } from './tables/client';
import { itemRouter } from "./tables/item";
import { itemOrderRouter } from "./tables/itemOrder";
import { likeItemRouter } from "./tables/likeItem";
import { orderRouter } from "./tables/order";
import { authRouter } from "./auth";

type HttpException = {
  status?: number
  message?: string
}

const app = express();
const port = parseInt(process.env.PORT ?? '8000', 10);

app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((error: HttpException, request: Request, response: Response, next: NextFunction) => {
  console.error((error as any).stack);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response
    .status(status)
    .send({
      status,
      message,
    })
})

app.use(clientRouter);
app.use(itemRouter);
app.use(orderRouter);
app.use(itemOrderRouter);
app.use(likeItemRouter);
app.use(authRouter);

// app.post(); // create an item in database
// app.get(); // get a list or an item from the database
// app.put(); // replace an object in database
// app.patch(); // update object in database
// app.delete(); // delete an item from the database

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
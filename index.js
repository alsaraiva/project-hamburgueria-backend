const express = require("express");
const uuid = require("uuid");
import cors from "cors";
const port = 3001;
const app = express();
app.use(express.json());
app.use(cors());

const orders = [];

const typeRequisition = (request, response, next) => {
  console.log(request.method);
  console.log(request.url);

  next();
};

const checkOrderId = (request, response, next) => {
  const { id } = request.params;
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "Order not found" });
  }

  request.orderIndex = index;
  request.orderId = id;

  next();
};

app.get("/orders", typeRequisition, (request, response) => {
  return response.json(orders);
});

app.post("/orders", typeRequisition, (request, response) => {
  const { clientOrder, clientName, price } = request.body;

  const order = {
    id: uuid.v4(),
    clientOrder,
    clientName,
    price,
    status: "Em preparação",
  };

  orders.push(order);

  return response.status(201).json(order);
});

app.put("/orders/:id", typeRequisition, checkOrderId, (request, response) => {
  const { clientOrder, clientName, price } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const updateOrder = {
    id,
    clientOrder,
    clientName,
    price,
    status: "Em preparação",
  };

  orders[index] = updateOrder;

  return response.json(updateOrder);
});

app.delete(
  "/orders/:id",
  typeRequisition,
  checkOrderId,
  (request, response) => {
    const index = request.orderIndex;

    orders.splice(index, 1);

    return response.status(204).json(orders);
  }
);

app.get("/orders/:id", checkOrderId, typeRequisition, (request, response) => {
  const index = request.orderIndex;

  return response.status(200).json(orders[index]);
});

app.patch("/orders/:id", checkOrderId, typeRequisition, (request, response) => {
  const index = request.orderIndex;

  orders[index].status = "Pronto";

  return response.status(200).json(orders[index]);
});

app.listen(port, () => {
  console.log(`🚀Server started on port ${port}`);
});

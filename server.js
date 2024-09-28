import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import stripFunc from "stripe";

const stripe = stripFunc(process.env.STRIPE_SECRET);

const server = express();

server.use(cors());
server.use(express.json());

server.post("/get-session", async (req, res) => {
  const amount = 1;

  const line_items = [
    {
      price_data: {
        currency: "USD",
        product_data: {
          name: "Test",
          images: [],
        },
        unit_amount: 100, // 100 -> 1.00
      },
      quantity: 2,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    success_url: "http://localhost:5174/order-success",
    cancel_url: "http://localhost:5174",
  });

  res.json({ id: session.id });
});

server.listen(8080, () => {
  console.log(new Date().toString(), "listening on port 8080");
});

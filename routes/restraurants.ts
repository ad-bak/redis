import express from "express";
import { Restaurant, RestaurantSchema } from "../schemas/restaurant";
import { validate } from "../middleware/validate";
const router = express.Router();

router.post("/", validate(RestaurantSchema), async (req, res) => {
  const data = req.body as Restaurant;
  res.send("Hello World");
});

export default router;

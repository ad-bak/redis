import express, { Request } from "express";
import { Restaurant, RestaurantSchema } from "../schemas/restaurant";
import { validate } from "../middleware/validate";
const router = express.Router();
import { initializeRedisClient } from "../utils/client";
import { nanoid } from "nanoid";
import { restaurantKeyById } from "../utils/keys";
import { successResponse } from "../utils/responses";
import { checkRestaurantExists } from "../middleware/checkRestaurantId.ts";

router.post("/", validate(RestaurantSchema), async (req, res, next) => {
  const data = req.body as Restaurant;
  try {
    const client = await initializeRedisClient();
    const id = nanoid();
    const restaurantKey = restaurantKeyById(id);
    const hashData = { id, name: data.name, location: data.location };
    const addResult = await client.hSet(restaurantKey, hashData);
    console.log(`Added restaurant ${addResult}`);
    return successResponse(res, hashData, "Added new restaurant");
  } catch (error) {
    next(error);
  }
  res.send("Hello World");
});

router.get(
  "/:restaurantId",
  checkRestaurantExists,
  async (req: Request<{ restaurantId: string }>, res, next) => {
    const { restaurantId } = req.params;
    try {
      const client = await initializeRedisClient();
      const restaurantKey = restaurantKeyById(restaurantId);
      const [viewCount, restaurantData] = await Promise.all([
        client.hIncrBy(restaurantKey, "viewCount", 1),
        client.hGetAll(restaurantKey),
      ]);
      return successResponse(res, restaurantData);
    } catch (error) {
      next(error);
    }
  },
);

export default router;

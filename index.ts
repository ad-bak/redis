import express from "express";
import resturantsRouter from "./routes/restaurants.ts";
import cuisinesRouter from "./routes/cuisines";
import { errorHandler } from "./middleware/errorHandler.ts";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use("/restaurants", resturantsRouter);
app.use("/cuisines", cuisinesRouter);

app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
    throw new Error("Server is not running");
  });

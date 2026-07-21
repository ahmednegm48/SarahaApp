import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import messageRouter from "./modules/messages/message.controller.js";
import { successResponse } from "./common/utils/response/success.response.js";
import {
  globalErrorHandler,
  notFoundException,
} from "./common/utils/response/error.response.js";
import connectDB from "./DB/connection.js";
import cors from "cors";
import { resolve } from "path";

const bootstrap = async (app, express) => {
  app.use(express.json(), cors());
  await connectDB();

  app.get("/", (req, res) => {
    successResponse({
      res,
      statusCode: 201,
      message: "App initialized successfully",
    });
  });

  app.use("/auth", authRouter);
  app.use("/uploads", express.static(resolve("./src/uploads")));
  app.use("/users", userRouter);
  app.use("/messages", messageRouter);

  app.get("/", (req, res) => res.send("welcome :)"));

  app.all("/*dummy", (req, res) => {
    throw notFoundException("Not Found!!!!");
  });

  app.use(globalErrorHandler);
};

export default bootstrap;

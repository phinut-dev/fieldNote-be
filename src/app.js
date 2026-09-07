import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { sendResponse } from "./utils/response.js";

const app = express();
const port = process.env.PORT || 3000;
let corsOptions = {
  origin: [],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", router);
app.use((req, res) => {
  return sendResponse(res, 404, "URL not found", null);
});
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return sendResponse(res, 400, "Invalid JSON format");
  }

  const status = error.status || 500;

  return sendResponse(
    res,
    status,
    status === 500 ? "Internal server error" : error.message,
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

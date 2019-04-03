import express from "express";
import cors from "cors";
import iot from "./use-cases/iot";

const app = express();

app.use(cors());

app.use("/iot", iot);

app.listen(3000, () => console.log("Example app listening on port 3000!"));

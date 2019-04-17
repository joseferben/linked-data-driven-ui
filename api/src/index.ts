import logger from "morgan";
import express from "express";
import cors from "cors";
import iot from "./use-cases/iot";
import kanban from "./use-cases/kanban";

const app = express();

app.use(cors());
app.use(logger("tiny"));

app.use("/iot", iot);
app.use("/iot", express.static("public"));
app.use("/kanban", kanban);
app.use("/kanban", express.static("public"));

app.get("/", (_, res) => {
  res.json({ message: "This is not the hydra endpoint, try /iot" });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));

process.on("SIGINT", () => {
  console.log("Bye bye!");
  process.exit();
});

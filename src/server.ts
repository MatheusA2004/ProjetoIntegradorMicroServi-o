import { app } from "./app";

app.listen({ port: 3002, host: "0.0.0.0" }).then(() => {
  console.log("🚀 Server rodando na porta 3002");
});
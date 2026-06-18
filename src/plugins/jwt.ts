import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async (app) => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET não definido no .env");
  }

  app.register(jwt, { secret });
});
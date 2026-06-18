import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Token inválido ou ausente" });
  }
}

export async function authorizeAdmin(req: FastifyRequest, reply: FastifyReply) {
  if (req.user?.role !== "ADMIN") {
    return reply.status(403).send({ message: "Acesso negado" });
  }
}
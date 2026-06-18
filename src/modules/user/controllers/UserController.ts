import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../service/UserService";
import { userToResponse } from "../user.mapper";

const service = new UserService();

export class UserController {

  async register(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await service.createUser(req.body);
      return reply.status(201).send(userToResponse(user));
    } catch (err: any) {
      console.error(err);
      if (err.message === "USER_ALREADY_EXISTS") {
        return reply.status(409).send({ message: "Usuário já cadastrado" });
      }
      return reply.status(500).send({ message: err.message });
    }
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, senha } = req.body as any;
      const user = await service.login(email, senha);

      const token = await reply.jwtSign({
        id: Number(user.id),
        email: user.email,
        role: user.role
      });

      return reply.send({
        token,
        user: userToResponse(user)
      });
    } catch (err: any) {
      return reply.status(401).send({ message: "Credenciais inválidas" });
    }
  }

  async me(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await service.findById(req.user.id);
      return reply.send(userToResponse(user));
    } catch {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    const users = await service.listAll();
    return reply.send(users.map(userToResponse));
  }

  async updateRole(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const { role } = req.body as { role: "USER" | "ADMIN" };

      const user = await service.updateRole(Number(id), role);
      return reply.send(userToResponse(user));
    } catch (err: any) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }
  }
}
import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { createUserSchema, loginSchema, updateRoleSchema } from "../schema/UserSchema";
import { authenticate, authorizeAdmin } from "../middleware/auth.middlewares";
import { z } from "zod";

const controller = new UserController();

const userResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  cpf: z.string(),
  telefone: z.string().nullable().optional(),
  ativo: z.boolean().optional(),
  role: z.enum(["USER", "ADMIN"]),
  dataCriacao: z.date().or(z.string()).optional(),
});

export async function userRoutes(app: FastifyInstance) {

  // PÚBLICA
  app.post("/register", {
    schema: {
      tags: ["Usuários"],
      summary: "Criar novo usuário",
      body: createUserSchema,
      response: {
        201: userResponseSchema,
        409: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    }
  }, controller.register);

  // PÚBLICA
  app.post("/login", {
    schema: {
      tags: ["Autenticação"],
      summary: "Login do usuário",
      body: loginSchema,
      response: {
        200: z.object({
          token: z.string(),
          user: userResponseSchema,
        }),
        401: z.object({ message: z.string() }),
      },
    }
  }, controller.login);

  // AUTENTICADA (qualquer role)
  app.get("/me", {
    preHandler: [authenticate],
    schema: {
      tags: ["Usuários"],
      summary: "Dados do usuário logado",
      security: [{ bearerAuth: [] }],
      response: {
        200: userResponseSchema,
        401: z.object({ message: z.string() }),
      },
    }
  }, controller.me);

  // ADMIN ONLY
  app.get("/", {
    preHandler: [authenticate, authorizeAdmin],
    schema: {
      tags: ["Admin"],
      summary: "Listar todos os usuários",
      security: [{ bearerAuth: [] }],
      response: {
        200: z.array(userResponseSchema),
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
      },
    }
  }, controller.list);

  // ADMIN ONLY
  app.patch("/:id/role", {
    preHandler: [authenticate, authorizeAdmin],
    schema: {
      tags: ["Admin"],
      summary: "Atualizar role de um usuário",
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      body: updateRoleSchema,
      response: {
        200: userResponseSchema,
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    }
  }, controller.updateRole);
}
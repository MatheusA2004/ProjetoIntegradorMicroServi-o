import Fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import jwtPlugin from "./plugins/jwt";
import { userRoutes } from "./modules/user/routes/UserRoutes";
import "dotenv/config";
import fastifyCors from "@fastify/cors";

export const app = Fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Swagger (documentação da API)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Projeto Integrador - Microserviço",
      description: "Documentação da API de usuários",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3002",
        description: "Ambiente de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifyCors, {
  origin: true,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
});

app.register(jwtPlugin);
app.register(userRoutes, { prefix: "/users" });
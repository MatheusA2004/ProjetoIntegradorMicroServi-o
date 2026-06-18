import { z } from "zod";

export const createUserSchema = z.object({
  nome: z.string().min(3),
  cpf: z.string().length(11),
  email: z.string().email(),
  telefone: z.string().optional(),
  senha: z.string().min(6),

  endereco: z.object({
    rua: z.string(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string(),
    cep: z.string(),
    complemento: z.string().optional()
  }).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string()
});


export const updateRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"])
});
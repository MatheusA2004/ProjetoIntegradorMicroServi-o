import { prisma } from "../../../config/prisma";
import * as bcrypt from "bcrypt";

export class UserService {

  async createUser(data: any) {
    const { endereco, senha, ...userData } = data;

    // verifica duplicidade
    const exists = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { cpf: userData.cpf }
        ]
      }
    });

    if (exists) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        ...userData,
        senha: hashedPassword,
        ...(endereco ? { enderecos: { create: endereco } } : {})
      }
    });

    return user;
  }

  async login(email: string, senha: string) {
    const user = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(senha, user.senha);

    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    return user;
  }

  async listAll() {
    return prisma.usuario.findMany({
      orderBy: { dataCriacao: "desc" }
    });
  }

  async findById(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id: BigInt(id) }
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  async updateRole(id: number, role: "USER" | "ADMIN") {
    return prisma.usuario.update({
      where: { id: BigInt(id) },
      data: { role }
    });
  }
}
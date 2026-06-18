export function userToResponse(user: any) {
  return {
    id: Number(user.id),
    nome: user.nome,
    email: user.email,
    cpf: user.cpf,
    telefone: user.telefone,
    ativo: user.ativo,
    role: user.role,
    dataCriacao: user.dataCriacao
  };
}
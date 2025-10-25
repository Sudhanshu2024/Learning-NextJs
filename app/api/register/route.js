import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  const { name, email, password } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return new Response("User already exists", { status: 400 });

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return Response.json(user);
}

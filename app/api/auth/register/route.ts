import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const { username, email, password } = await req.json()

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  })

  return NextResponse.json({ message: 'User registered successfully' })
}

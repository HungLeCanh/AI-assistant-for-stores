// app/api/location/user/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAuth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const user = verifyAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const locations = await prisma.location.findMany({
    where: { userId: user.userId },
    orderBy: { id: 'desc' },
  })

  return NextResponse.json({ locations })
}

export async function POST(req: NextRequest) {
  const user = verifyAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { latitude, longitude, detail } = body

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    typeof detail !== 'string'
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const location = await prisma.location.create({
    data: {
      latitude,
      longitude,
      detail,
      userId: user.userId,
    },
  })

  return NextResponse.json({ location }, { status: 201 })
}

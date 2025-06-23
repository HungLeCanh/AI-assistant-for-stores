// api/user/info/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// get user info bao gồm id, username, email, createdAt và danh sách location
export async function GET(req: NextRequest) {
  const user = verifyAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userInfo = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      locations: {
        select: {
          id: true,
          latitude: true,
          longitude: true,
          detail: true,
        },
        orderBy: { id: 'desc' },
      },
    },
  })

  if (!userInfo) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ userInfo })
}
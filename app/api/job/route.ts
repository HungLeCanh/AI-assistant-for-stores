import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, JobStatus } from '@prisma/client'
import { verifyAuth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const user = verifyAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const jobs = await prisma.job.findMany({
    where: { userId: user.userId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ jobs })
}

export async function POST(req: NextRequest) {
  const user = verifyAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, categoryName } = body

  if (!title || !description || !categoryName) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
  }

  const category = await prisma.category.findUnique({
    where: { name: categoryName },
  })

  if (!category) {
    return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 400 })
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      userId: user.userId,
      categoryId: category.id,
      status: JobStatus.PENDING,
    },
  })

  return NextResponse.json({ job }, { status: 201 })
}

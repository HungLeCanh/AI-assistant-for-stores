import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, JobStatus } from '@prisma/client'
import { verifyAuth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const user = verifyAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const complaints = await prisma.complaint.findMany({
    where: { userId: user.userId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          status: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ complaints })
}

export async function POST(req: NextRequest) {
  const user = verifyAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { jobId, content } = body

  if (!jobId || !content) {
    return NextResponse.json({ error: 'Thiếu jobId hoặc nội dung khiếu nại' }, { status: 400 })
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId: user.userId,
      status: JobStatus.COMPLETED // Chỉ cho phép khiếu nại với công việc đã hoàn thành
    }
  })

  if (!job) {
    return NextResponse.json({ error: 'Không tìm thấy công việc đang thực hiện để khiếu nại' }, { status: 400 })
  }

  const complaint = await prisma.complaint.create({
    data: {
      content,
      userId: user.userId,
      jobId: job.id
    }
  })

  return NextResponse.json({ complaint }, { status: 201 })
}

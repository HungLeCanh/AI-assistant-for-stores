import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// post
export async function POST(req: NextRequest) {
  const user = verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId }
  });
  if (!existingUser) {
    return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 400 });
  }


  const body = await req.json();
  const { supportCategoryName, content } = body;

  if (!supportCategoryName || !content) {
    return NextResponse.json({ error: "Thiếu supportCategory hoặc nội dung yêu cầu hỗ trợ" }, { status: 400 });
  }

  const supportCategory = await prisma.supportCategory.findUnique({
    where: {
      name: supportCategoryName,
    },
  });

  if (!supportCategory) {
    return NextResponse.json({ error: "Không tìm thấy danh mục hỗ trợ" }, { status: 400 });
  }

  const supportRequest = await prisma.supportRequest.create({
    data: {
      content,
      userId: user.userId,
      categoryId: supportCategory.id
    },
  });

  return NextResponse.json({ supportRequest }, { status: 201 });
}
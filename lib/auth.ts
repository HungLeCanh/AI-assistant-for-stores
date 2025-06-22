// lib/auth.ts

import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthPayload {
  userId: string
  username: string
  iat?: number
  exp?: number
}

export function verifyAuth(req: NextRequest): AuthPayload | null {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload
    return decoded
  } catch {
    return null
  }
}

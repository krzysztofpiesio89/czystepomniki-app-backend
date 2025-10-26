import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cemeteries = await prisma.cemetery.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(cemeteries)
  } catch (error) {
    console.error('Database error fetching cemeteries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cemeteries' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { dbStatements } from '@/lib/db'

export async function GET() {
  try {
    const cemeteries = dbStatements.getAllCemeteries.all()
    return NextResponse.json(cemeteries)
  } catch (error) {
    console.error('Database error fetching cemeteries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cemeteries' },
      { status: 500 }
    )
  }
}
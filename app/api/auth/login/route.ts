import { NextRequest, NextResponse } from 'next/server'
import { dbStatements } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = dbStatements.getUserByEmail.get(email) as any

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Simple password check (in production, use proper hashing)
    const hashedPassword = Buffer.from(password).toString('base64')
    if (user.password_hash !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if this is first login
    if (user.is_first_login) {
      // Mark as not first login
      dbStatements.updateUserFirstLogin.run(user.id)

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isFirstLogin: true
        },
        message: 'First login successful. Please change your password.'
      })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isFirstLogin: false
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
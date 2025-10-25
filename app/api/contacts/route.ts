import { NextRequest, NextResponse } from 'next/server'
import { dbStatements } from '@/lib/db'


export async function GET() {
  try {
    const contacts = dbStatements.getAllContacts.all()
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Database error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, email, phone, notes } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if contact already exists
    const existingContact = dbStatements.getContactByEmail.get(email)
    if (existingContact) {
      return NextResponse.json(
        { error: 'Contact with this email already exists' },
        { status: 409 }
      )
    }

    // Insert new contact
    try {
      const result = dbStatements.insertContact.run(name, email, phone || '', notes || '')

      return NextResponse.json(
        {
          id: result.lastInsertRowid,
          name,
          email,
          phone: phone || '',
          notes: notes || ''
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.error('Database error during contact insertion:', dbError)
      return NextResponse.json(
        { error: 'Failed to create contact due to database error' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Unexpected error creating contact:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    // Validate ID is a number
    const contactId = parseInt(id, 10)
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: 'Invalid contact ID format' },
        { status: 400 }
      )
    }

    try {
      const result = dbStatements.deleteContact.run(contactId)

      if (result.changes === 0) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ message: 'Contact deleted successfully' })
    } catch (dbError) {
      console.error('Database error during contact deletion:', dbError)
      return NextResponse.json(
        { error: 'Failed to delete contact due to database error' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Unexpected error deleting contact:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
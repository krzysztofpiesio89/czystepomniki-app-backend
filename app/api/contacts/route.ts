import { NextRequest, NextResponse } from 'next/server'
import { dbStatements } from '@/lib/db'

export async function GET() {
  try {
    const contacts = dbStatements.getAllContacts.all()
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, notes } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
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

  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
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

    const result = dbStatements.deleteContact.run(id)

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Contact deleted successfully' })

  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { dbStatements } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const contacts = await request.json()

    if (!Array.isArray(contacts)) {
      return NextResponse.json(
        { error: 'Expected array of contacts' },
        { status: 400 }
      )
    }

    const savedContacts = []

    for (const contact of contacts) {
      // Validate required fields
      if (!contact.name || !contact.email) {
        continue // Skip invalid contacts
      }

      // Check if contact already exists
      const existing = dbStatements.getContactByEmail.get(contact.email) as any
      if (existing) {
        // Update existing contact
        dbStatements.updateContact.run(
          contact.name,
          contact.email,
          contact.phone || '',
          contact.notes || '',
          contact.googlePlusCode || '',
          existing.id
        )
        savedContacts.push({ ...existing, ...contact })
      } else {
        // Insert new contact
        const result = dbStatements.insertContact.run(
          contact.name,
          contact.email,
          contact.phone || '',
          contact.notes || '',
          contact.googlePlusCode || ''
        )
        savedContacts.push({
          id: result.lastInsertRowid,
          ...contact
        })
      }
    }

    return NextResponse.json(savedContacts)

  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Failed to import contacts' },
      { status: 500 }
    )
  }
}
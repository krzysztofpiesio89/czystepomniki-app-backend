import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

      try {
        // Use upsert to handle both create and update in one operation
        const savedContact = await prisma.contact.upsert({
          where: { email: contact.email },
          update: {
            name: contact.name,
            phone: contact.phone || null,
            notes: contact.notes || null,
            googlePlusCode: contact.googlePlusCode || null
          },
          create: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone || null,
            notes: contact.notes || null,
            googlePlusCode: contact.googlePlusCode || null
          }
        })

        savedContacts.push(savedContact)
      } catch (contactError) {
        console.error('Error saving contact:', contact.email, contactError)
        // Continue with other contacts even if one fails
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
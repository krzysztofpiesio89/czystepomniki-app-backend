import { dbStatements } from '../lib/db'
import { prisma } from '../lib/prisma'

interface ContactRow {
  id: number
  name: string
  email: string
  phone: string | null
  notes: string | null
  google_plus_code: string | null
  created_at: string
}

interface SummaryRow {
  id: number
  contact_name: string
  email: string
  description: string
  photos_before: string | null
  photos_after: string | null
  sent_at: string
}

interface CemeteryRow {
  id: string
  name: string
}

async function migrateData() {
  console.log('Starting data migration from SQLite to PostgreSQL...')

  try {
    // Migrate contacts
    console.log('Migrating contacts...')
    const contacts = dbStatements.getAllContacts.all() as ContactRow[]
    for (const contact of contacts) {
      await prisma.contact.create({
        data: {
          id: contact.id.toString(), // Convert SQLite INTEGER to String
          name: contact.name,
          email: contact.email,
          phone: contact.phone || null,
          notes: contact.notes || null,
          googlePlusCode: contact.google_plus_code || null,
          createdAt: new Date(contact.created_at)
        }
      })
    }
    console.log(`Migrated ${contacts.length} contacts`)

    // Migrate summaries
    console.log('Migrating summaries...')
    const summaries = dbStatements.getAllSummaries.all() as SummaryRow[]
    for (const summary of summaries) {
      await prisma.summary.create({
        data: {
          id: summary.id.toString(),
          contactName: summary.contact_name,
          email: summary.email,
          description: summary.description,
          photosBefore: summary.photos_before,
          photosAfter: summary.photos_after,
          sentAt: new Date(summary.sent_at)
        }
      })
    }
    console.log(`Migrated ${summaries.length} summaries`)

    // Migrate cemeteries
    console.log('Migrating cemeteries...')
    const cemeteries = dbStatements.getAllCemeteries.all() as CemeteryRow[]
    for (const cemetery of cemeteries) {
      await prisma.cemetery.create({
        data: {
          id: cemetery.id,
          name: cemetery.name
        }
      })
    }
    console.log(`Migrated ${cemeteries.length} cemeteries`)

    console.log('Migration completed successfully!')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateData().then(() => {
  console.log('Migration script finished')
  process.exit(0)
})
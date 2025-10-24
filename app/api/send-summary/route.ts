import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { dbStatements } from '@/lib/db'
import { render } from '@react-email/render'
import SummaryEmail from '@/app/emails/SummaryEmail'
import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key')


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const description = formData.get('description') as string

    // Get photo files - collect all files with different indices
    const photoBeforeFiles: File[] = []
    const photoAfterFiles: File[] = []

    // Collect all photoBefore files
    for (let i = 0; ; i++) {
      const files = formData.getAll(`photoBefore_${i}`) as File[]
      if (files.length === 0) break
      photoBeforeFiles.push(...files)
    }

    // Collect all photoAfter files
    for (let i = 0; ; i++) {
      const files = formData.getAll(`photoAfter_${i}`) as File[]
      if (files.length === 0) break
      photoAfterFiles.push(...files)
    }

    // For now, we'll send a simple email without attachments
    // In a real implementation, you'd upload files to a storage service first

    // Get current date and time
    const currentDate = new Date().toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const photoBeforeUrls = []
    const photoAfterUrls = []

    // Upload images to Vercel Blob Storage
    for (let i = 0; i < photoBeforeFiles.length; i++) {
      const file = photoBeforeFiles[i]
      const fileName = `przed-${randomUUID()}.jpg`
      const blob = await put(fileName, file, { access: 'public' })
      photoBeforeUrls.push(blob.url)
    }

    for (let i = 0; i < photoAfterFiles.length; i++) {
      const file = photoAfterFiles[i]
      const fileName = `po-${randomUUID()}.jpg`
      const blob = await put(fileName, file, { access: 'public' })
      photoAfterUrls.push(blob.url)
    }

    const html = render(
      SummaryEmail({
        contactName,
        email,
        description,
        currentDate,
        photoBeforeUrls,
        photoAfterUrls
      })
    )

    // Prepare attachments from uploaded photos
    const attachments = []

    // Add before photos as attachments
    for (let i = 0; i < photoBeforeFiles.length; i++) {
      const file = photoBeforeFiles[i]
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: `zdjecie-przed-${i + 1}.jpg`,
        content: buffer,
        contentType: file.type || 'image/jpeg'
      })
    }

    // Add after photos as attachments
    for (let i = 0; i < photoAfterFiles.length; i++) {
      const file = photoAfterFiles[i]
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: `zdjecie-po-${i + 1}.jpg`,
        content: buffer,
        contentType: file.type || 'image/jpeg'
      })
    }

    const { data, error } = await resend.emails.send({
      from: 'Czyste Pomniki <podsumowanie@posprzatamy-grob.pl>',
      to: email,
      subject: `Podsumowanie prac - ${contactName}`,
      html,
      attachments
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Save summary to database
    try {
      const photosBeforeJson = JSON.stringify(photoBeforeUrls)
      const photosAfterJson = JSON.stringify(photoAfterUrls)

      dbStatements.insertSummary.run(
        contactName,
        email,
        description,
        photosBeforeJson,
        photosAfterJson
      )
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Don't fail the request if DB save fails, but log it
    }

    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
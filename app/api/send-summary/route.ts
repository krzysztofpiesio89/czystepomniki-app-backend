import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { dbStatements } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const description = formData.get('description') as string

    // Get photo files
    const photoBeforeFiles = formData.getAll('photoBefore_0') as File[]
    const photoAfterFiles = formData.getAll('photoAfter_0') as File[]

    // For now, we'll send a simple email without attachments
    // In a real implementation, you'd upload files to a storage service first

    const { data, error } = await resend.emails.send({
      from: 'Czyste Pomniki <noreply@czystepomniki.pl>',
      to: email,
      subject: `Podsumowanie prac - ${contactName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Podsumowanie wykonanych prac</h1>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #666; margin-top: 0;">Informacje o kliencie</h2>
            <p><strong>Imię i nazwisko:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #666; margin-top: 0;">Opis wykonanych prac</h2>
            <p style="line-height: 1.6;">${description.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32;">
              <strong>Zdjęcia:</strong> ${photoBeforeFiles.length + photoAfterFiles.length} plików zostało przesłanych wraz z formularzem.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; margin: 0;">
              Czyste Pomniki - Profesjonalne usługi czyszczenia pomników
            </p>
          </div>
        </div>
      `,
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
      const photosBeforeJson = JSON.stringify([]) // For now, we'll store empty arrays
      const photosAfterJson = JSON.stringify([])   // In production, you'd upload files and store URLs

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
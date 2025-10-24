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

    // Get current date and time
    const currentDate = new Date().toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Process attachments synchronously
    const attachments = []
    for (let i = 0; i < photoBeforeFiles.length; i++) {
      const file = photoBeforeFiles[i]
      attachments.push({
        filename: `przed-${i + 1}.jpg`,
        content: Buffer.from(await file.arrayBuffer()),
        cid: `photo-before-${i}`
      })
    }
    for (let i = 0; i < photoAfterFiles.length; i++) {
      const file = photoAfterFiles[i]
      attachments.push({
        filename: `po-${i + 1}.jpg`,
        content: Buffer.from(await file.arrayBuffer()),
        cid: `photo-after-${i}`
      })
    }

    const { data, error } = await resend.emails.send({
      from: 'Czyste Pomniki <noreply@czystepomniki.pl>',
      to: email,
      subject: `Podsumowanie prac - ${contactName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Podsumowanie wykonanych prac</h1>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #666; margin-top: 0;">Szanowny Kliencie</h2>
            <p>Informujemy, że w dniu <strong>${currentDate}</strong> wykonaliśmy usługę sprzątania grobu.</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #666; margin-top: 0;">Opis wykonanych prac</h2>
            <p style="line-height: 1.6;">${description.replace(/\n/g, '<br>')}</p>
          </div>

          ${photoBeforeFiles.length > 0 ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Przed wykonaniem usługi</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
              ${photoBeforeFiles.map((_, index) => `
                <img src="cid:photo-before-${index}" alt="Przed wykonaniem usługi" style="max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${photoAfterFiles.length > 0 ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Po wykonaniu usługi</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
              ${photoAfterFiles.map((_, index) => `
                <img src="cid:photo-after-${index}" alt="Po wykonaniu usługi" style="max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32; text-align: center; font-weight: bold;">
              Dziękujemy za skorzystanie z naszych usług!
            </p>
          </div>

          <table style="width: 100%; background-color: #1a1a1a; font-family: 'Book Antiqua', serif; font-size: clamp(12px, 2.5vw, 16px); color: #f2f2f2; padding: 20px 10px; box-shadow: rgba(0, 0, 0, 0.6) 0px 4px 10px; overflow-wrap: break-word; margin-left: auto; margin-right: auto;">
            <tbody>
              <tr>
                <td align="center">
                  <table style="width: 100%; max-width: 900px; padding: 0 10px; color: #f2f2f2;" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td style="width: 60%; text-align: left; vertical-align: top; line-height: 1.6; word-wrap: break-word;">
                          <strong style="font-size: clamp(14px, 3vw, 18px); color: inherit;">CzystePomniki.pl</strong><br />
                          ul. Majowa 59<br />
                          05-462 Dziechciniec<br />
                          Tel: <a style="color: inherit; text-decoration: none;" href="tel:+48799820556">+48 799 820 556</a><br />
                          Email: <a style="color: inherit; text-decoration: none;" href="mailto:biuro@czystepomniki.pl">biuro@czystepomniki.pl</a>
                        </td>
                        <td style="width: 40%; text-align: center; vertical-align: middle;">
                          <div style="display: inline-block; text-align: center;">
                            <img style="max-width: 30%; height: auto;" src="https://www.czystepomniki.pl/wp-content/uploads/2022/09/cropped-logo_red.webp" alt="Czyste Pomniki" />
                            <div style="font-size: clamp(10px, 2vw, 13px); color: #dddddd; margin-top: 8px;">Profesjonalne usługi sprzątania grob&oacute;w</div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="text-align: center; padding-top: 40px; border-top: 1px solid #333333;" colspan="2">
                          <a style="margin: 0 15px; color: #f2f2f2; font-weight: bold; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;" href="https://www.facebook.com/people/Czystepomnikipl/" rel="noopener">FB</a>
                          <a style="margin: 0 15px; color: #f2f2f2; font-weight: bold; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;" href="https://x.com/czystepomnikipl/" rel="noopener">X</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <p style="text-align: center;"><span style="font-family: 'book antiqua', palatino, serif; font-size: 12pt;">CzystePomniki 2025</span></p>
        </div>
      `,
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
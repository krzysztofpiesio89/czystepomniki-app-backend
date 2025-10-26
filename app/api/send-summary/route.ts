import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { dbStatements } from '@/lib/db'
import { render } from '@react-email/render'
import SummaryEmail from '@/app/emails/SummaryEmail'
import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const resend = new Resend(process.env.RESEND_API_KEY!)


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const greeting = formData.get('greeting') as string
    const servicePackage = formData.get('servicePackage') as string
    const servicePrice = formData.get('servicePrice') as string
    const cemetery = formData.get('cemetery') as string
    const graveLocation = formData.get('graveLocation') as string
    const googlePlusCode = formData.get('googlePlusCode') as string
    const description = formData.get('description') as string
    const servicesJson = formData.get('services') as string
    const services = servicesJson ? JSON.parse(servicesJson) : []

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

    // Check total upload size (max 50MB = 52428800 bytes)
    const totalSize = [...photoBeforeFiles, ...photoAfterFiles].reduce((sum, file) => sum + file.size, 0)
    if (totalSize > 52428800) {
      return NextResponse.json(
        { error: 'Total upload size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Compress images to max 300kb each
    const compressImage = async (file: File): Promise<Buffer> => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const maxSizeBytes = 307200 // 300kb

      // If already under limit, return as is
      if (buffer.length <= maxSizeBytes) {
        return buffer
      }

      // Compress with Sharp
      let quality = 80
      let compressed = await sharp(buffer)
        .jpeg({ quality })
        .toBuffer()

      // Reduce quality until under limit
      while (compressed.length > maxSizeBytes && quality > 10) {
        quality -= 10
        compressed = await sharp(buffer)
          .jpeg({ quality })
          .toBuffer()
      }

      // If still too big, resize
      if (compressed.length > maxSizeBytes) {
        compressed = await sharp(buffer)
          .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 70 })
          .toBuffer()
      }

      return compressed
    }

    // Compress all photoBefore files
    const compressedPhotoBeforeFiles: Buffer[] = []
    for (const file of photoBeforeFiles) {
      const compressed = await compressImage(file)
      compressedPhotoBeforeFiles.push(compressed)
    }

    // Compress all photoAfter files
    const compressedPhotoAfterFiles: Buffer[] = []
    for (const file of photoAfterFiles) {
      const compressed = await compressImage(file)
      compressedPhotoAfterFiles.push(compressed)
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

    // Upload compressed images to Vercel Blob Storage
    for (let i = 0; i < compressedPhotoBeforeFiles.length; i++) {
      const buffer = compressedPhotoBeforeFiles[i]
      const fileName = `przed-${randomUUID()}.jpg`
      const blob = await put(fileName, buffer, { access: 'public' })
      photoBeforeUrls.push(blob.url)
    }

    for (let i = 0; i < compressedPhotoAfterFiles.length; i++) {
      const buffer = compressedPhotoAfterFiles[i]
      const fileName = `po-${randomUUID()}.jpg`
      const blob = await put(fileName, buffer, { access: 'public' })
      photoAfterUrls.push(blob.url)
    }

    const html = render(
      SummaryEmail({
        contactName,
        email,
        greeting,
        servicePackage,
        servicePrice,
        cemetery,
        graveLocation,
        googlePlusCode: googlePlusCode || '',
        description,
        currentDate,
        photoBeforeUrls,
        photoAfterUrls,
        services
      })
    )

    // Prepare attachments from compressed photos
    const attachments = []

    // Add before photos as attachments
    for (let i = 0; i < compressedPhotoBeforeFiles.length; i++) {
      const buffer = compressedPhotoBeforeFiles[i]
      attachments.push({
        filename: `zdjecie-przed-${i + 1}.jpg`,
        content: buffer,
        contentType: 'image/jpeg'
      })
    }

    // Add after photos as attachments
    for (let i = 0; i < compressedPhotoAfterFiles.length; i++) {
      const buffer = compressedPhotoAfterFiles[i]
      attachments.push({
        filename: `zdjecie-po-${i + 1}.jpg`,
        content: buffer,
        contentType: 'image/jpeg'
      })
    }

    const { data, error } = await resend.emails.send({
      from: 'Czyste Pomniki <biuro@czystepomniki.pl>',
      to: [email, 'krzysztofpiesio89@gmail.com', 'katarzynapiesio@op.pl', 'biuro@czystepomniki.pl'],
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
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { render } from '@react-email/render'
import SummaryEmail from '@/app/emails/SummaryEmail'
import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const resend = new Resend(process.env.RESEND_API_KEY!)


export const maxDuration = 300; // 5 minutes timeout for large uploads

export async function POST(request: NextRequest) {
  try {
    // Increase Node.js memory limit for large uploads
    if (typeof process !== 'undefined' && process.env) {
      process.env.NODE_OPTIONS = '--max-old-space-size=4096';
    }

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

    // No size or count limits - allow unlimited uploads
    const totalSize = [...photoBeforeFiles, ...photoAfterFiles].reduce((sum, file) => sum + file.size, 0)
    const totalImages = photoBeforeFiles.length + photoAfterFiles.length

    console.log(`Processing ${totalImages} images with total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`)

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

    // Compress all photoBefore files with memory management
    const compressedPhotoBeforeFiles: Buffer[] = []
    for (let i = 0; i < photoBeforeFiles.length; i++) {
      const file = photoBeforeFiles[i]
      console.log(`Compressing before photo ${i + 1}/${photoBeforeFiles.length}`)
      const compressed = await compressImage(file)
      compressedPhotoBeforeFiles.push(compressed)

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
    }

    // Compress all photoAfter files with memory management
    const compressedPhotoAfterFiles: Buffer[] = []
    for (let i = 0; i < photoAfterFiles.length; i++) {
      const file = photoAfterFiles[i]
      console.log(`Compressing after photo ${i + 1}/${photoAfterFiles.length}`)
      const compressed = await compressImage(file)
      compressedPhotoAfterFiles.push(compressed)

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
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

    // Upload compressed images to Vercel Blob Storage with memory management
    for (let i = 0; i < compressedPhotoBeforeFiles.length; i++) {
      const buffer = compressedPhotoBeforeFiles[i]
      const fileName = `przed-${randomUUID()}.jpg`
      console.log(`Uploading before photo ${i + 1}/${compressedPhotoBeforeFiles.length}`)
      const blob = await put(fileName, buffer, { access: 'public' })
      photoBeforeUrls.push(blob.url)

      // Clear buffer reference and force GC
      compressedPhotoBeforeFiles[i] = Buffer.alloc(0)
      if (global.gc) {
        global.gc()
      }
    }

    for (let i = 0; i < compressedPhotoAfterFiles.length; i++) {
      const buffer = compressedPhotoAfterFiles[i]
      const fileName = `po-${randomUUID()}.jpg`
      console.log(`Uploading after photo ${i + 1}/${compressedPhotoAfterFiles.length}`)
      const blob = await put(fileName, buffer, { access: 'public' })
      photoAfterUrls.push(blob.url)

      // Clear buffer reference and force GC
      compressedPhotoAfterFiles[i] = Buffer.alloc(0)
      if (global.gc) {
        global.gc()
      }
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

    // Prepare attachments from compressed photos (limit to first 5 images to avoid email size limits)
    const attachments = []
    const maxAttachments = 5

    // Add before photos as attachments (up to maxAttachments/2)
    const beforeLimit = Math.min(Math.floor(maxAttachments / 2), compressedPhotoBeforeFiles.length)
    for (let i = 0; i < beforeLimit; i++) {
      // Re-compress if needed since we cleared the buffers
      if (compressedPhotoBeforeFiles[i] && compressedPhotoBeforeFiles[i].length > 0) {
        attachments.push({
          filename: `zdjecie-przed-${i + 1}.jpg`,
          content: compressedPhotoBeforeFiles[i],
          contentType: 'image/jpeg'
        })
      }
    }

    // Add after photos as attachments (up to maxAttachments/2)
    const afterLimit = Math.min(Math.floor(maxAttachments / 2), compressedPhotoAfterFiles.length)
    for (let i = 0; i < afterLimit; i++) {
      // Re-compress if needed since we cleared the buffers
      if (compressedPhotoAfterFiles[i] && compressedPhotoAfterFiles[i].length > 0) {
        attachments.push({
          filename: `zdjecie-po-${i + 1}.jpg`,
          content: compressedPhotoAfterFiles[i],
          contentType: 'image/jpeg'
        })
      }
    }

    console.log(`Email will include ${attachments.length} image attachments (limited to ${maxAttachments} total)`)

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
      await prisma.summary.create({
        data: {
          contactName,
          email,
          description,
          photosBefore: JSON.stringify(photoBeforeUrls),
          photosAfter: JSON.stringify(photoAfterUrls)
        }
      })
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
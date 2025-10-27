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
    // Increase Node.js memory limit for large uploads and enable GC
    if (typeof process !== 'undefined' && process.env) {
      process.env.NODE_OPTIONS = '--max-old-space-size=8192 --expose-gc';
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

    // Compress images to max 300kb each with memory optimization
    const compressImage = async (file: File): Promise<Buffer> => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const maxSizeBytes = 307200 // 300kb

      // If already under limit, return as is
      if (buffer.length <= maxSizeBytes) {
        return buffer
      }

      // Use streaming approach for large images to reduce memory usage
      let compressed: Buffer
      let quality = 80

      // Try compression with decreasing quality
      do {
        compressed = await sharp(buffer, {
          // Limit input buffer size for memory efficiency
          limitInputPixels: 50 * 1024 * 1024 // 50MP limit
        })
          .jpeg({
            quality,
            progressive: true,
            optimizeScans: true
          })
          .toBuffer()

        quality -= 10
      } while (compressed.length > maxSizeBytes && quality > 10)

      // If still too big, resize with memory-efficient approach
      if (compressed.length > maxSizeBytes) {
        // Calculate optimal size based on original dimensions
        const metadata = await sharp(buffer).metadata()
        const aspectRatio = metadata.width! / metadata.height!
        let newWidth = 1920
        let newHeight = Math.round(newWidth / aspectRatio)

        // If height is too large, scale by height instead
        if (newHeight > 1080) {
          newHeight = 1080
          newWidth = Math.round(newHeight * aspectRatio)
        }

        compressed = await sharp(buffer, {
          limitInputPixels: 50 * 1024 * 1024
        })
          .resize(newWidth, newHeight, {
            fit: 'inside',
            withoutEnlargement: true,
            kernel: sharp.kernel.lanczos3 // Better quality scaling
          })
          .jpeg({
            quality: Math.max(quality + 20, 70), // Slightly higher quality after resize
            progressive: true,
            optimizeScans: true
          })
          .toBuffer()
      }

      return compressed
    }

    // Compress all photoBefore files with batch processing to optimize memory
    const compressedPhotoBeforeFiles: Buffer[] = []
    const batchSize = 3 // Process 3 images at a time to balance memory and speed

    for (let i = 0; i < photoBeforeFiles.length; i += batchSize) {
      const batch = photoBeforeFiles.slice(i, i + batchSize)
      const batchPromises = batch.map(async (file, batchIndex) => {
        const globalIndex = i + batchIndex
        console.log(`Compressing before photo ${globalIndex + 1}/${photoBeforeFiles.length}`)
        return await compressImage(file)
      })

      const batchResults = await Promise.all(batchPromises)
      compressedPhotoBeforeFiles.push(...batchResults)

      // Force garbage collection and delay between batches
      if (global.gc) {
        global.gc()
      }
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Compress all photoAfter files with batch processing
    const compressedPhotoAfterFiles: Buffer[] = []
    for (let i = 0; i < photoAfterFiles.length; i += batchSize) {
      const batch = photoAfterFiles.slice(i, i + batchSize)
      const batchPromises = batch.map(async (file, batchIndex) => {
        const globalIndex = i + batchIndex
        console.log(`Compressing after photo ${globalIndex + 1}/${photoAfterFiles.length}`)
        return await compressImage(file)
      })

      const batchResults = await Promise.all(batchPromises)
      compressedPhotoAfterFiles.push(...batchResults)

      // Force garbage collection and delay between batches
      if (global.gc) {
        global.gc()
      }
      await new Promise(resolve => setTimeout(resolve, 200))
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

    // Upload compressed images to Vercel Blob Storage with batching for memory efficiency
    const uploadBatchSize = 5 // Upload 5 images at a time

    // Upload before photos in batches
    for (let i = 0; i < compressedPhotoBeforeFiles.length; i += uploadBatchSize) {
      const batch = compressedPhotoBeforeFiles.slice(i, i + uploadBatchSize)
      const uploadPromises = batch.map(async (buffer, batchIndex) => {
        const globalIndex = i + batchIndex
        const fileName = `przed-${randomUUID()}.jpg`
        console.log(`Uploading before photo ${globalIndex + 1}/${compressedPhotoBeforeFiles.length}`)
        const blob = await put(fileName, buffer, { access: 'public' })
        return blob.url
      })

      const batchUrls = await Promise.all(uploadPromises)
      photoBeforeUrls.push(...batchUrls)

      // Clear batch from memory and force GC
      batch.length = 0
      if (global.gc) {
        global.gc()
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Upload after photos in batches
    for (let i = 0; i < compressedPhotoAfterFiles.length; i += uploadBatchSize) {
      const batch = compressedPhotoAfterFiles.slice(i, i + uploadBatchSize)
      const uploadPromises = batch.map(async (buffer, batchIndex) => {
        const globalIndex = i + batchIndex
        const fileName = `po-${randomUUID()}.jpg`
        console.log(`Uploading after photo ${globalIndex + 1}/${compressedPhotoAfterFiles.length}`)
        const blob = await put(fileName, buffer, { access: 'public' })
        return blob.url
      })

      const batchUrls = await Promise.all(uploadPromises)
      photoAfterUrls.push(...batchUrls)

      // Clear batch from memory and force GC
      batch.length = 0
      if (global.gc) {
        global.gc()
      }
      await new Promise(resolve => setTimeout(resolve, 100))
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
      // Need to re-compress since we cleared the buffers for memory management
      const originalFile = photoBeforeFiles[i]
      if (originalFile) {
        const reCompressed = await compressImage(originalFile)
        attachments.push({
          filename: `zdjecie-przed-${i + 1}.jpg`,
          content: reCompressed,
          contentType: 'image/jpeg'
        })
      }
    }

    // Add after photos as attachments (up to maxAttachments/2)
    const afterLimit = Math.min(Math.floor(maxAttachments / 2), compressedPhotoAfterFiles.length)
    for (let i = 0; i < afterLimit; i++) {
      // Need to re-compress since we cleared the buffers for memory management
      const originalFile = photoAfterFiles[i]
      if (originalFile) {
        const reCompressed = await compressImage(originalFile)
        attachments.push({
          filename: `zdjecie-po-${i + 1}.jpg`,
          content: reCompressed,
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
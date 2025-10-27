import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { render } from '@react-email/render'
import SummaryEmail from '@/app/emails/SummaryEmail'
import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const resend = new Resend(process.env.RESEND_API_KEY!)

// In-memory storage for uploaded images during the session
const uploadedImages = new Map<string, {
  contactName: string;
  email: string;
  greeting?: string;
  servicePackage: string;
  servicePrice: string;
  cemetery: string;
  graveLocation: string;
  googlePlusCode: string;
  description: string;
  services: string[];
  photoBeforeUrls: string[];
  photoAfterUrls: string[];
  timestamp: number;
}>();

// Clean up old sessions (older than 30 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of Array.from(uploadedImages.entries())) {
    if (now - data.timestamp > 30 * 60 * 1000) {
      uploadedImages.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export const maxDuration = 300; // 5 minutes timeout for large uploads

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Check if this is an individual image upload or final submission
    const isImageUpload = formData.has('sessionId') && (formData.has('photoBefore') || formData.has('photoAfter'))
    const isFinalSubmission = !isImageUpload && formData.has('contactName')

    if (isImageUpload) {
      // Handle individual image upload
      const sessionId = formData.get('sessionId') as string
      const photoType = formData.has('photoBefore') ? 'before' : 'after'
      const photoFile = formData.get(photoType === 'before' ? 'photoBefore' : 'photoAfter') as File

      if (!photoFile) {
        return NextResponse.json({ error: 'No photo file provided' }, { status: 400 })
      }

      // Compress the image
      const compressedBuffer = await compressImage(photoFile)

      // Upload to Vercel Blob Storage
      const fileName = `${photoType}-${randomUUID()}.jpg`
      const blob = await put(fileName, compressedBuffer, { access: 'public' })

      // Store in session
      if (!uploadedImages.has(sessionId)) {
        uploadedImages.set(sessionId, {
          contactName: '',
          email: '',
          greeting: '',
          servicePackage: '',
          servicePrice: '',
          cemetery: '',
          graveLocation: '',
          googlePlusCode: '',
          description: '',
          services: [],
          photoBeforeUrls: [],
          photoAfterUrls: [],
          timestamp: Date.now()
        })
      }

      const sessionData = uploadedImages.get(sessionId)!
      if (photoType === 'before') {
        sessionData.photoBeforeUrls.push(blob.url)
      } else {
        sessionData.photoAfterUrls.push(blob.url)
      }

      return NextResponse.json({
        success: true,
        url: blob.url,
        type: photoType,
        sessionImages: {
          before: sessionData.photoBeforeUrls.length,
          after: sessionData.photoAfterUrls.length
        }
      })
    }

    if (isFinalSubmission) {
      // Handle final form submission
      const sessionId = formData.get('sessionId') as string || `session_${Date.now()}`

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

      // Get uploaded images from session
      const sessionData = uploadedImages.get(sessionId)
      const photoBeforeUrls = sessionData?.photoBeforeUrls || []
      const photoAfterUrls = sessionData?.photoAfterUrls || []

      console.log(`Final submission for session ${sessionId}: ${photoBeforeUrls.length + photoAfterUrls.length} images`)

      // Get current date and time
      const currentDate = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

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
      const beforeLimit = Math.min(Math.floor(maxAttachments / 2), photoBeforeUrls.length)
      for (let i = 0; i < beforeLimit; i++) {
        // For attachments, we need to download and re-compress the first few images
        try {
          const response = await fetch(photoBeforeUrls[i])
          if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer())
            const reCompressed = await compressImage(new File([buffer], `before-${i}.jpg`, { type: 'image/jpeg' }))
            attachments.push({
              filename: `zdjecie-przed-${i + 1}.jpg`,
              content: reCompressed,
              contentType: 'image/jpeg'
            })
          }
        } catch (error) {
          console.error(`Failed to create attachment for before photo ${i}:`, error)
        }
      }

      // Add after photos as attachments (up to maxAttachments/2)
      const afterLimit = Math.min(Math.floor(maxAttachments / 2), photoAfterUrls.length)
      for (let i = 0; i < afterLimit; i++) {
        // For attachments, we need to download and re-compress the first few images
        try {
          const response = await fetch(photoAfterUrls[i])
          if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer())
            const reCompressed = await compressImage(new File([buffer], `after-${i}.jpg`, { type: 'image/jpeg' }))
            attachments.push({
              filename: `zdjecie-po-${i + 1}.jpg`,
              content: reCompressed,
              contentType: 'image/jpeg'
            })
          }
        } catch (error) {
          console.error(`Failed to create attachment for after photo ${i}:`, error)
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

      // Clean up session
      uploadedImages.delete(sessionId)

      return NextResponse.json(
        { message: 'Email sent successfully', data },
        { status: 200 }
      )
    }

    // If neither image upload nor final submission, return error
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
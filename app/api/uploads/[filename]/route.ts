import { NextRequest, NextResponse } from 'next/server'
import { put, head } from '@vercel/blob'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // For Vercel Blob, we need to construct the URL
    // Using the actual blob store URL with store ID
    const blobUrl = `https://store_CAoDvxA51Kd92JXy.public.blob.vercel-storage.com/${filename}`

    // Check if blob exists
    try {
      await head(blobUrl)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Redirect to the blob URL
    return NextResponse.redirect(blobUrl)
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Upload to Vercel Blob using request.body for App Router
    const blob = await put(filename, request.body!, {
      access: 'public',
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const url = new URL(request.url);
  const memorialId = url.searchParams.get('memorialId');
  const type = url.searchParams.get('type'); // 'profile' or 'gallery'

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  if (!memorialId || !type) {
    return NextResponse.json({ error: 'Missing memorialId or type parameters.' }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', memorialId, type);
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Use a unique filename, for example, based on timestamp
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, filename);
    const publicUrl = `/uploads/${memorialId}/${type}/${filename}`;

    await writeFile(filePath, fileBuffer);

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ error: 'Error processing file.' }, { status: 500 });
  }
}

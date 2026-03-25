import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateEmbedding } from '@/services/embedding';

export async function POST(req: NextRequest) {
  try {
    const { content, title } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const embedding = await generateEmbedding(content);
    const vectorString = `[${embedding.join(',')}]`;

    // Prisma doesn't support vector columns natively yet, so we use $executeRaw
    // Note: We need to ensure pgvector is enabled in the database first.
    // Ensure the table exists or use prisma.note.create then update with raw sql.
    
    const note = await prisma.note.create({
      data: {
        content,
        title: title || 'Untitled Note',
      },
    });

    await prisma.$executeRawUnsafe(
      `UPDATE "Note" SET "embedding" = $1::vector WHERE "id" = $2`,
      vectorString,
      note.id
    );

    return NextResponse.json({ ...note, embedding: null });
  } catch (error: any) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  try {
    if (query) {
      const embedding = await generateEmbedding(query);
      const vectorString = `[${embedding.join(',')}]`;

      // Perform cosine similarity search (1 - distance)
      // distance <=> is cosine distance
      const results: any[] = await prisma.$queryRawUnsafe(
        `SELECT id, content, title, "createdAt", 
         1 - (embedding <=> $1::vector) as similarity
         FROM "Note"
         WHERE embedding IS NOT NULL
         ORDER BY similarity DESC
         LIMIT 20`,
        vectorString
      );

      return NextResponse.json(results);
    } else {
      const notes = await prisma.note.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return NextResponse.json(notes);
    }
  } catch (error: any) {
    console.error('Error in GET /api/notes:', error);
    return NextResponse.json(
      { error: 'Database query failed. Ensure pgvector extension is enabled and table is migrated.', details: error.message }, 
      { status: 500 }
    );
  }
}

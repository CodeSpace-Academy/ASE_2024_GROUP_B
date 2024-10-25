import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

/**
 * Server-side API route to fetch a single recipe by its ID.
 */
export async function GET(_req, { params }) {
  const { id } = params;

  try {
    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db('devdb');

    // Fetch the recipe document by its _id
    const recipe = await db.collection('recipes').findOne({ _id: id });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Return the recipe data
    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

/**
 * Handles GET requests to fetch and sort reviews from the MongoDB database.
 *
 * @param {Request} request - The incoming request object containing the URL and query parameters.
 * @returns {Promise<Response>} - A JSON response with the sorted reviews data or an error message.
 */
export async function GET(request) {
  try {
    // Connects to MongoDB
    const client = await clientPromise;
    const db = client.db('devdb');
    const collection = db.collection('recipes');

    // Parse and validate query parameters for sorting
    const url = new URL(request.url);
    let sortField = url.searchParams.get('sortField') || 'rating';
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Validate sortField to prevent unintended values
    if (!['rating', 'submission_date'].includes(sortField)) {
      sortField = 'rating';
    }

    // Fetch sorted reviews, ensuring only documents with the specified fields are returned
    const reviews = await collection.find({ [sortField]: { $exists: true } })
      .sort({ [sortField]: sortOrder, submission_date: -1 }) // Secondary sort by submission date if needed
      .toArray();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
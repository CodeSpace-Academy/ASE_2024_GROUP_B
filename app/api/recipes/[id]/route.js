import clientPromise from "../../../../lib/mongodb";

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return new Response(
      JSON.stringify({ error: "Invalid recipe ID format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    // Find the recipe by its string _id
    const updatedRecipe = await db.collection("recipes").updateOne(
      { _id: id }, // Use the string `id` directly
      {
        $set: { description: body.description },
        ...(await db.collection("recipes").findOne({ _id: id }))?.updatedBy
          ? { $set: { updatedBy: body.userId } }
          : { $setOnInsert: { updatedBy: body.userId } },
      }
    );

    if (!updatedRecipe.matchedCount) {
      return new Response(
        JSON.stringify({ error: "Recipe not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Recipe updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating recipe:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

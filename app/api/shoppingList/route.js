import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// Save a new shopping list
export async function POST(req) {
  try {
    const dbClient = await clientPromise;
    const db = dbClient.db("devdb");
    const shoppingLists = db.collection("shopping_lists");

    const { userId, items } = await req.json();

    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some((item) => !item.name)
    ) {
      return NextResponse.json(
        {
          message: "Invalid input data. Each item must have a 'name'.",
        },
        { status: 400 }
      );
    }

    const existingList = await shoppingLists.findOne({ userId });
    if (existingList) {
      return NextResponse.json(
        { message: "Shopping list for this user already exists." },
        { status: 409 }
      );
    }

    const newShoppingList = {
      userId,
      items: items.map((item) => ({
        name: item.name.trim().toLowerCase(),
        quantity: item.quantity || 1,
        purchased: item.purchased || false,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await shoppingLists.insertOne(newShoppingList);

    return NextResponse.json(
      { message: "Shopping list saved successfully", listId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving shopping list:", error);
    return NextResponse.json(
      {
        message: "Failed to save shopping list. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Retrieve a shopping list
export async function GET(req) {
  try {
    const dbClient = await clientPromise;
    const db = dbClient.db("devdb");
    const shoppingLists = db.collection("shopping_lists");

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required to fetch the shopping list." },
        { status: 400 }
      );
    }

    const shoppingList = await shoppingLists.findOne({ userId });

    if (!shoppingList) {
      return NextResponse.json(
        { message: "No shopping list found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Shopping list retrieved successfully", data: shoppingList },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch shopping list. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Update or add items to a shopping list, including marking items as purchased
export async function PUT(req) {
  try {
    const dbClient = await clientPromise;
    const db = dbClient.db("devdb");
    const shoppingLists = db.collection("shopping_lists");

    const { userId, items, append, markPurchased } = await req.json();

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Invalid input data. 'userId' and 'items' are required." },
        { status: 400 }
      );
    }

    const existingList = await shoppingLists.findOne({ userId });
    if (!existingList) {
      return NextResponse.json(
        { message: "Shopping list not found for this user." },
        { status: 404 }
      );
    }

    if (markPurchased) {
      // Mark items as purchased
      const updates = items.map((item) => ({
        name: item.name.trim().toLowerCase(),
        purchased: item.purchased,
      }));

      const bulkOps = updates.map((update) => ({
        updateOne: {
          filter: { userId, "items.name": update.name },
          update: { $set: { "items.$.purchased": update.purchased } },
        },
      }));

      const result = await shoppingLists.bulkWrite(bulkOps);

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { message: "No items were updated. Please check the item names." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Items marked as purchased successfully." },
        { status: 200 }
      );
    } else if (append) {
      // Append new items
      const newItems = items.map((item) => ({
        name: item.name.trim().toLowerCase(),
        quantity: item.quantity || 1,
        purchased: item.purchased || false,
      }));

      const updatedItems = [
        ...existingList.items,
        ...newItems.filter(
          (newItem) =>
            !existingList.items.some(
              (existingItem) => existingItem.name === newItem.name
            )
        ),
      ];

      const result = await shoppingLists.updateOne(
        { userId },
        {
          $set: {
            items: updatedItems,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Failed to add new items to shopping list." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "New items added to shopping list successfully." },
        { status: 200 }
      );
    } else {
      // Replace items in the shopping list
      const updatedItems = items.map((item) => ({
        name: item.name.trim().toLowerCase(),
        quantity: item.quantity || 1,
        purchased: item.purchased || false,
      }));

      const result = await shoppingLists.updateOne(
        { userId },
        {
          $set: {
            items: updatedItems,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Failed to update shopping list. No changes were made." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Shopping list updated successfully." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating shopping list:", error);
    return NextResponse.json(
      {
        message: "Failed to update shopping list. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Remove specific items from a shopping list
export async function DELETE(req) {
  try {
    const dbClient = await clientPromise;
    const db = dbClient.db("devdb");
    const shoppingLists = db.collection("shopping_lists");

    const { userId, items } = await req.json();

    if (!userId || !Array.isArray(items) || items.length === 0 || items.some((item) => !item.name)) {
      return NextResponse.json(
        { message: "Invalid input data. Each item must have a 'name'." },
        { status: 400 }
      );
    }

    const existingList = await shoppingLists.findOne({ userId });

    if (!existingList) {
      return NextResponse.json(
        { message: "Shopping list not found for this user." },
        { status: 404 }
      );
    }

    const itemNamesToRemove = items.map((item) => item.name.trim().toLowerCase());

    const result = await shoppingLists.updateOne(
      { userId },
      {
        $pull: {
          items: { name: { $in: itemNamesToRemove } },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No matching items were found to remove." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Specified items removed from shopping list successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing items from shopping list:", error);
    return NextResponse.json(
      {
        message: "Failed to remove items from shopping list. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

"use client";

import React, { useState, useEffect } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function RecipeDescriptionEdit({
  initialDescription,
  recipeId,
  onDescriptionUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("Received recipeId:", recipeId);
  }, [recipeId]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setDescription(initialDescription);
  };

  const getUserId = async () => {
    try {
      const response = await fetch("/api/get-user-id");

      if (!response.ok) {
        throw new Error("Failed to retrieve user ID");
      }

      const { userId } = await response.json();
      return userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    console.log("Submitting updated description:", description);

    try {
      const userId = await getUserId();

      if (!userId) throw new Error("User ID is required");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update recipe");

      console.log("Description updated successfully:", data);
      onDescriptionUpdate && onDescriptionUpdate(description);
      setIsEditing(false);
      toast.success("Description updated successfully!");
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Failed to update description.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter recipe description"
        />
        <div className="flex justify-end mt-2 space-x-2">
          <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <p className="flex-grow mr-4">{description}</p>
      <Button variant="outline" size="sm" onClick={handleEdit}>
        <Edit className="mr-2 h-4 w-4" /> Edit
      </Button>
    </div>
  );
}
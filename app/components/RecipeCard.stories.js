// RecipeCard.stories.js
import RecipeCard from "./RecipeCard";
import { fetchRecipes } from "../../lib/dummyData/fetchSampleData";

const data = fetchRecipes();
const recipe = { ...data[0] };

const meta = {
  title: "RecipeCard/RecipeCard",
  component: RecipeCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    _id: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    prep: { control: "number" },
    cook: { control: "number" },
    category: { control: "text" },
    servings: { control: "text" }, // Changed from 'text' to 'number'
    published: { control: "date" }, // Changed from 'text' to 'date'
    tags: { control: "array" },
    ingredients: { control: "object" },
    images: { control: "array" },
    instructions: { control: "array" },
    nutrition: { control: "object" },
  },
  args: recipe,
};

export default meta;

export const Primary = {
  args: {
    recipe,
  },
};
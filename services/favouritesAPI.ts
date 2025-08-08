const baseUrl = "https://recipe-app-0j5i.onrender.com/api";

export const getFavourites = async (userId: string | undefined) => {
  try {
    const response = await fetch(`${baseUrl}/favourites/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch favourites");
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.log("Error searching meals by name", error);
    return [];
  }
};

export const deleteFavourite = async (userId: string, recipeId: string) => {
  if (!userId || !recipeId) throw new Error("UserId or RecipeId missing");
  try {
    const response = await fetch(
      `${baseUrl}/favourites/${userId}/${recipeId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok)
      throw new Error(`Failed to delete favourite with recipeId ${recipeId}`);
  } catch (error) {
    console.log("Error deleting favourite", error);
  }
};

export const addToFavourites = async (recipe: any) => {
  if (!recipe.userId || !recipe.recipeId) throw new Error("UserId or RecipeId missing");
  try {
    const response = await fetch(`${baseUrl}/favourites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe)
    });
    if (!response.ok)
      throw new Error(
        `Failed to add favourite with recipeId ${recipe.recipeId} and userId: ${recipe.userId}`
      );
  } catch (error) {
    console.log("Error adding to favourite", error);
  }
};

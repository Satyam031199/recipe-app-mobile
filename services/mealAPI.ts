const baseUrl = "https://www.themealdb.com/api/json/v1/1";

export const getMealsByName = async (query: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/search.php?s=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data?.meals || [];
  } catch (error) {
    console.log("Error searching meals by name", error);
    return [];
  }
};

export const getMealById = async (id: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/lookup.php?i=${encodeURIComponent(id)}`
    );
    const data = await response.json();
    return data?.meals ? data?.meals[0] : null;
  } catch (error) {
    console.log("Error searching meals by id", error);
    return [];
  }
};

export const getRandomMeal = async () => {
  try {
    const response = await fetch(`${baseUrl}/random.php`);
    const data = await response.json();
    return data?.meals ? data?.meals[0] : null;
  } catch (error) {
    console.log("Error searching random meal", error);
    return null;
  }
};

export const getRandomMeals = async (count: number) => {
  try {
    const promises = Array.from({ length: count }, () => getRandomMeal());
    const meals = await Promise.all(promises);
    return meals.filter((meal) => meal !== null);
  } catch (error) {
    console.log("Error fetching random meals", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${baseUrl}/categories.php`);
    const data = await response.json();
    return data?.categories || [];
  } catch (error) {
    console.log("Error fetching categories", error);
    return [];
  }
};

export const filterByIngredient = async (ingredient: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    const data = await response.json();
    return data?.meals || [];
  } catch (error) {
    console.log("Error filtering by ingredints", error);
    return [];
  }
};

export const filterByCategory = async (category: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/filter.php?c=${encodeURIComponent(category)}`
    );
    const data = await response.json();
    return data?.meals || [];
  } catch (error) {
    console.log("Error filtering by ingredints", error);
    return [];
  }
};

export const transformMealData = (meal: any) => {
  if (!meal) return null;

  // extract ingredients from the meal object
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const measureText = measure && measure.trim() ? `${measure.trim()} ` : "";
      ingredients.push(`${measureText}${ingredient.trim()}`);
    }
  }

  // extract instructions
  const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step: any) => step.trim())
      : [];

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    description: meal.strInstructions
      ? meal.strInstructions.substring(0, 120) + "..."
      : "Delicious meal from TheMealDB",
    image: meal.strMealThumb,
    cookTime: "30 minutes",
    servings: 4,
    category: meal.strCategory || "Main Course",
    area: meal.strArea,
    ingredients,
    instructions,
    originalData: meal,
  };
};

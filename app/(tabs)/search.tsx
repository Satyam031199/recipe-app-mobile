import { useDebounce } from "@/services/hooks/useDebounce";
import {
  filterByIngredient,
  getMealsByName,
  getRandomMeals,
  transformMealData,
} from "@/services/mealAPI";
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { searchStyles } from '@/assets/styles/search.styles';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner, {} from '@/components/LoadingSpinner'

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery,300);
  const performSearch = async (query: string) => {
    // If no query present
    if (!query.trim()) {
      const randomMeals = await getRandomMeals(12);
      return randomMeals
        .map((meal) => transformMealData(meal))
        .filter((meal) => meal !== null);
    }
    // Search by name first and then by ingredient if no results
    const nameResults = await getMealsByName(query);
    let results = nameResults;
    if (results.length === 0) {
      const ingredientsResults = await filterByIngredient(query);
      results = ingredientsResults;
    }
    return results
      .slice(0, 12)
      .map((meal: any) => transformMealData(meal))
      .filter((meal: any) => meal !== null);
  };
  const loadData = async () => {
    try {
      const recipes = await performSearch("");
      setRecipes(recipes);
    } catch (error: any) {
      console.log("Error loading data: ",error?.message);
    } finally {
      setLoading(false);
    }
  }
  const handleSearch = async () => {
    setQueryLoading(true);
    try {
      const results = await performSearch(debouncedSearchQuery);
      setRecipes(results);
    } catch (error: any) {
      console.log("Error searching:", error?.message);
      setRecipes([]);
    } finally {
      setQueryLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  },[])
  useEffect(() => {
    if(loading) return;
    handleSearch();
  }, [debouncedSearchQuery, loading])
  if(loading) return <LoadingSpinner message="Loading recipes..."/>;
  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={searchStyles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
        </View>

        {queryLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.textLight} />
          <Text className="text-xl mt-2">Loading delicious recipes...</Text>
        </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item: any) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={searchStyles.emptyState}>
                <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
                <Text style={searchStyles.emptyTitle}>No recipes found</Text>
                <Text style={searchStyles.emptyDescription}>
                  Try adjusting your search or try different keywords
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

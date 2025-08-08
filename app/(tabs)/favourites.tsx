import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getFavourites } from "@/services/favouritesAPI";
import { useUser } from "@clerk/clerk-expo";
import LoadingSpinner from "@/components/LoadingSpinner";
import { favoritesStyles } from "@/assets/styles/favourites.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import RecipeCard from "@/components/RecipeCard";
import { useRouter } from "expo-router";

const FavouritesScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    data: favouriteRecipes,
    isLoading: favouriteRecipesLoading,
    error: favouriteRecipesError,
  } = useQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavourites(user?.id),
    enabled: !!user?.id,
  });
  if (favouriteRecipesLoading) {
    return <LoadingSpinner />;
  }
  const transformedFavoritesRecipes = favouriteRecipes.map((favorite: any) => ({
    ...favorite,
    id: favorite.recipeId,
  }));
  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={transformedFavoritesRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={favoritesStyles.emptyState}>
                <View style={favoritesStyles.emptyIconContainer}>
                  <Ionicons
                    name="heart-outline"
                    size={80}
                    color={COLORS.textLight}
                  />
                </View>
                <Text style={favoritesStyles.emptyTitle}>No favorites yet</Text>
                <TouchableOpacity
                  style={favoritesStyles.exploreButton}
                  onPress={() => router.push("/")}
                >
                  <Ionicons name="search" size={18} color={COLORS.white} />
                  <Text style={favoritesStyles.exploreButtonText}>
                    Explore Recipes
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FavouritesScreen;

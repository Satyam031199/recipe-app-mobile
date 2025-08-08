import React, { useState } from "react";
import {
  getCategories,
  getRandomMeals,
  getRandomMeal,
  transformMealData,
  filterByCategory,
} from "@/services/mealAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { homeStyles } from "@/assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import CategoryFilter from "@/components/CategoryFilter";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const {
    data: recipes,
    isLoading: recipesLoading,
    error: recipesError,
  } = useQuery({
    queryKey: ["meals", selectedCategory],
    queryFn: () =>
      selectedCategory === "All"
        ? getRandomMeals(12)
        : filterByCategory(selectedCategory),
  });
  const {
    data: featuredMeal,
    isLoading: featuredLoading,
    error: featuredError,
  } = useQuery({
    queryKey: ["featuredMeal"],
    queryFn: getRandomMeal,
  });
  const handleCategorySelect = (category: string) =>
    setSelectedCategory(category);
  if (categoriesLoading || recipesLoading || featuredLoading) {
    return (
        <LoadingSpinner message="Loading delicious recipes..."/>
    );
  }
  const transformedFeaturedMeal = featuredMeal
    ? transformMealData(featuredMeal)
    : null;
  const transformedMeals = recipes
    ?.map((meal: any) => transformMealData(meal))
    .filter((meal: any) => meal !== null);
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["meals", selectedCategory] }),
      queryClient.invalidateQueries({ queryKey: ["featuredMeal"] }),
    ]);
    setRefreshing(false);
  };
  if (categoriesError || recipesError || featuredError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading data. Please try again.</Text>
      </View>
    );
  }
  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* FEATURED SECTION */}
        {transformedFeaturedMeal && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${transformedFeaturedMeal.id}` as any)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: transformedFeaturedMeal.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {transformedFeaturedMeal.title}
                    </Text>

                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {transformedFeaturedMeal.cookTime}
                        </Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {transformedFeaturedMeal.servings}
                        </Text>
                      </View>
                      {transformedFeaturedMeal.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name="location-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {transformedFeaturedMeal.area}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/* CATEGORIES */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
        {/* RECIPES */}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>
              {selectedCategory.toUpperCase()} RECIPES
            </Text>
          </View>

          <FlatList
            data={transformedMeals}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={homeStyles.emptyState}>
                <Ionicons
                  name="restaurant-outline"
                  size={64}
                  color={COLORS.textLight}
                />
                <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                <Text style={homeStyles.emptyDescription}>
                  Try a different category
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

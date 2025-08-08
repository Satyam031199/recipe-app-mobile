import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMealById, transformMealData } from "@/services/mealAPI";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getYoutubeEmbedUrl } from "@/services/utils";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { addToFavourites, deleteFavourite } from "@/services/favouritesAPI";
import Toast from "react-native-toast-message";
import { recipeDetailStyles } from "@/assets/styles/recipe-details.styles";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const RecipeDetailScreen = () => {
  const router = useRouter();
  const { id: recipeId } = useLocalSearchParams<{ id: string }>();
  const { user, isLoaded: userLoaded } = useUser();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getMealById(recipeId),
  });
  if (recipeLoading || !userLoaded) {
    return <LoadingSpinner message="Loading recipe..." />;
  }

  if (!user) {
    return <LoadingSpinner message="Please sign in to view recipes..." />;
  }
  const transformedRecipe = {
    ...transformMealData(recipe),
    youtubeUrl: getYoutubeEmbedUrl(recipe?.strYoutube),
  };
  const handleToogleSave = async () => {
    setSaving(true);
    try {
      if (saved) {
        await deleteFavourite(user.id, recipeId);
        setSaved(false);
      } else {
        const reqBody = {
          userId: user.id,
          recipeId: parseInt(recipeId),
          title: transformedRecipe.title,
          image: transformedRecipe.image,
          cookTime: transformedRecipe.cookTime,
          servings: transformedRecipe.servings,
        };
        await addToFavourites(reqBody);
        setSaved(true);
      }
    } catch (error: any) {
      console.log("Error toogling recipe save: ", error?.message);
      Toast.show({
        type: "error",
        text1: "Something went wrong, Please try again",
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: transformedRecipe.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: saving ? "gray" : COLORS.primary },
              ]}
              onPress={handleToogleSave}
              disabled={saving}
            >
              <Ionicons
                name={
                  saving ? "hourglass" : saved ? "bookmark" : "bookmark-outline"
                }
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {transformedRecipe.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>
              {transformedRecipe.title}
            </Text>
            {transformedRecipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {transformedRecipe.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={recipeDetailStyles.contentSection}>
          {/* QUICK STATS */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {transformedRecipe.cookTime}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {transformedRecipe.servings}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>
          {/* YOUTUBE VIDEO */}
          {transformedRecipe.youtubeUrl && (
            <View style={recipeDetailStyles.sectionContainer}>
              <View style={recipeDetailStyles.sectionTitleRow}>
                <LinearGradient
                  colors={["#FF0000", "#CC0000"]}
                  style={recipeDetailStyles.sectionIcon}
                >
                  <Ionicons name="play" size={16} color={COLORS.white} />
                </LinearGradient>

                <Text style={recipeDetailStyles.sectionTitle}>
                  Video Tutorial
                </Text>
              </View>

              <View style={recipeDetailStyles.videoCard}>
                <WebView
                  style={recipeDetailStyles.webview}
                  source={{
                    uri: transformedRecipe.youtubeUrl,
                  }}
                  allowsFullscreenVideo
                  mediaPlaybackRequiresUserAction={false}
                />
              </View>
            </View>
          )}
          {/* INGREDIENTS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {transformedRecipe?.ingredients?.length}
                </Text>
              </View>
            </View>
            {/* INGREDIENTS SECTION */}
            <View style={recipeDetailStyles.ingredientsGrid}>
              {transformedRecipe?.ingredients?.map(
                (ingredient: any, index: number) => (
                  <View key={index} style={recipeDetailStyles.ingredientCard}>
                    <View style={recipeDetailStyles.ingredientNumber}>
                      <Text style={recipeDetailStyles.ingredientNumberText}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={recipeDetailStyles.ingredientText}>
                      {ingredient}
                    </Text>
                    <View style={recipeDetailStyles.ingredientCheck}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color={COLORS.textLight}
                      />
                    </View>
                  </View>
                )
              )}
            </View>
          </View>
          {/* INSTRUCTIONS */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {transformedRecipe?.instructions?.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {transformedRecipe?.instructions?.map(
                (instruction: any, index: number) => (
                  <View key={index} style={recipeDetailStyles.instructionCard}>
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primary + "CC"]}
                      style={recipeDetailStyles.stepIndicator}
                    >
                      <Text style={recipeDetailStyles.stepNumber}>
                        {index + 1}
                      </Text>
                    </LinearGradient>
                    <View style={recipeDetailStyles.instructionContent}>
                      <Text style={recipeDetailStyles.instructionText}>
                        {instruction}
                      </Text>
                      <View style={recipeDetailStyles.instructionFooter}>
                        <Text style={recipeDetailStyles.stepLabel}>
                          Step {index + 1}
                        </Text>
                        <TouchableOpacity
                          style={recipeDetailStyles.completeButton}
                        >
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              )}
            </View>
          </View>
          {/* BUTTON */}
          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToogleSave}
            disabled={saving}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons name="heart" size={20} color={COLORS.white} />
              <Text style={recipeDetailStyles.buttonText}>
                {saved ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;

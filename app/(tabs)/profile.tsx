import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useClerk, useUser } from "@clerk/clerk-expo";
import LoadingSpinner from "@/components/LoadingSpinner";
import { profileStyles } from "@/assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { dummyUser } from "@/constants/dummyUser";
import { formatDate, getProviderIcon, getProviderName } from "@/services/utils";
import { useQuery } from "@tanstack/react-query";
import { getFavourites } from "@/services/favouritesAPI";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const { signOut } = useClerk();
  const { user, isLoaded: userLoading } = useUser();
  const {
    data: favouriteRecipes,
    isLoading: favouriteRecipesLoading,
    error: favouriteRecipesError,
  } = useQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavourites(user?.id),
    enabled: !!user?.id,
  });
  const currentUser = dummyUser;
  if (favouriteRecipesLoading) {
    return <LoadingSpinner />;
  }
  return (
    <View style={profileStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={profileStyles.header}>
          <Text style={profileStyles.title}>Profile</Text>
          <TouchableOpacity
            style={profileStyles.logoutButton}
            onPress={() => signOut()}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={profileStyles.profileSection}>
          <View style={profileStyles.profileCard}>
            {/* Avatar and Basic Info */}
            <View style={profileStyles.avatarContainer}>
              <Image
                source={{ uri: currentUser.imageUrl }}
                style={profileStyles.avatar}
              />
              <Text style={profileStyles.fullName}>{currentUser.fullName}</Text>
              <Text style={profileStyles.email}>
                {currentUser.emailAddresses[0].emailAddress}
              </Text>

              {/* Verification Badge */}
              {currentUser.emailAddresses[0].verification.status ===
                "verified" && (
                <View style={profileStyles.verificationBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={profileStyles.verificationText}>Verified</Text>
                </View>
              )}
            </View>

            {/* User Information */}
            <View style={profileStyles.infoSection}>
              <View style={profileStyles.infoRow}>
                <Text style={profileStyles.infoLabel}>Username</Text>
                <Text style={profileStyles.infoValue}>
                  {currentUser.username || "Not set"}
                </Text>
              </View>

              <View style={profileStyles.infoRow}>
                <Text style={profileStyles.infoLabel}>First Name</Text>
                <Text style={profileStyles.infoValue}>
                  {currentUser.firstName}
                </Text>
              </View>

              <View style={profileStyles.infoRow}>
                <Text style={profileStyles.infoLabel}>Last Name</Text>
                <Text style={profileStyles.infoValue}>
                  {currentUser.lastName}
                </Text>
              </View>

              <View style={profileStyles.infoRow}>
                <Text style={profileStyles.infoLabel}>Gender</Text>
                <Text style={profileStyles.infoValue}>
                  {currentUser.gender || "Not specified"}
                </Text>
              </View>

              <View style={profileStyles.infoRow}>
                <Text style={profileStyles.infoLabel}>Birthday</Text>
                <Text style={profileStyles.infoValue}>
                  {currentUser.birthday
                    ? formatDate(currentUser.birthday)
                    : "Not set"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={profileStyles.statsContainer}>
          <View style={profileStyles.statCard}>
            <View
              style={[
                profileStyles.statIcon,
                { backgroundColor: COLORS.background },
              ]}
            >
              <Ionicons name="heart" size={20} color={COLORS.primary} />
            </View>
            <Text style={profileStyles.statValue}>
              {favouriteRecipes ? favouriteRecipes.length : 0}
            </Text>
            <Text style={profileStyles.statLabel}>Favorites</Text>
          </View>

          <View style={profileStyles.statCard}>
            <View
              style={[
                profileStyles.statIcon,
                { backgroundColor: COLORS.background },
              ]}
            >
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
            </View>
            <Text style={profileStyles.statValue}>
              {Math.floor(
                (Date.now() - currentUser.createdAt) / (1000 * 60 * 60 * 24)
              )}
            </Text>
            <Text style={profileStyles.statLabel}>Days Active</Text>
          </View>

          <View style={profileStyles.statCard}>
            <View
              style={[
                profileStyles.statIcon,
                { backgroundColor: COLORS.background },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={profileStyles.statValue}>
              {currentUser.twoFactorEnabled ? "Yes" : "No"}
            </Text>
            <Text style={profileStyles.statLabel}>2FA Enabled</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={profileStyles.accountSection}>
          <View style={profileStyles.accountCard}>
            <Text style={profileStyles.accountTitle}>Account Details</Text>

            {/* Plan Badge */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: COLORS.textLight,
                  width: 40,
                  marginBottom: 0,
                }}
              >
                Plan
              </Text>
              <View style={profileStyles.planBadge}>
                <Text style={profileStyles.planText}>
                  {currentUser.publicMetadata.plan}
                </Text>
              </View>
            </View>

            {/* Connected Accounts */}
            {currentUser.externalAccounts.map((account, index) => (
              <View key={account.id} style={profileStyles.accountItem}>
                <View style={profileStyles.accountIcon}>
                  <Ionicons
                    name={getProviderIcon(account.provider)}
                    size={16}
                    color={COLORS.primary}
                  />
                </View>
                <View style={profileStyles.accountInfo}>
                  <Text style={profileStyles.accountProvider}>
                    {getProviderName(account.provider)}
                  </Text>
                  <Text style={profileStyles.accountEmail}>
                    {account.emailAddress}
                  </Text>
                </View>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
            ))}

            {/* Email Addresses */}
            {currentUser.emailAddresses.map((email, index) => (
              <View key={email.id} style={profileStyles.accountItem}>
                <View style={profileStyles.accountIcon}>
                  <Ionicons name="mail" size={16} color={COLORS.primary} />
                </View>
                <View style={profileStyles.accountInfo}>
                  <Text style={profileStyles.accountProvider}>Email</Text>
                  <Text style={profileStyles.accountEmail}>
                    {email.emailAddress}
                  </Text>
                </View>
                {email.verification.status === "verified" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.primary}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

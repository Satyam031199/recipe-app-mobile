import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { ImageSourcePropType, Text, View, Image } from "react-native";
import cn from "clsx";
import { COLORS } from "@/constants/colors";

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="flex min-w-20 items-center justify-center min-h-full gap-1 mt-12">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? COLORS.primary : "#5D5F6D"}
    />
    <Text
      className={cn(
        "text-sm font-bold",
        focused ? `text-[${COLORS.textLight}]` : "text-gray-300"
      )}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in" as any} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          // borderTopLeftRadius: 50,
          // borderTopRightRadius: 50,
          // borderBottomLeftRadius: 50,
          // borderBottomRightRadius: 50,
          //marginHorizontal: 20,
          // height: 80,
          // position: 'absolute',
          // bottom: 30,
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Home"
              icon={require("@/assets/images/home.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Search"
              icon={require("@/assets/images/search.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Favourites"
              icon={require("@/assets/images/bookmark.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Profile"
              icon={require("@/assets/images/profile.png")}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

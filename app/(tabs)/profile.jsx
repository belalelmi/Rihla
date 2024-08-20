import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";

import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";

import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() =>
    getUserPosts(user.documents[0].$id)
  );

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("./sign-in");
  };

  // console.log(user.documents[0].$id);
  // console.log(user?.documents[0].username);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View
              className="w-16 h-16 border border-secondary rounded-lg
             justify-center items-center"
            >
              <Image
                source={{ uri: user?.documents[0].avatar }}
                className="w-[90%] h-[90%] rounded-lg "
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.documents[0].username}
              containerStyles="mt-5"
              titleStyles="text-xl"
            />
            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.3k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;

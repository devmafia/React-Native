import { View, Text, Image, SafeAreaView, TouchableOpacity,Dimensions, ScrollView } from "react-native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import MovieList from "./components/MovieList";
import { fetchPersonDetails, fetchPersonMovies, image342 } from "./api/moviedb";

const { width, height } = Dimensions.get("window");

type MyParams = {
    item: string;
}

function Person() {
    const [isFavourite, toggleFavourite] = useState(false);
    const router = useRouter();

    const { item } = useLocalSearchParams<MyParams>();
    const person = item ? JSON.parse(item) : null;
    const [personMovies, setPersonMovies] = useState([]);
    const [pers, setPers] = useState<any>();
    useEffect(() => {
        getPersonDetails(person.id);
        getPersonMovies(person.id);
    }, [item]);
    const getPersonDetails = async (id:number) => {
        const data = await fetchPersonDetails(id);
        if (data) setPers(data);
    }

    const getPersonMovies = async (id:number) => {
        const data = await fetchPersonMovies(id);
        if (data && data.cast) setPersonMovies(data.cast);
    }

    return (
        <View className="flex-1 bg-black">
        <SafeAreaView className="bg-black">
          <View className="flex-row justify-between items-center px-4 pt-4">
            <TouchableOpacity onPress={() => router.back()} className="rounded-xl p-1 bg-neutral-800">
              <ChevronLeftIcon size={20} strokeWidth={2.5} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)} className="rounded-xl p-1 bg-neutral-800">
              <HeartIcon color={isFavourite ? "white" : "yellow"} size={35} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      
        <View style={{ height: height * 0.9, backgroundColor: 'black' }}>
          <ScrollView
            className="bg-black"
            contentContainerStyle={{ paddingBottom: 50 }}
            bounces={false}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="never"
          >
            <View className="flex-row justify-center mt-4">
              <View className="items-center rounded-full overflow-hidden border border-neutral-500">
                <Image
                  style={{ height: height * 0.43, width: width * 0.74 }}
                  source={{ uri: image342(pers?.profile_path) }}
                />
              </View>
            </View>
      
            <View className="mt-6 px-4">
              <Text className="text-white text-lg text-center">{pers?.name}</Text>
              <Text className="text-neutral-300 text-base text-center">{pers?.place_of_birth}</Text>
            </View>
      
            <View className="mx-3 p-4 mt-6 flex-row justify-between items-center rounded-full bg-neutral-700">
              <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                <Text className="text-white font-semibold">Gender</Text>
                <Text className="text-neutral-300 text-sm font-semibold">
                  {pers?.gender === 1 ? "Female" : "Male"}
                </Text>
              </View>
              <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                <Text className="text-white font-semibold">Birthday</Text>
                <Text className="text-neutral-300 text-sm font-semibold">{pers?.birthday}</Text>
              </View>
              <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                <Text className="text-white font-semibold">Known for</Text>
                <Text className="text-neutral-300 text-sm font-semibold">{pers?.known_for_department}</Text>
              </View>
              <View className="px-2 items-center">
                <Text className="text-white font-semibold">Popularity</Text>
                <Text className="text-neutral-300 text-sm font-semibold">{pers?.popularity?.toFixed(2)}</Text>
              </View>
            </View>
      
            <View className="my-6 mx-4 space-y-2">
              <Text className="text-white text-lg">Biography</Text>
              <Text className="text-neutral-300 text-base">{pers?.biography || "N/A"}</Text>
            </View>
      
            <MovieList hideSeeAll data={personMovies} title="Person's Movies" />
          </ScrollView>
        </View>
      </View>


    )
}

export default Person;

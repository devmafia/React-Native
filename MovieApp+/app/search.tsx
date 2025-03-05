import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput, Dimensions, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get("window");
import { XMarkIcon } from 'react-native-heroicons/solid';
import Loading from './loading';
import { image185, searchMovies } from './api/moviedb';

function Search() {
    const [results, setResults ] = useState([]);
    const movieName = "Movie name";
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSearch = async (value:string) => {
        setLoading(true);
        if (value && value.length>2) {
            const data = await searchMovies({query: value, include_adult: "false", page: "1", language: "en-US"});
            if (data && data.results) setResults(data.results);
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-600">
        <View className="mt-4 flex-row items-center bg-neutral-800 rounded-xl border border-neutral-500 px-4 py-3 shadow-lg">
          <TextInput
            onChangeText={handleSearch}
            placeholder="Search for a movie..."
            placeholderTextColor="gray"
            className="flex-1 text-white text-lg font-medium"
          />
          <TouchableOpacity onPress={() => router.push("/")} className="p-2 rounded-full bg-neutral-600">
            <XMarkIcon size={28} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Loading />
        ) : results.length === 0 ? (
          <ScrollView />
        ) : (
          <ScrollView className="py-5 space-y-3" showsVerticalScrollIndicator={false}>
            <Text className="ml-1 text-white font-semibold">Results ({results.length})</Text>

            <View className="flex-row flex-wrap justify-between">
              {results.map((item: any, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() =>
                    router.push(`/movie?item=${encodeURIComponent(JSON.stringify(item))}`)
                  }
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      style={{ width: width * 0.44, height: height * 0.3 }}
                      className="rounded-3xl"
                      source={{ uri: image185(item.poster_path) }}
                    />
                    <Text className="ml-1 text-neutral-400">{
                    (item.title.length>30)? item.title.slice(0,27) + "..." :  item.title
                    }</Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>


    )
}

export default Search;

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import TrendingMovies from "./components/trendingMovies";
import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import { useRouter } from 'expo-router';
import Loading from "./loading";
import { fetchTrendingMovies, fetchUpcomingMovies, fetchTopRatedMovies } from "./api/moviedb";

export default function Index() {
  const [ trending, setTrending ] = useState([]);
  const [ upcoming, setUpcoming ] = useState([]);
  const [ topRated, setTopRated ] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async() => {
    const data = await fetchTrendingMovies();
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  }
  const getUpcomingMovies = async() => {
    const data = await fetchUpcomingMovies();
    if (data && data.results) setUpcoming(data.results);
    setLoading(false);
  }
  const getTopRatedMovies = async() => {
    const data = await fetchTopRatedMovies();
    if (data && data.results) setTopRated(data.results);
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView edges={[]} className="mb-2">
        <StatusBar />
        
        <View className="mx-4 flex-row justify-between items-center">
          <Bars3CenterLeftIcon size={37.5} strokeWidth={2} color="white" />
          <Text className="text-white text-3xl font-bold">Movies</Text>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <MagnifyingGlassIcon size={37.5} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <TrendingMovies data={trending} />
          <MovieList hideSeeAll data={upcoming} title="Upcoming Movies" />
          <MovieList hideSeeAll data={topRated} title="Top Rated Movies" />
        </ScrollView>
      )}
    </View>

  );
}

import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import Cast from './components/Cast';
import MovieList from './components/MovieList';
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from './api/moviedb';

const { width, height } = Dimensions.get("window");

type MySearchParams = {
  item?: string; 
};

interface MovieDetails {
  id: number;
  poster_path: string;
  title: string;
  release_date: string;
  status: string;
  runtime: string;
  genres: [Genre];
  overview: string
}

type Genre = {
  name: string;
}

interface CastProps {
  cast: any[];
}

function Movie() {
  const router = useRouter();
  const [isFavourite, toggleFavourite] = useState(false);  
  const { item } = useLocalSearchParams<MySearchParams>();
  const movie = item ? JSON.parse(item) : null;
  const [m, setMovie] = useState<MovieDetails>();

  const [cast, setCast] = useState<CastProps>();
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    getMovieDetails(movie?.id);
    getMovieCredits(movie?.id);
    getSimilarMovies(movie?.id);

  }, [item]);

  const getMovieDetails = async (id:number)=> {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
  }

  const getMovieCredits = async (id:number) => {
    const data = await fetchMovieCredits(id);
    if (data) setCast(data);
  }

  const getSimilarMovies = async (id:number) => {
    const data = await fetchSimilarMovies(id);
    if (data) setSimilarMovies(data.results);
  }

  return (
    <View style={{ height: height * 0.95}}>
      <ScrollView className="bg-neutral-900"
    contentContainerStyle={{
      flexGrow: 1,
      minHeight: height,
      paddingBottom: 50
    }}
  >
    <View className="relative w-full">
      <SafeAreaView className="absolute z-20 w-full flex-row justify-between items-center px-4 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-neutral-800 rounded-full"
        >
          <ChevronLeftIcon size={24} strokeWidth={2.5} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleFavourite(!isFavourite)}
          className="p-2 bg-neutral-800 rounded-full"
        >
          <HeartIcon color={isFavourite ? "red" : "white"} size={30} />
        </TouchableOpacity>
      </SafeAreaView>

      {m && (
        <Image
          style={{ width: "100%", height: height * 0.55 }}
          className="rounded-b-3xl"
          source={{ uri: image500(m.poster_path) }}
        />
      )}

      <LinearGradient
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        colors={["transparent", "rgba(23,23,23,0.9)"]}
        className="absolute bottom-0 w-full h-40 rounded-b-3xl"
      />
    </View>

    <View className="px-6 mt-6">
      <Text className="text-white text-3xl font-extrabold text-center">{m?.title}</Text>

      <Text className="text-neutral-400 font-semibold text-base text-center mt-1">
        {m?.status} • {m?.release_date?.split("-")[0]} • {m?.runtime} min
      </Text>

      <View className="flex-row justify-center mt-2">
        {m?.genres?.map((genre, index) => (
          <Text key={index} className="text-neutral-400 font-medium text-base mx-1">
            {genre?.name}
            {index !== m.genres.length - 1 ? " •" : ""}
          </Text>
        ))}
      </View>

      <View className="mt-4 p-4 bg-neutral-800 rounded-xl">
        <Text className="text-white text-lg font-semibold">Overview</Text>
        <Text className="text-neutral-300 text-base mt-2">{m?.overview || "No description available."}</Text>
      </View>
    </View>

    <View className="mt-6 px-6">
      <Cast cast={cast?.cast ?? []} />
    </View>

    <View className="mt-6 px-6">
      <MovieList hideSeeAll data={similarMovies} title="Similar Movies" />
    </View>
  </ScrollView>
    </View>
  
  );
}

export default Movie;

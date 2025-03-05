import { View, Text, Dimensions } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import MovieCard from "./MovieCard";
import { useRouter } from 'expo-router';

const { width } = Dimensions.get("window");

export default function TrendingMovies({data}:any) {
    const router = useRouter();
    const handleClick = (item: any) => {
        router.push(`./movie?item=${encodeURIComponent(JSON.stringify(item))}`);
    };

    return (
        <View className="flex items-center mb-8">
            <Text className="text-white text-xl mx-4 mb-5"> 
                Trending Movies
            </Text>
            <Carousel
                loop
                width={width}
                height={500} 
                autoPlay={true}
                autoPlayInterval={5000}
                data={data}
                scrollAnimationDuration={1000} 
                renderItem={({ item }) => <MovieCard item={item} handleClick={() => handleClick(item)} />}
                style={{
                    width: width,
                    alignItems: "center",
                }} />
        </View>
    )
}

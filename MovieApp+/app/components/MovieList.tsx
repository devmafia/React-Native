import { Dimensions ,View, Text, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchMovieCredits, image185 } from '../api/moviedb';

const { width } = Dimensions.get("window");

export default function MovieList({title, data, hideSeeAll}: { title: string, data:any[], hideSeeAll?: boolean }) {
   
    const router = useRouter();
    return (
        <View className="mb-8 space-y-4">
            <View className="mx-4 flex-row justify-between items-center text-white text-xl">
                <Text className="text-white text-xl">{title}</Text>
                {
                    !hideSeeAll && <TouchableOpacity>
                        <Text className="text-blue-500 text-lg">See All</Text>
                    </TouchableOpacity>
                }
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4"
            >
                {
                    data.map((item, index) => {
                        return    ( 
                        <TouchableWithoutFeedback key={index} onPress={() => 
                        {
                            router.push(`/movie?item=${encodeURIComponent(JSON.stringify(item))}`)
                        }}>
                            <View className="space-y-1 mr-4">
                                <Image source={{uri: image185(item.poster_path)}}
                                style={{
                                    width: width / 3.5,
                                    height: 150,
                                }} className="rounded-3xl" />
                                <Text className="text-neutral-300 ml-1">
                                    {
                                        (item.title.length>12)? item.title.slice(0,12) + "..." :  item.title
                                    }
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )})
                }
            </ScrollView>
        </View>
    )
}

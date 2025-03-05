import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { image185 } from "../api/moviedb";

interface CastProps {
    cast: any[];
}

function Cast({cast}:CastProps) {
    const router = useRouter();
    
    return (
        <View className="my-6">
            <Text className="text-white text-lg mx-4 mb-5">
                Top Cast
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 15}}
            >
            {
                !cast ? null : (
                cast && cast.map((person: any, index: number) => {
                    return (
                        <TouchableOpacity
                            className="mr-4 items-center"
                            onPress={() =>
                                router.push(`/person?item=${encodeURIComponent(JSON.stringify(person))}`)
                            }
                            key={index}>
                            <View className="overflow-hidden rounded-full h-20 w-20 items-center border border-neutral-500">
                                <Image
                                    className="rounded-2xl h-24 w-20"
                                    source={{uri: image185(person.profile_path)}}
                                >
                                </Image>
                            </View>
                            <Text className="text-white text-lg mx-2">
                                {
                                    person.character
                                }
                            </Text>
                            <Text className="text-white text-lg mx-2">
                                {
                                    person.original_name
                                }
                            </Text>
                        </TouchableOpacity>
                    )
                })
            )}
            </ScrollView>
        </View>
    );
}

export default Cast;

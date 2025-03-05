import {Image, Text, View, TouchableWithoutFeedback } from "react-native";
import { image500 } from "../api/moviedb";

export default function MovieCard({ item, handleClick }: { item: any; handleClick: () => void }) {

    return (
        <TouchableWithoutFeedback onPress={() => handleClick()}>
            <View className="items-center">
            <Image source={{uri: image500(item.poster_path)}}
                style={{ 
                    width: 300,
                    height: 500,
                }} className="rounded-3xl" />
            <Text className="text-white text-xl">
                Movie
            </Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

import { ScrollView } from "react-native-gesture-handler";
import { Dimensions, View } from "react-native";
import * as Progress from "react-native-progress";

const {width, height} = Dimensions.get("window");

function Loading() {


    return (
        <View style={{height, width}} className="absolute flex-row justify-center items-center">
            <Progress.CircleSnail thickness={12} size={160}></Progress.CircleSnail>
        </View>
    )
}

export default Loading;

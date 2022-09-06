import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import { ReadUserData } from "../../api/ApiFirebase";

const UserImage = ({ size = 80, optional_image = '', otherUser = false }) => {
    const defaultImage = "https://i.pinimg.com/280x280_RS/2e/45/66/2e4566fd829bcf9eb11ccdb5f252b02f.jpg"
    const [image, setImage] = useState(defaultImage)

    useEffect(() => {
        if (optional_image.length == 0) {
            if (!otherUser) {
                getImage()
            }
        }
        else {
            setImage(optional_image)
        }

    }, [image, optional_image])

    const getImage = () => {
        AsyncStorage.getItem('userFirebase')
            .then(v => JSON.parse(v))
            .then(user => {
                ReadUserData(user.uid).then(userData => {
                    if (userData.hasOwnProperty("image_url")) {
                        setImage(userData.image_url)
                    }
                })
            })

    }


    return (<Avatar.Image
        source={{
            uri: image,
        }}
        size={size}
        style={{ backgroundColor: 'white' }}

    />);
}

export default UserImage;
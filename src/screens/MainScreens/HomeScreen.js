
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, FlatList, Center, NativeBaseProvider, Text, extendTheme } from "native-base";
import { StyleSheet, View, Image, Button } from "react-native";
import { commentPost, getAllPosts, likePost, ReadUserData } from "../../api/ApiFirebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInput from './../../components/TextInput';
import Comment from "../../components/Comment";



const HomeScreen = () => {
    const theme = extendTheme({ width: '100%' });

    const [data, setData] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    useEffect(() => {
        fetchData()
    }, []);

<<<<<<< HEAD
    useEffect(() => {
        (async () => {
            const v = await AsyncStorage.getItem('userFirebase')
            setUserId(JSON.parse(v).uid)
        })()
    }, [])

    const fetchData = async () => {
        const data = await getAllPosts()
        setComments(
            // make an object with the post id as key and an empty string as value
            Object.fromEntries(data.map(post => [post.id, undefined]))
        )
=======
    // trea posteo
    const fetchData = async () => {
        const data = await getAllPosts()
>>>>>>> 99e3b6ce49651b0a711e71164c5fe3a13b22f186
        setData(data);
        setLoading(false);
    };

    const renderItem = ({ item }) => {
<<<<<<< HEAD
=======

        
//sube
>>>>>>> 99e3b6ce49651b0a711e71164c5fe3a13b22f186
        return (
            <View >
                <View>
                    <Image src={{ uri: item.user.image_url }} style={{ width: 50, height: 50 }} />
                    <Text>{item.user.username}</Text>
                </View>
                <Text>{item.post.title}</Text>
                <Text>{item.post.description}</Text>
                <Button title="Like Post" onPress={() => likePost(userId, item.id)} />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '80%' }}>
                        <TextInput
                            label="Comment"
                            returnKeyType="next"
                            value={comments[item.id] || ''}
                            onChangeText={(text) => setComments(
                                // update the comment for the post
                                { ...comments, [item.id]: text }
                            )}
                            error={false}
                            errorText={''}
                            autoCapitalize="true"
                        />
                    </View>
                    <Button title="Comment" onPress={() => commentPost(userId, item.id, comments[item.id])} style={{ height: '100%' }} />
                </View>
                {
                    item.post.comments.map((comment, i) => {
                        return (
                            <Comment comment={comment} key={i} />
                        )
                    })
                }
            </View>
        );
    };

    return (

        <NativeBaseProvider theme={theme}>
            <View style={styles.container}>
                {loading && <Box>Loading..</Box>}
                {data && (
                    <FlatList
                        style={styles.list}

                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </View>
        </NativeBaseProvider >

    );
}
const styles = StyleSheet.create({
    list: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    item: {
        backgroundColor: "cyan",
        margin: 0,
        width: '70%',
        color: 'red',
        padding: 10,
        marginVertical: 8,
        fontSize: 18,
        height: 44,
        alignSelf: 'center',
    },

});

export default HomeScreen;
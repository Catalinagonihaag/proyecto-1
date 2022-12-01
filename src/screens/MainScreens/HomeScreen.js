import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
    Box,
    FlatList,
    Center,
    NativeBaseProvider,
    Text,
    extendTheme,
    Divider,
} from 'native-base'
import { StyleSheet, View, Image, Button, TouchableOpacity } from 'react-native'
import {
    commentPost,
    getAllPosts,
    likePost,
    app,
    ReadUserData,
    getImageFromStorage
} from '../../api/ApiFirebase'
import Icon from '@expo/vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TextInput from './../../components/TextInput'
import Comment from '../../components/Comment'
import { collection, onSnapshot, getFirestore } from 'firebase/firestore'

const HomeScreen = () => {
    const theme = extendTheme({ width: '100%' })

    const [data, setData] = useState([])
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState([])

    useEffect(() => {
        
        const db = getFirestore(app)



        const unsuscribe = onSnapshot(collection(db, `posts`), async (snapshot) => {


            const v = await AsyncStorage.getItem('userFirebase')
            setUserId(JSON.parse(v).uid)
            
            const user = await ReadUserData(JSON.parse(v).uid)
           
            console.log(user)
            
            const data = snapshot.docs

            setComments(
                // make an object with the post id as key and an empty string as value
                Object.fromEntries(data.map((post) => [post.id, undefined]))
            )

            const posts = [];

            for (const doc of data){
                const post = doc.data();
                post.id = doc.id;
                post.post.comments = post.post.comments ?? []
                post.post.likes = post.post.likes ?? []
                if (user.following.includes(post.user.userId) || post.user.userId === JSON.parse(v).uid)
                {
                if (post.post.img){
                    console.log('====================================');
                    console.log(post);
                    console.log('====================================');
                    post.imageUrl = await getImageFromStorage(post.post.img.id)
                }
                
                posts.push(post);

                }
            }

            console.log('====================================');
            console.log(posts);
            console.log('====================================');
            setData(posts);
            setLoading(false);
        })
        return () => unsuscribe();
    }, [])

    const renderItem = ({ item }) => {
        console.log('====================================');
        console.log(item);
        console.log('====================================');
        return (
            <View style={styles.card}>
                <View>
                    <Text
                        style={{ fontWeight: 'bold', fontSize: 20, alignSelf: 'flex-start' }}
                    >
                        {item.user.username}
                    </Text>
                </View>
                <Text style={{ alignSelf: 'flex-start', fontSize: 18 }}>
                    {item.post.title}
                </Text>
                {item.imageUrl && (
                <View style={{width: '100%', height: 200}}>
                <Image style={{flex:1, resizeMode: 'contain'}} source={{uri:item.imageUrl}} /></View>)}
                <Text style={{ alignSelf: 'flex-start', fontSize: 16, marginTop: 10 }}>
                    {item.post.description}
                </Text>
                <View style={{ marginTop: 20 }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => likePost(userId, item.id, item.post.likes)}
                        style={{
                            borderRadius: 5,
                            padding: 5,
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Icon name={item.post.likes.includes(userId) ? "heart" : "heart-outlined"} color="#f00" size={30} />
                    </TouchableOpacity>
                    <Text>{item.post.likes.length == 1 ? item.post.likes.length + " Like" : item.post.likes.length + " Likes"}</Text></View>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View>
                            <TextInput
                                label="Comment"
                                returnKeyType="next"
                                value={comments[item.id] || ''}
                                onChangeText={(text) =>
                                    setComments(
                                        // update the comment for the post
                                        { ...comments, [item.id]: text }
                                    )
                                }
                                error={false}
                                errorText={''}
                                autoCapitalize="true"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                commentPost(userId, item.id, comments[item.id])
                                setComments(
                                    // update the comment for the post
                                    { ...comments, [item.id]: undefined }
                                )
                            }}
                            style={{ backgroundColor: 'blue', marginTop: 4, paddingTop: 5, paddingHorizontal: 10, marginLeft: -10, height: 35, borderRadius: 6 }}
                        >
                            <Text style={{ color: 'white' }}>Comentar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                {item.post.comments.map((comment, i) => {
                    return <Comment comment={comment} key={i} />
                })}
            </View>
        )
    }
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
        </NativeBaseProvider>
    )
}
const styles = StyleSheet.create({
    list: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    item: {
        backgroundColor: 'cyan',
        margin: 0,
        width: '70%',
        color: 'red',
        padding: 10,
        marginVertical: 8,
        fontSize: 18,
        height: 44,
        alignSelf: 'center',
    },
    card: {
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 15,
        padding: 10,
        marginHorizontal: 35,
    },
})
export default HomeScreen

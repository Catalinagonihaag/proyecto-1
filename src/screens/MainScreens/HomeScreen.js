
import React, { useState, useEffect } from "react";
import { Box, FlatList, Center, NativeBaseProvider, Text, extendTheme } from "native-base";
import { StyleSheet, View } from "react-native";
import { maxWidth } from "styled-system";
const theme = extendTheme({ width: '100%' });
const HomeScreen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const resp = await fetch("https://api.sampleapis.com/coffee/hot");
        const data = await resp.json();
        setData(data);
        setLoading(false);
    };
    const renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Text>{item.title}</Text>
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
                        keyExtractor={(item) => item.id.toString()}
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
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
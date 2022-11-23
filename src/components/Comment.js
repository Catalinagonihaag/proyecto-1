import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ReadUserData } from '../api/ApiFirebase'

const Comment = ({ comment }) => {
    const [user, setUser] = useState({})
    useEffect(() => {
        (async () => {
            const u = await ReadUserData(comment.userId)
            setUser(u)
        })()
    }, [])
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#333' }}>{user.username}:</Text>
            <Text style={{ marginLeft: 5 }}>{comment.message}</Text>
        </View>
    )
}

export default Comment

const styles = StyleSheet.create({})
//! Esto debería existir en un servidor backend ya que contiene toda la infomracion de la base de datos.
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React, { useEffect } from "react";
import { getDatabase, ref, set, get, child } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyD9Y7A-NBwExsXtDySImWPn2sjnPY5Pq8I",
    authDomain: "hss-2d0af.firebaseapp.com",
    projectId: "hss-2d0af",
    storageBucket: "hss-2d0af.appspot.com",
    messagingSenderId: "993924137747",
    appId: "1:993924137747:web:fc2f3003f93df2c41750e6",
    measurementId: "G-40LW453GJ8",
    databaseURL: "https://hss-2d0af-default-rtdb.firebaseio.com",

};

const app = initializeApp(firebaseConfig)

export const RegisterUser = async (name, email, password) => {
    //guardar datos del usuario...
    const data = await createUserWithEmailAndPassword(getAuth(), email, password);
    console.log(data);
    WriteUserData(data.user.uid, name, email);
}

export const LoginWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(getAuth(), email, password)
}

export const WriteUserData = async (userId, name, email, image_url = '') => {
    const db = getDatabase(app);
    await set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
        image_url: image_url,
        description: "",
    });
}


export const ReadUserData = async (userId) => {
    const db = ref(getDatabase(app));
    return get(child(db, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            AsyncStorage.getItem('userFirebase')
                .then(user => JSON.parse(user))
                .then(u => {
                    console.log(u)
                    let mail_analizado = /^([^]+)@(\w+).(\w+)$/.exec(u.email)
                    WriteUserData(u.uid, mail_analizado[1], u.email, "").then(() => {
                        return ReadUserData(userId)
                    })

                })
        }
    }).catch((error) => {
        console.error(error);
    });

}

export const GetUserList = async (userId) => {
    const db = ref(getDatabase(app));
    let jsonUsers = {}
    return get(child(db, `users`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val(), userId)
            for (const [key, value] of Object.entries(snapshot.val())) {
                if (key != userId) {
                    jsonUsers[key] = value;
                }
            }
            return jsonUsers;
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}
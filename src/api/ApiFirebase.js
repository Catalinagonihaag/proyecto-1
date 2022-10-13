//! Esto debería existir en un servidor backend ya que contiene toda la infomracion de la base de datos.
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

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
    const data = await createUserWithEmailAndPassword(getAuth(), email, password);
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

            WriteUserData(userId, "", "", "").then(() => {
                return ReadUserData(userId)
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
            //console.log(snapshot.val(), userId)
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

export const postPost = async (userId, post) => {
    const db = ref(getDatabase(app));
    await set(child(db, `posts/${userId}`), post);
}

export const getPost = async (userId) => {
    const db = ref(getDatabase(app));
    return get(child(db, `posts/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export const getAllPosts = async () => {
    const db = ref(getDatabase(app));
    return get(child(db, `posts`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}
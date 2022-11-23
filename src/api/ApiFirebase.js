//! Esto debería existir en un servidor backend ya que contiene toda la infomracion de la base de datos.
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, child, update, push } from 'firebase/database'
import { doc, setDoc, getFirestore, collection, query, arrayUnion, getDocs, updateDoc } from "firebase/firestore";

import { v4 as uuidv4 } from 'uuid'

const firebaseConfig = {
    apiKey: 'AIzaSyD9Y7A-NBwExsXtDySImWPn2sjnPY5Pq8I',
    authDomain: 'hss-2d0af.firebaseapp.com',
    projectId: 'hss-2d0af',
    storageBucket: 'hss-2d0af.appspot.com',
    messagingSenderId: '993924137747',
    appId: '1:993924137747:web:fc2f3003f93df2c41750e6',
    measurementId: 'G-40LW453GJ8',
    databaseURL: 'https://hss-2d0af-default-rtdb.firebaseio.com',
}

const app = initializeApp(firebaseConfig)



export const RegisterUser = async (name, email, password) => {
    const data = await createUserWithEmailAndPassword(getAuth(), email, password)
    WriteUserData(data.user.uid, name, email)
}

export const LoginWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(getAuth(), email, password)
}

export const WriteUserData = async (userId, name, email, image_url = '') => {
    const db = getDatabase(app)
    await set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
        image_url: image_url,
        description: '',
    })
}

//trae usuario
export const ReadUserData = async (userId) => {
    const db = ref(getDatabase(app))
    return get(child(db, `users/${userId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                WriteUserData(userId, '', '', '').then(() => {
                    return ReadUserData(userId)
                })
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const GetUserList = async (userId) => {
    const db = ref(getDatabase(app))
    let jsonUsers = {}
    return get(child(db, `users`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                //console.log(snapshot.val(), userId)
                for (const [key, value] of Object.entries(snapshot.val())) {
                    if (key != userId) {
                        jsonUsers[key] = value
                    }
                }
                return jsonUsers
            } else {
                console.log('No data available')
            }
        })
        .catch((error) => {
            console.error(error)
        })
}
//subir
export const postPost = async (userId, post) => {
    const db = getFirestore(app)

<<<<<<< HEAD
    const resp = await ReadUserData(userId)
    console.log(resp);
=======
  //trae datos usuario
  const resp = await ReadUserData(userId)
  console.log(resp);
  //crea post
  await setDoc(doc(db, "posts", uuidv4()), {
    user: {
      userId,
      ...resp
    },
    post,
    id: uuidv4()
  });
  
>>>>>>> 99e3b6ce49651b0a711e71164c5fe3a13b22f186

    await setDoc(doc(db, "posts", uuidv4()), {
        user: {
            userId,
            ...resp
        },
        post: {
            ...post,
            likes: [],
            comments: [],
        },
        id: uuidv4()
    });
}

export const likePost = async (userId, postId) => {
    const db = getFirestore(app)

    await updateDoc(doc(db, "posts", postId), {
        "post.likes": arrayUnion(userId)
    });
}

export const commentPost = async (userId, postId, comment) => {
    if (!comment) return

    const db = getFirestore(app)
    await updateDoc(doc(db, "posts", postId), {
        "post.comments": arrayUnion({
            userId,
            message: comment
        })
    });
}

export const getAllPosts = async () => {
    const db = getFirestore(app)

    const q = query(collection(db, "posts"))

    const querySnapshot = await getDocs(q);


    let data = []
    querySnapshot.forEach((doc) => {
        const post = doc.data();
        post.id = doc.id;
        post.post.comments = post.post.comments ?? []
        post.post.likes = post.post.likes ?? []
        data.push(post);
    });

    console.log(data);

    return data
}


export const getPost = async (userId) => {
    const db = ref(getDatabase(app))
    return get(child(db, `posts/${userId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                console.log('No data available')
            }
        })
        .catch((error) => {
            console.error(error)
        })
}


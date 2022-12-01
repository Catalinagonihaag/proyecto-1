//! Esto debería existir en un servidor backend ya que contiene toda la infomracion de la base de datos.
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
// import { getDatabase, ref, set, get, child, update, push } from 'firebase/database'
import { doc, setDoc, getFirestore, collection, query, arrayUnion, getDocs, updateDoc, arrayRemove, getDoc } from "firebase/firestore";


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

export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app);

export const RegisterUser = async (name, email, password) => {
    const data = await createUserWithEmailAndPassword(getAuth(), email, password)
    WriteUserData(data.user.uid, name, email)
}

export const LoginWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(getAuth(), email, password)
}

export const followUser = async(userId, userLoggedId) => {
    try {
        const db = getFirestore(app)

        // userId user to follow
        // userLoggedId userto to put following user id 
    
        
        const table = doc(db, `users/${userLoggedId}`)
        const tableData =  (await getDoc(table)).data()
        
        let followingIncerted = tableData.following
    
        if (!followingIncerted.includes(userLoggedId)) {
            followingIncerted.push(userLoggedId) 
        } else {
            const newArr = followingIncerted.filter((id) => id !== userLoggedId)
            followingIncerted = newArr
            console.log(followingIncerted);
        }
    
        await updateDoc(table, {
            "following": [...followingIncerted]
        })
        
    
    
        // fijarse si esta el follow si esta sacarlo sino agregarlo
    
    
        
        
    
        const table2 = doc(db, `users/${userId}`)
        const tableData2 =  (await getDoc(table2)).data()

        let followIncerted = tableData2.followers

        if (!followIncerted.includes(userLoggedId)) {
            followIncerted.push(userLoggedId) 
        } else {
            const newArr = followIncerted.filter((id) => id !== userLoggedId)
            followIncerted = newArr
        }
    
        await updateDoc(table2, {
            "followers": [...followIncerted]
        })

    
        // fijarse si esta el follow si esta sacarlo sino agregarlo 
    } catch (error) {
        console.log(error);
    }
    

    

}

export const WriteUserData = async (userId, name, email, image_url = '') => {
    const db = getFirestore(app)
    await setDoc(doc(db, 'users/' + userId), {
        username: name,
        email: email,
        image_url: image_url,
        description: '',
        followers: [],
        following: []
    })
}

//trae usuario
export const ReadUserData = async (userId) => {
    const db = getFirestore(app)
    return getDoc(doc(db, `users/${userId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.data()
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

    try {
        const db = getFirestore(app)
        let jsonUsers = {}
        const querySnapshot = await getDocs(query(collection(db, `users`)))

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {

                if (doc.id != userId) {
                    jsonUsers[doc.id] = doc.data()
                }
            });
              
        }

        return jsonUsers
    } catch (error) {
        console.log(error);
    }
    
}
//subir
export const postPost = async (userId, post) => {
    const db = getFirestore(app)

    const resp = await ReadUserData(userId)

    console.log(resp);

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

export const likePost = async (userId, postId, postLikes) => {
    const db = getFirestore(app)

    if (postLikes.includes(userId)) {
        await updateDoc(doc(db, "posts", postId), {
            "post.likes": arrayRemove(userId)
        });
    }
    else {
        await updateDoc(doc(db, "posts", postId), {
            "post.likes": arrayUnion(userId)
        });
    }

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
    const db = getFirestore(app)
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

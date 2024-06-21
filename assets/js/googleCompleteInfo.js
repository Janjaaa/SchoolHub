/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FIREBASE AUTH , DB, AND STORAGE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    increment,
    getDocFromCache,
    collectionGroup,
    query,
    limit,
    where,
    arrayUnion,
    arrayRemove,
    Timestamp,
    getDocs,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBku3ngJDevWeow14kZDNdMLSft62XOsXQ',
    authDomain: 'projeto-interdisciplinar-43746.firebaseapp.com',
    projectId: 'projeto-interdisciplinar-43746',
    storageBucket: 'projeto-interdisciplinar-43746.appspot.com',
    messagingSenderId: '375705347335',
    appId: '1:375705347335:web:18cf980ec4f347f37851a2'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// AUTHENTICATION
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    getAdditionalUserInfo
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Login Google

const provider = new GoogleAuthProvider()
provider.addScope('openid')
auth.useDeviceLanguage()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid
        getUserInfo()
        // ...
    } else {
        // User is signed out
    }

    async function getUserInfo() {
        const docRef = doc(db, 'users', user.uid)
        const userInfo = await getDoc(docRef)

        if (userInfo.data().photoUrl != undefined) {
            let profilePic = document.getElementById('miniProfilePic')
            profilePic.setAttribute('src', userInfo.data().photoUrl)
        }
    }

    let buttonCompleteInfo = document.getElementById('sendCompleteInfo')

    buttonCompleteInfo.addEventListener('click', function () {
        const docRef = doc(db, 'users', user.uid)
        setDoc(
            docRef,
            {
                age: document.getElementById('age').value,

                faculdade: document.getElementById('faculdade').value,
                curso: document.getElementById('curso').value
            },
            {
                merge: true
            }
        )
        setTimeout(function () {
            location.replace('/mainPage.html')
        }, 1000)
    })
})

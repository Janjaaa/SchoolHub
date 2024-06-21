/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FIREBASE AUTH , DB, AND STORAGE~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import {
    initializeApp,
    getApp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'
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
    getAdditionalUserInfo,
    signOut,
    deleteUser
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Login Google

const provider = new GoogleAuthProvider()
provider.addScope('openid')
auth.useDeviceLanguage()

// STORAGE

import {
    getStorage,
    ref,
    uploadBytesResumable
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js'
const firebaseApp = getApp()
const storage = getStorage(
    firebaseApp,
    'gs://projeto-interdisciplinar-43746.appspot.com'
)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
onAuthStateChanged(auth, user => {
    if (user) {
        const uid = user.uid
        getUserInfo()
    } else {
        // User is signed out
    }

    async function getUserInfo() {
        const docRef = doc(db, 'users', user.uid)
        const userInfo = await getDoc(docRef)
        let cadeirasRef = collection(docRef, 'cadeiras')
        getDocs(cadeirasRef).then(cadeirasSnapshot => {
            cadeirasSnapshot.forEach(disciplina => {
                let cadeiraValues = document.getElementById('cadeira')
                let cadeiraOpt = document.createElement('option')
                cadeiraOpt.setAttribute('value', disciplina.data().abreviacao)
                cadeiraOpt.innerHTML = disciplina.id
                cadeiraValues.appendChild(cadeiraOpt)
            })
        })

        if (userInfo.data().photoUrl != undefined) {
            let profilePic = document.getElementById('miniProfilePic')
            profilePic.setAttribute('src', userInfo.data().photoUrl)
        }
    }

    let sendNewTask = document.getElementById('send')
    sendNewTask.addEventListener('click', function () {
        let cadeiraName = document.getElementById('cadeira').value
        let taskName = document.getElementById('nome').value
        let date = document.getElementById('date').value

        let userRef = doc(db, 'users', user.uid)
        addDoc(collection(userRef, 'tasks'), {
            name: taskName,
            date: date,
            cadeira: cadeiraName,
            estado: 'Não entregue',
            uidUser: user.uid
        })
        setTimeout(function () {
            location.replace('/mainPage.html')
        }, 500)
    })

    let cancel = document.getElementById('cancel')
    cancel.addEventListener('click', function () {
        setTimeout(function () {
            location.replace('/mainPage.html')
        }, 500)
    })
})

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
    uploadBytesResumable,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js'
const firebaseApp = getApp()
const storage = getStorage(
    firebaseApp,
    'gs://projeto-interdisciplinar-43746.appspot.com'
)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
    const goBack = document.getElementById('goback')
    goBack.addEventListener('click', function () {
        location.replace('/mainPage.html')
    })

    async function getUserInfo() {
        const docRef = doc(db, 'users', user.uid)
        const userInfo = await getDoc(docRef)
        console.log(userInfo.data())
        let name = document.getElementById('fname')
        name.innerHTML = userInfo.data().nome

        if (userInfo.data().age == undefined) {
        } else {
            let age = document.getElementById('age')
            age.innerHTML = userInfo.data().age
        }

        let email = document.getElementById('email')
        email.innerHTML = userInfo.data().email

        if (userInfo.data().faculdade == undefined) {
        } else {
            let faculdade = document.getElementById('faculdade')
            faculdade.innerHTML = userInfo.data().faculdade
        }

        if (userInfo.data().curso == undefined) {
        } else {
            let curso = document.getElementById('curso')
            curso.innerHTML = userInfo.data().curso
        }

        if (userInfo.data().photoUrl != undefined) {
            let profilePic = document.getElementById('profilePic')
            profilePic.setAttribute('src', userInfo.data().photoUrl)

            let fotoAmpliada = document.getElementById('fotoAmpliada')
            fotoAmpliada.setAttribute('src', userInfo.data().photoUrl)
        }
    }

    let logoutButton = document.getElementById('logOut')

    logoutButton.addEventListener('click', function () {
        const auth = getAuth()
        signOut(auth)
            .then(() => {
                location.replace('/login-register.html')
            })
            .catch(error => {
                // An error happened.
            })
    })

    let delUser = document.getElementById('deleteAcc')
    delUser.addEventListener('click', deleteAcc)

    function deleteAcc() {
        const user = auth.currentUser

        const docRef = doc(db, 'users', user.uid)
        const storageRef = ref(storage, 'imagensPerfil/' + user.uid)

        deleteUser(user)
            .then(() => {
                // User deleted.
            })
            .catch(error => {
                // An error ocurred
                // ...
            })
        deleteObject(storageRef)
            .then(() => {
                console.log('Sucesso')
            })
            .catch(error => {})
        deleteDoc(docRef)

        setTimeout(function () {
            location.replace('/login-register.html')
        }, 2000)
    }

    // Get the modal
    const modal = document.getElementById('myModal')

    // Get the button that opens the modal
    const btn = document.getElementById('myBtn')

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName('close')[0]

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        modal.style.display = 'block'
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = 'none'
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none'
        }
    }

    function uploadImg() {
        const user = auth.currentUser
        const profilePicture = document.getElementById('profilePicture')
        const file = profilePicture.files[0]
        console.log(user.uid)

        Object.defineProperty(file, 'name', {
            writable: true,
            value: user.uid
        })
        if (file) {
            const storageRef = ref(storage, 'imagensPerfil/' + file.name)
            const uploadTask = uploadBytesResumable(storageRef, file)

            const docRef = doc(db, 'users', user.uid)
            const gsReference = ref(storage, 'gs://bucket/images/' + user.uid)
            setDoc(
                docRef,
                {
                    photoUrl:
                        'https://firebasestorage.googleapis.com/v0/b/projeto-interdisciplinar-43746.appspot.com/o/imagensPerfil%2F' +
                        user.uid +
                        '?alt=media&token=e24709c8-9325-4181-8413-babf10d860b6'
                },
                { merge: true }
            )
        } else {
            console.log('no file')
        }
        modal.style.display = 'none'
        setTimeout(function () {
            window.location.reload()
        }, 1000)
    }

    const uploadProfilePic = document.getElementById('upload')
    uploadProfilePic.addEventListener('click', uploadImg)

    let closeModal = document.getElementById('closeModal')
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none'
    })
})

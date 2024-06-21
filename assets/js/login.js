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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const togglePassword = document.querySelector('#verSenha')
const password = document.querySelector('#password')

togglePassword.addEventListener('click', function () {
    // toggle the type attribute
    const type =
        password.getAttribute('type') === 'password' ? 'text' : 'password'
    password.setAttribute('type', type)

    // toggle the icon
    this.classList.toggle('bi-eye')
})

const togglePassword2 = document.querySelector('#verSenha2')
const password2 = document.querySelector('#passwordLogin')

togglePassword2.addEventListener('click', function () {
    // toggle the type attribute
    const type =
        password2.getAttribute('type') === 'password' ? 'text' : 'password'
    password2.setAttribute('type', type)

    // toggle the icon
    this.classList.toggle('bi-eye')
})

const buttonLogin = document.getElementById('buttonLogin')
const buttonSignup = document.getElementById('buttonSignup')

buttonLogin.addEventListener('click', function () {
    const loginUser = document.getElementById('loginUser')
    loginUser.style.visibility = 'hidden'
    buttonLogin.style.backgroundColor = 'var(--secondaryGreen)'
    buttonSignup.style.backgroundColor = 'var(--primaryGreen)'
    const registraUser = document.getElementById('registraUser')
    registraUser.style.visibility = 'visible'
    buttonLogin.style.color = '#FFF'
    buttonSignup.style.color = 'black'
})
buttonSignup.addEventListener('click', function () {
    const loginUser = document.getElementById('loginUser')
    loginUser.style.visibility = 'visible'
    buttonLogin.style.backgroundColor = 'var(--primaryGreen)'
    buttonSignup.style.backgroundColor = 'var(--secondaryGreen)'
    const registraUser = document.getElementById('registraUser')
    registraUser.style.visibility = 'hidden'
    buttonLogin.style.color = 'black'
    buttonSignup.style.color = '#FFF'
})

const signUp = document.getElementById('signUp')

signUp.addEventListener('click', function (e) {
    e.preventDefault()

    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            // Signed up
            const user = userCredential.user
            console.log(user)

            setDoc(doc(db, 'users', user.uid), {
                nome: document.getElementById('fname').value,
                age: document.getElementById('age').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                faculdade: document.getElementById('faculdade').value,
                curso: document.getElementById('curso').value
            })
            let userRef = doc(db, 'users', user.uid)

            alert('Sucesso!')
            // ...
        })
        .catch(error => {
            const errorCode = error.code
            const errorMessage = error.message
            alert(`${errorCode} = > ${errorMessage}`)
            // ..
        })
})

const login = document.getElementById('login')

login.addEventListener('click', function (e) {
    e.preventDefault()

    let email = document.getElementById('emailLogin').value
    let password = document.getElementById('passwordLogin').value

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            // Signed in
            const user = userCredential.user
            location.replace('/mainPage.html')

            // ...
            firebase.auth.Auth.Persistence.LOCAL
        })
        .catch(error => {
            const errorCode = error.code
            const errorMessage = error.message
        })
})

const googleSignup = document.getElementById('googleSignup')

googleSignup.addEventListener('click', function (e) {
    e.preventDefault()
    signInWithPopup(auth, provider)
        .then(result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            // The signed-in user info.
            const user = result.user
            let additionalInfos = getAdditionalUserInfo(result)

            if (additionalInfos.isNewUser == true) {
                setDoc(doc(db, 'users', user.uid), {
                    nome: user.displayName,

                    email: user.email,
                    photoUrl: user.photoURL
                })
                let userRef = doc(db, 'users', user.uid)

                setTimeout(function () {
                    location.replace('/googleCompleteInfo.html')
                }, 1000)
            } else {
                console.log('Usuário já existe!')
                setTimeout(function () {
                    const loginUser = document.getElementById('loginUser')
                    loginUser.style.visibility = 'hidden'
                    buttonLogin.style.backgroundColor = 'var(--secondaryGreen)'
                    buttonSignup.style.backgroundColor = 'var(--primaryGreen)'
                    const registraUser = document.getElementById('registraUser')
                    registraUser.style.visibility = 'visible'
                }, 5)
            }

            console.log(user)

            // IdP data available using getAdditionalUserInfo(result)

            // ...
        })
        .catch(error => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            // The email of the user's account used.
            // const email = error.customData.email
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error)
            // ...
        })
})

const googleSignin = document.getElementById('googleSignin')

googleSignin.addEventListener('click', function (e) {
    e.preventDefault()
    signInWithPopup(auth, provider)
        .then(result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            // The signed-in user info.
            const user = result.user

            location.replace('/mainPage.html')
            firebase.auth.Auth.Persistence.LOCAL

            // IdP data available using getAdditionalUserInfo(result)
            // ...
        })
        .catch(error => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            // The email of the user's account used.
            // const email = error.customData.email
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error)
            // ...
        })
})

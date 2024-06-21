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

// ~~~~~~~~~~~~~~~~~~~~~~~~MODAL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const modal = document.getElementById('myModal')

const btn = document.getElementById('criarCadeira')
const span = document.getElementsByClassName('close')[0]
btn.onclick = function () {
    modal.style.display = 'block'
}

span.onclick = function () {
    modal.style.display = 'none'
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none'
    }
}
let closeModal = document.getElementById('closeModal')
closeModal.addEventListener('click', function () {
    modal.style.display = 'none'
})
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  END MODAL ~~~~~~~~~~~~~~~~~~~~~~~~~~

onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid
        getCadeiras()
        // ...
    } else {
        // User is signed out
    }

    const nomeCadeira = document.getElementById('nomeCadeira')
    const abreviacaoCadeira = document.getElementById('abreviacaoCadeira')

    const criarCadeira = document.getElementById('complete')

    criarCadeira.addEventListener('click', function () {
        let userRef = doc(db, 'users', user.uid)
        let cadeirasRef = collection(userRef, 'cadeiras')
        let cadeiraRef = doc(cadeirasRef, nomeCadeira.value)
        setDoc(cadeiraRef, {
            name: nomeCadeira.value,
            abreviacao: abreviacaoCadeira.value,

            uidUser: user.uid
        })

        let cadeiras = document.getElementById('cadeiras')
        cadeiras.innerHTML = ''
        getCadeiras()
        modal.style.display = 'none'
    })

    async function getCadeiras() {
        let userRef = doc(db, 'users', user.uid)
        const userInfo = await getDoc(userRef)
        let cadeirasRef = collection(userRef, 'cadeiras')

        getDocs(cadeirasRef).then(cadeirasSnapshot => {
            cadeirasSnapshot.forEach(disciplina => {
                let cadeiras = document.getElementById('cadeiras')
                let uniqueCadeira = document.createElement('div')
                uniqueCadeira.setAttribute('name', disciplina.id)
                uniqueCadeira.setAttribute('class', 'cadeira')
                cadeiras.appendChild(uniqueCadeira)

                let detail = document.createElement('div')
                detail.setAttribute('class', 'detail')
                uniqueCadeira.appendChild(detail)

                let cadeira = document.createElement('h2')
                cadeira.setAttribute('class', 'nomeCadeira')
                cadeira.innerHTML = disciplina.data().abreviacao
                uniqueCadeira.appendChild(cadeira)

                console.log(disciplina.data())
            })
        })
    }
})

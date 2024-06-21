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

// NOTIFICATION

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

        if (userInfo.data().adm == true) {
            let title = document.getElementById('trabalhos')
            title.innerHTML = 'Usuários'

            let filtro = document.getElementById('filtro')
            filtro.style.display = 'none'
            let collectionRef = collection(db, 'users')
            getDocs(collectionRef).then(userSnaps => {
                userSnaps.forEach(user => {
                    let tasks = document.getElementById('tasks')
                    let uniqueTask = document.createElement('div')
                    uniqueTask.setAttribute('name', user.id)
                    uniqueTask.setAttribute('class', user.data().age)

                    let deleteButton = document.createElement('input')
                    deleteButton.classList.add('deleteButton')
                    deleteButton.setAttribute('type', 'image')
                    deleteButton.id = 'del' + user.id
                    let delTT = 'del' + user.id
                    deleteButton.setAttribute('src', '/images/delete.png')

                    uniqueTask.appendChild(deleteButton)

                    uniqueTask.classList.add('task')
                    tasks.appendChild(uniqueTask)

                    let date = document.createElement('p')
                    date.setAttribute('class', 'dateEntrega')
                    date.innerHTML = user.data().email
                    uniqueTask.appendChild(date)

                    let cadeira = document.createElement('h2')
                    cadeira.setAttribute('class', 'nomeCadeira')
                    cadeira.innerHTML = user.data().nome
                    uniqueTask.appendChild(cadeira)

                    let nome = document.createElement('h3')
                    nome.setAttribute('class', 'nameTask')
                    nome.innerHTML = user.data().faculdade
                    uniqueTask.appendChild(nome)

                    let estado = document.createElement('p')
                    estado.setAttribute('class', 'estadoEntrega')
                    estado.innerHTML = user.data().curso
                    estado.setAttribute('class', 'entregue')

                    uniqueTask.appendChild(estado)
                    console.log(user.data())
                    function delTask() {
                        deleteDoc(doc(db, 'users', user.id))
                        setTimeout(function () {
                            location.reload(true)
                        }, 500)
                    }

                    const deleteTask = document.getElementById(delTT)
                    deleteTask.addEventListener('click', delTask)
                })
            })
        } else {
            let tasksRef = collection(docRef, 'tasks')
            getDocs(tasksRef).then(taskSnapshots => {
                taskSnapshots.forEach(task => {
                    let tasks = document.getElementById('tasks')
                    let uniqueTask = document.createElement('div')
                    uniqueTask.setAttribute('name', task.id)
                    uniqueTask.setAttribute('class', task.data().cadeira)

                    let deleteButton = document.createElement('input')
                    deleteButton.classList.add('deleteButton')
                    deleteButton.setAttribute('type', 'image')
                    deleteButton.id = 'del' + task.id
                    let delTT = 'del' + task.id
                    deleteButton.setAttribute('src', '/images/delete.png')

                    uniqueTask.appendChild(deleteButton)

                    uniqueTask.classList.add('task')
                    tasks.appendChild(uniqueTask)

                    let date = document.createElement('p')
                    date.setAttribute('class', 'dateEntrega')
                    date.innerHTML = 'Para ser entregue em: ' + task.data().date
                    uniqueTask.appendChild(date)

                    let cadeira = document.createElement('h2')
                    cadeira.setAttribute('class', 'nomeCadeira')
                    cadeira.innerHTML = task.data().cadeira
                    uniqueTask.appendChild(cadeira)

                    let nome = document.createElement('h3')
                    nome.setAttribute('class', 'nameTask')
                    nome.innerHTML = task.data().name
                    uniqueTask.appendChild(nome)

                    let estado = document.createElement('p')
                    estado.setAttribute('class', 'estadoEntrega')
                    estado.innerHTML = task.data().estado
                    if (task.data().estado == 'Entregue') {
                        estado.setAttribute('class', 'entregue')
                    }
                    uniqueTask.appendChild(estado)

                    let sendTask = document.createElement('button')
                    sendTask.id = 'send' + task.id
                    let sendTT = 'send' + task.id

                    sendTask.setAttribute('class', 'myBtn')
                    sendTask.innerHTML = 'Selecione um ficheiro'
                    uniqueTask.appendChild(sendTask)

                    // ~~~~~~~~~~~~~~~~~~~~~~~~MODAL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    const modal = document.getElementById('myModal')

                    let taskID = task.id
                    let taskIdf = document.getElementById('taskIdentifier')
                    taskIdf.innerHTML = sendTT

                    const btn = document.getElementById('send' + task.id)
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

                    function delTask() {
                        deleteDoc(doc(tasksRef, taskID))
                        setTimeout(function () {
                            location.reload(true)
                        }, 500)
                    }

                    const deleteTask = document.getElementById(delTT)
                    deleteTask.addEventListener('click', delTask)

                    function uploadFile() {
                        const file = completeTask.files[0]

                        let taskref = doc(tasksRef, taskID)
                        setDoc(
                            taskref,
                            {
                                estado: 'Entregue'
                            },
                            { merge: true }
                        )

                        console.log('no file')

                        modal.style.display = 'none'
                        setTimeout(function () {
                            window.location.reload()
                        }, 1000)
                    }
                    const uploadFiles = document.getElementById(sendTT)
                    uploadFiles.addEventListener('click', uploadFile)
                })
            })
        }

        const addTask = document.getElementById('addTask')
        addTask.addEventListener('click', function () {
            setTimeout(function () {
                location.replace('/newTask.html')
            }, 500)
        })
    }

    const docRef = doc(db, 'users', user.uid)
    let tasksRef = collection(docRef, 'tasks')
    let busca = document.getElementById('search')
    function procurarTasks() {
        let taskSearch = document.getElementById('searchBar').value
        let taskFind = query(tasksRef, where('name', '==', taskSearch))
        getDocs(taskFind)
            .then(querySnapshot => {
                if (querySnapshot.docs.length > 0) {
                    querySnapshot.forEach(doc => {
                        console.log(doc.data())
                        let tasks = document.getElementById('tasks')
                        tasks.innerHTML = ''
                        let uniqueTask = document.createElement('div')
                        uniqueTask.setAttribute('name', doc.id)
                        uniqueTask.setAttribute('class', doc.data().cadeira)

                        let deleteButton = document.createElement('input')
                        deleteButton.classList.add('deleteButton')
                        deleteButton.setAttribute('type', 'image')
                        deleteButton.id = 'del' + doc.id
                        let delTT = 'del' + doc.id
                        deleteButton.setAttribute('src', '/images/delete.png')

                        uniqueTask.appendChild(deleteButton)

                        uniqueTask.classList.add('task')
                        tasks.appendChild(uniqueTask)

                        let date = document.createElement('p')
                        date.setAttribute('class', 'dateEntrega')
                        date.innerHTML =
                            'Para ser entregue em: ' + doc.data().date
                        uniqueTask.appendChild(date)

                        let cadeira = document.createElement('h2')
                        cadeira.setAttribute('class', 'nomeCadeira')
                        cadeira.innerHTML = doc.data().cadeira
                        uniqueTask.appendChild(cadeira)

                        let nome = document.createElement('h3')
                        nome.setAttribute('class', 'nameTask')
                        nome.innerHTML = doc.data().name
                        uniqueTask.appendChild(nome)

                        let estado = document.createElement('p')
                        estado.setAttribute('class', 'estadoEntrega')
                        estado.innerHTML = doc.data().estado
                        if (doc.data().estado == 'Entregue') {
                            estado.setAttribute('class', 'entregue')
                        }
                        uniqueTask.appendChild(estado)

                        let sendTask = document.createElement('button')
                        sendTask.id = 'send' + doc.id
                        let sendTT = 'send' + doc.id

                        sendTask.setAttribute('class', 'myBtn')
                        sendTask.innerHTML = 'Selecione um ficheiro'
                        uniqueTask.appendChild(sendTask)
                    })
                } else {
                    console.log('Error getting documents')
                }
            })
            .catch(error => {
                console.log('Error getting documents: ', error)
            })
    }
    busca.addEventListener('click', procurarTasks)

    let filtro = document.getElementById('filtro')
    filtro.onchange = function () {
        sessionStorage.setItem('disciplina', filtro.value)
        setTimeout(function () {
            location.replace('/mainPageOrganizer.html')
        }, 500)
    }
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function () {
        console.log('Service Worker is registered!')
    })
}

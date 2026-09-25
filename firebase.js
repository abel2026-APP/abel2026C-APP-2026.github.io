
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";


import {
    getAuth,
    signInAnonymously,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


import {
    getDatabase,
    ref,
    push,
    get
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";


// CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAmYTi6ifbk-c208EwJsOxl n8tLCuHeWxg",
  authDomain: "mi-app-web-744d0.firebaseapp.com",
  databaseURL: "https://mi-app-web-744d0-default-rtdb.firebaseio.com",
  projectId: "mi-app-web-744d0",
  storageBucket: "mi-app-web-744d0.firebasestorage.app",
  messagingSenderId: "677163268222",
  appId: "1:677163268222:web:4a43582062167a2493402f"
};

// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// AUTENTICACIÓN ANÓNIMA

const autenticacionLista = auth.authStateReady().then(() => {
    if (auth.currentUser) {
        return auth.currentUser;
    }

    return signInAnonymously(auth);
});

// ENVIAR RESULTADOS
window.enviarResultadoFirebase = async function(resultado) {
  await autenticacionLista;

  const referencia = ref(db, "resultadosQuiz");
  await push(referencia, resultado);

  console.log("Resultado guardado en Firebase");
};


window.obtenerResultadosFirebase = async function() {
    const usuario = auth.currentUser;

    if (!usuario || usuario.isAnonymous) {
        throw new Error("Debes iniciar sesión como profesor.");
    }

    const referencia = ref(db, "resultadosQuiz");
    const datos = await get(referencia);

    if (!datos.exists()) {
        return [];
    }

    return Object.values(datos.val());
};

window.iniciarSesionProfesor = async function(correo, clave) {
    await autenticacionLista;

    const credenciales = await signInWithEmailAndPassword(
        auth,
        correo,
        clave
    );

    return credenciales.user;
};

// Referencias de elementos del DOM
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nombreInput = document.getElementById("nombre");

const btnSignUp = document.getElementById("btnSignUp");
const btnLogout = document.getElementById("btnLogout");

const authContainer = document.getElementById("authContainer");
const appContainer = document.getElementById("appContainer");
const userInfo = document.getElementById("userInfo");
const userEmail = document.getElementById("userEmail");

// 1. Registro de usuario
btnSignUp.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const nombre = nombreInput.value;

    if (!email || !password) return alert("Ingresa correo y contraseña.");

    const { data, error } = await db.auth.signUp({
        email: email,
        password: password,
        options: { data: { nombre: nombre } }
    });

    if (error) {
        alert("Error al registrar: " + error.message);
    } else {
        alert("¡Registro exitoso! Revisa tu correo o inicia sesión.");
    }
});

// 2. Iniciar sesión
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await db.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Error al ingresar: " + error.message);
    } else {
        mostrarApp(data.user);
    }
});

// 3. Cerrar sesión
btnLogout.addEventListener("click", async () => {
    await db.auth.signOut();
    mostrarAuth();
});

// Funciones auxiliares de la interfaz
function mostrarApp(user) {
    userEmail.textContent = user.email;
    authContainer.classList.add("d-none");
    appContainer.classList.remove("d-none");
    userInfo.classList.remove("d-none");
}

function mostrarAuth() {
    authContainer.classList.remove("d-none");
    appContainer.classList.add("d-none");
    userInfo.classList.add("d-none");
    authForm.reset();
}

// Verificar sesión existente al cargar
window.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        mostrarApp(session.user);
    }
});
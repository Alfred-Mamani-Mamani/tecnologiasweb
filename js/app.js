// Referencias de elementos del DOM
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nombreInput = document.getElementById("nombre");

const btnSignUp = document.getElementById("btnSignUp");
const btnLogout = document.getElementById("btnLogout");
const btnCargarServicios = document.getElementById("btnCargarServicios");

const authContainer = document.getElementById("authContainer");
const appContainer = document.getElementById("appContainer");
const userInfo = document.getElementById("userInfo");
const userEmail = document.getElementById("userEmail");
const gridServicios = document.getElementById("gridServicios");

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
        alert("¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.");
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

// 4. Obtener y renderizar datos desde la tabla 'servicios'
async function cargarServicios() {
    gridServicios.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Cargando datos desde Supabase...</p>
        </div>`;

    const { data: servicios, error } = await db.from("servicios").select("*");

    if (error) {
        gridServicios.innerHTML = `<div class="alert alert-danger">Error al cargar servicios: ${error.message}</div>`;
        return;
    }

    gridServicios.innerHTML = ""; // Limpiar spinner

    if (servicios.length === 0) {
        gridServicios.innerHTML = `<div class="alert alert-info">No hay servicios registrados en la base de datos.</div>`;
        return;
    }

    servicios.forEach(item => {
        gridServicios.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body">
                        <span class="badge bg-secondary mb-2">${item.categoria || 'General'}</span>
                        <h5 class="card-title fw-bold">${item.nombre}</h5>
                        <p class="card-text text-muted">${item.descripcion}</p>
                    </div>
                    <div class="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-primary fs-5">$${Number(item.precio).toLocaleString()}</span>
                        <button class="btn btn-outline-primary btn-sm">Solicitar</button>
                    </div>
                </div>
            </div>
        `;
    });
}

btnCargarServicios.addEventListener("click", cargarServicios);

// Controladores de UI
function mostrarApp(user) {
    userEmail.textContent = user.email;
    authContainer.classList.add("d-none");
    appContainer.classList.remove("d-none");
    userInfo.classList.add("d-none");
    userInfo.classList.replace("d-none", "d-flex");
    cargarServicios();
}

function mostrarAuth() {
    authContainer.classList.remove("d-none");
    appContainer.classList.add("d-none");
    userInfo.classList.replace("d-flex", "d-none");
    authForm.reset();
}

// Comprobar estado de la sesión activa al recargar
window.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        mostrarApp(session.user);
    }
});
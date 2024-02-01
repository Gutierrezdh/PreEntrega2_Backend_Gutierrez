async function postLogin(email, password) {
    try {
        console.log("Enviando datos al servidor:", { email, password });
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.respuesta === "ok") {
            window.location.href = "/privado";
        } else {
            console.log("Respuesta completa del servidor:", data);
            alert("Datos incorrectos");
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.");
    }
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    postLogin(email, password);
});

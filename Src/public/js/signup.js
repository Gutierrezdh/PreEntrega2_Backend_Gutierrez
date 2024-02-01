async function postSignup(first_name, last_name, email, password, age) {
    const data = {
        first_name,
        last_name,
        email,
        password,
        age,
    };

    console.log("Enviando datos al servidor:", data);

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta del servidor:", response.status, errorText);
            throw new Error("Error en la respuesta del servidor");
        }


        const result = await response.json();

        console.log("Respuesta del servidor:", result);

        return result;
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        throw error; 
    }
}

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;

    console.log("Datos del formulario:", { first_name, last_name, email, password, age });

    try {
        const result = await postSignup(first_name, last_name, email, password, age);

        if (result.respuesta === "Usuario creado con éxito") {
            console.log("Usuario creado con éxito. Redirigiendo a /login");
            window.location.href = "/login";
        } else {
            console.log("Respuesta del servidor indica datos incorrectos.");
            alert("Datos incorrectos");
        }
    } catch (error) {
        console.error("Error durante el proceso de registro:", error);
    }
});

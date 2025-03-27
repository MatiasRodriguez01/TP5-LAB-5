import { config } from "dotenv";
import { sumar } from "./math.js";
import readline from 'readline';
import fs from "fs"
// import env from "env-var";

config()

// const PORT = env.get('PORT').required().asPortNumber()

// EJERCICIO 1:
console.log(process.env.BD_HOST)
console.log(process.env.BD_USER)
console.log(process.env.DB_PASS)

// EJERCICIO 2: 
sumar(4, 5)

// EJERCICIO 3:
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// pedimos el nombre
rl.question('¿Cuál es tu nombre? ', (nombre) => {
    console.log(`Hola, ${nombre}!`);
    //pedimos la edad
    rl.question("Ingrese su edad: ", (edad) => {
        const añoNacimiento = new Date().getFullYear() - parseInt(edad);
        console.log("Fecha de nacimiento: ", añoNacimiento)

        //EJERCICIO 4:
        rl.question('Ingrese su correo electronico: ', (correo) => {
            // creamos el archivo
            fs.writeFile("datos_usuario.txt", `Nombre = ${nombre}\nEdad = ${edad}\nCorreo = ${correo}`, (err) => {
                if (err) {
                    console.error("Error al crear el archivo:", err);
                    rl.close(); // Cerramos el readline si hay un error
                    return;
                }

                // leemos el archivo
                fs.readFile("datos_usuario.txt", "utf-8", (err, data) => {
                    if (err) {
                        console.error("Error al leer el archivo:", err);
                    } else {
                        console.log("\nContenido del archivo:\n", data);
                    }
                    rl.close(); 
                    
                });
            });
        })
    })
});






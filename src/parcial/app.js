import readline from 'readline';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const crear_producto = () => {
    return new Promise((resolve) => {
        rl.question("Ingrese el nombre del producto: ", (nombre) => {
            rl.question("Ingrese el precio del producto: ", (precio) => {
                rl.question("Ingrese la cantidad del producto: ", (cantidad) => {
                    resolve({ nombre, precio, cantidad });
                });
            });
        });
    });
};

const crear_json = (productos, archivo) => {
    fs.writeFileSync(archivo, JSON.stringify(productos, null, 4));
};

const leer_json = async (archivo) => {
    try {
        if (!fs.existsSync(archivo)) {
            console.log("No se encontró el archivo. Creando un nuevo archivo.");
            const nuevo_producto = await crear_producto();
            crear_json([nuevo_producto], archivo);
            console.log("Contenido del archivo productos.json:");
            console.log([nuevo_producto]);
            await agregar_nuevo([nuevo_producto], archivo);
        } else {
            const data = fs.readFileSync(archivo, 'utf-8');
            const productos = JSON.parse(data);
            console.log("Contenido del archivo productos.json:");
            console.log(productos);
            await agregar_nuevo(productos, archivo);
        }
    } catch (err) {
        console.error("Error al procesar el archivo: ", err);
    }
};

const agregar_nuevo = async (productos, archivo) => {
    rl.question("¿Desea agregar otro producto? (s/n): ", async (respuesta) => {
        if (respuesta.toLowerCase() === 's') {
            const nuevo_producto = await crear_producto();
            productos.push(nuevo_producto);
            crear_json(productos, archivo);
            console.log("Producto agregado.");
            console.log("Contenido actualizado del archivo productos.json:");
            console.log(productos);
            await agregar_nuevo(productos, archivo);
        } else {
            console.log("No se agregaron más productos.");
            rl.close();
        }
    });
};

const argv = yargs(hideBin(process.argv))
    .option('file', {
        alias: 'f',
        description: 'El archivo en el que se guardarán los productos',
        type: 'string',
        default: 'productos.json'
    })
    .argv;

if (argv._.includes("f")) {
    leer_json(argv.file);
} 

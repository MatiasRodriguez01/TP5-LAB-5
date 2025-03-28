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

const crear_json = (productos) => {
    fs.writeFile('productos.json', JSON.stringify(productos, null, 4), (err) => {
        if (err) {
            console.error("Error al guardar el archivo:", err);
        } else {
            console.log("Productos guardados en el archivo.");
        }
    });
};

const leer_json = async (archivo) => {
    try {
        if (!fs.existsSync(archivo)) {
            console.log("No se encontró el archivo. Creando un nuevo archivo.");
            const nuevo_producto = await crear_producto();
            crear_json([nuevo_producto]);
        } else {
            const data = await fs.promises.readFile(archivo, 'utf-8');
            console.log("Contenido del archivo productos.json:");
            console.log(data);
            await agregar_nuevo(archivo);
        }
    } catch (err) {
        console.error("Error al procesar el archivo: ", err);
    }
};

const agregar_nuevo = async (archivo) => {
    rl.question("¿Desea agregar otro producto? (s/n): ", async (respuesta) => {
        if (respuesta.toLowerCase() === 's') {
            const nuevo_producto = await crear_producto();
            const data = await fs.promises.readFile(archivo, 'utf-8');
            const productos = JSON.parse(data);
            productos.push(nuevo_producto);
            crear_json(productos);
            console.log("Producto agregado.");
            await agregar_nuevo(archivo);
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

if (argv._.includes("archivo")) {
    leer_json(argv.file);
} else {
    console.log("Por favor, use el comando 'archivo' para leer o crear el archivo.");
}

class Producto {
    constructor(id, nombre, precio, cantidad, ingredientes) {
        this.id = parseInt(id);
        this.nombre = nombre;
        this.precio = parseFloat(precio).toFixed(2);
        this.cantidad = parseInt(cantidad);
        this.ingredientes = ingredientes;
    }
}

const productos = [];
productos.push(new Producto(1, "Chocolate 40% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"]));
productos.push(new Producto(2, "Chocolate 50% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"]));
productos.push(new Producto(3, "Chocolate 60% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"]));
productos.push(new Producto(4, "Chocolate 70% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"]));
productos.push(new Producto(5, "Chocolate 80% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"]));
productos.push(new Producto(6, "Chocolate 90% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"]));

const carrito = [];

function agregarProductoAlCarrito(producto) {
    // Se verifica si existe el producto en el carrito. Si esxiste, se aumenta la cantidad, 
    // si no, se agrega. Finalmente resta la cantidad del producto en la base de datos

    let existe = false;
    for (let prod of carrito) {
        if (prod.id == producto.id) {
            prod.cantidad++;
            existe = true;
            break
        }
    }

    if (!existe) {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id == producto.id) {
            productos[i].cantidad--;
            break
        }
    }

    console.log(productos)
}

function calcularMontoTotalCarrito() {
    // Calcula el monto total de los productos en el carrito

    let total = 0
    for (let producto of carrito) {
        total += producto.precio*producto.cantidad
    }
    return total.toFixed(2)
}

function mostrarProductosDisponibles() {
    // Muestra los productos disponibles en la base de datos y solicita al usuario
    // que ingrese el id del producto que desea agregar al carrito

    let mensaje = "Productos disponibles: \n"
    for (let producto of productos) {
        if (producto.cantidad > 0) {
            mensaje += `ID: ${producto.id}\nNombre: ${producto.nombre} - Precio: $${producto.precio}\nCantidad: ${producto.cantidad}\n`
        }        
    }
    mensaje += "\nIngrese el ID del producto que desea agregar al carrito"
    let id = prompt(mensaje)
    parseInt(id)
    return id
}

function buscarProductoPorId(id) {
    // Busca un producto en la base de datos por su id y devuelve una copia del producto

    for (let producto of productos) {
        if (producto.id == id) {
            let productoEncontrado = new Producto(producto.id, producto.nombre, producto.precio, producto.cantidad, producto.ingredientes)
            return productoEncontrado
        }
    }
    return null
}

function mostrarProductosEnCarrito() {
    // Comprueba si existen productos en el carrito. Si no hay, muestra un mensaje,
    // si hay, muestra los productos con su cantidad y precio

    if (carrito.length == 0) {
        alert("No hay productos en el carrito")
    } else{
        let mensaje = "Productos en el carrito: \n"
        for (let producto of carrito) {
            mensaje += `\nNombre: ${producto.nombre}\nCantidad: ${producto.cantidad}\nPrecio total: $${(producto.precio*producto.cantidad).toFixed(2)}\n`
        }
        mensaje += `\nTotal: $${calcularMontoTotalCarrito()}`
        alert(mensaje)
    }

    console.log(carrito)
}

function simulador() {
    let continuar = true

    while(continuar) {
        let id = mostrarProductosDisponibles()
        if(id == null) { break } // Si el usuario presiona cancelar, se detiene el proceso
        
        producto = buscarProductoPorId(id)

        if(producto != null && producto.cantidad > 0) {
            agregarProductoAlCarrito(producto)
            continuar = confirm("¿Desea agregar otro producto al carrito?")
        } else{
            alert("Producto no disponible")
            continuar = confirm("¿Desea agregar otro producto al carrito?")
        }
    }

    mostrarProductosEnCarrito()
}

simulador()
class Producto {
    #id = null
    #nombre = null
    #precio = null
    #cantidad = null
    #ingredientes = []
    #img = null
    #html = null

    constructor(id, nombre, precio, cantidad, ingredientes, img, html) {
        this.#id = parseInt(id);
        this.#nombre = nombre;
        this.#precio = parseFloat(precio).toFixed(2);
        this.#cantidad = parseInt(cantidad);
        this.#ingredientes = ingredientes;
        this.#img = img;
        this.#html = html;

    }

    //Setters
    set id(id) {
        this.#id = parseInt(id);
    }
    set nombre(nombre) {
        this.#nombre = nombre;
    }
    set precio(precio) { 
        this.#precio = parseFloat(precio).toFixed(2);
    }
    set cantidad(cantidad) {
        this.#cantidad = parseInt(cantidad);
    }
    set ingredientes(ingredientes) {
        this.#ingredientes = ingredientes;
    }
    set img(img) {
        this.#img = img;
    }
    set html(html) {
        this.#html = html;
    }

    // Getters
    get id() {
        return this.#id;
    }
    get nombre() {
        return this.#nombre;
    }
    get precio() {
        return this.#precio;
    }
    get cantidad() {
        return this.#cantidad;
    }
    get ingredientes() {
        return this.#ingredientes;
    }
    get img() {
        return this.#img;
    }
    get html() {
        return this.#html;
    }

}

const productos = [];
productos.push(new Producto(1, "Chocolate 40% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"], "../images/chocolate-40.jpg", "info-producto-cacao-40.html"));
productos.push(new Producto(2, "Chocolate 50% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"], "../images/chocolate-50.jpg", "info-producto-cacao-50.html"));
productos.push(new Producto(3, "Chocolate 60% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"], "../images/chocolate-60.jpg", "info-producto-cacao-60.html"));
productos.push(new Producto(4, "Chocolate 70% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"], "../images/chocolate-70.jpg", "info-producto-cacao-70.html"));
productos.push(new Producto(5, "Chocolate 80% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"], "../images/chocolate-80.jpg", "info-producto-cacao-80.html"));
productos.push(new Producto(6, "Chocolate 90% cacao", 1500, 50, ["Manteca de cacao", "Miel organica", "Cacao"], "../images/chocolate-90.jpg", "info-producto-cacao-90.html"));

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
            let productoEncontrado = new Producto(producto.id, producto.nombre, producto.precio, producto.cantidad, producto.ingredientes, producto.img, producto.html)
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

//simulador()


/////////////////// ENTREGA 2 ///////////////////

const productosContainer = document.getElementById("productos-container")
productos.forEach((producto) => {
    const div = document.createElement("div")
    div.classList.add("col-12")
    div.classList.add("col-sm-4")
    div.classList.add("col-md-3")
    div.classList.add("d-flex")
    div.classList.add("justify-content-center")

    div.innerHTML = `
        <div class="producto-caja">
            <a href="${producto.html}">
                <img class="productos-img" src="${producto.img}" alt="${producto.nombre}">
            </a>
            <a href="${producto.html}">
                <h2>${producto.nombre}</h2>
            </a>
            <button class="btn btn-primary comprar-producto-btn" type="button">Añadir al carrito</button>
        </div>
    `
    productosContainer.appendChild(div)
})
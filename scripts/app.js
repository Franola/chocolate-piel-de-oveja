class Producto {
    id = null
    nombre = null
    precio = null
    cantidad = null
    ingredientes = []
    img = null
    html = null

    constructor(id, nombre, precio, cantidad, ingredientes, img, html) {
        this.id = parseInt(id);
        this.nombre = nombre;
        this.precio = parseFloat(precio).toFixed(2);
        this.cantidad = parseInt(cantidad);
        this.ingredientes = ingredientes;
        this.img = img;
        this.html = html;

    }

    //Setters
    set id(id) {
        this.id = parseInt(id);
    }
    set nombre(nombre) {
        this.nombre = nombre;
    }
    set precio(precio) { 
        this.precio = parseFloat(precio).toFixed(2);
    }
    set cantidad(cantidad) {
        this.cantidad = parseInt(cantidad);
    }
    set ingredientes(ingredientes) {
        this.ingredientes = ingredientes;
    }
    set img(img) {
        this.img = img;
    }
    set html(html) {
        this.html = html;
    }

    // Getters
    get id() {
        return this.id;
    }
    get nombre() {
        return this.nombre;
    }
    get precio() {
        return this.precio;
    }
    get cantidad() {
        return this.cantidad;
    }
    get ingredientes() {
        return this.ingredientes;
    }
    get img() {
        return this.img;
    }
    get html() {
        return this.html;
    }
    
}

let productos = [];
//localStorage.setItem("carrito", JSON.stringify([]));
let carrito = [];
const carritoJson = JSON.parse(localStorage.getItem("carrito")) || [];
if(carritoJson.length > 0) {
    carrito = carritoJson.map(producto => new Producto(producto.id, producto.nombre, producto.precio, producto.cantidad, producto.ingredientes, producto.img, producto.html));
}

const carritoListaProductos = document.getElementById("carrito-lista-productos")
let masCarritoBtns = document.getElementsByClassName("carrito-mas-btn")
let menosCarritoBtns = document.getElementsByClassName("carrito-menos-btn")

const cargarCarrito = () => {
    carrito.forEach((producto) => {
        agregarProductoAlCarrito(producto, producto.cantidad, true)
    })
    document.getElementById("valor-total-carrito").innerText = `$ ${calcularMontoTotalCarrito()}`
}

const renderizarProductos = (productos) => {
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
                <button class="btn btn-primary comprar-producto-btn" type="button" name="${producto.id}">Añadir al carrito</button>
            </div>
        `
        productosContainer.appendChild(div)
    })

    const anadirAlCarritoBtns = document.getElementsByClassName("comprar-producto-btn")
    for (let btn of anadirAlCarritoBtns) {
        btn.addEventListener("click", () => {
            const productoOriginal = productos.find(producto => producto.id == btn.name);
            productoSeleccionado = new Producto(productoOriginal.id, productoOriginal.nombre, productoOriginal.precio, productoOriginal.cantidad, productoOriginal.ingredientes, productoOriginal.img, productoOriginal.html)
            productoSeleccionado.cantidad = 1
            if(productoSeleccionado == null || productoSeleccionado.cantidad <= 0) {
                Swal.fire({
                    title: "Producto no disponible",
                    icon: "error"
                });
            }
            else{
                agregarProductoAlCarrito(productoSeleccionado, 1)
                Swal.fire({
                    title: "Producto agregado",
                    icon: "success"
                });
            }
        })
    }
}

const cargarProductos = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`ERROR: ${res.ok}`);
        }
        
        const productosJson = await res.json();

        productos = productosJson.map(producto => new Producto(producto.id, producto.nombre, producto.precio, producto.cantidad, producto.ingredientes, producto.img, producto.html));

        renderizarProductos(productos);
        cargarCarrito();
  
    } catch (error) {
      console.error(error.message);
    }
}

function eliminarProductoDelCarrito(producto) {
    
    if(carrito.some((prod) => prod.id == producto.id)) {

        const productoCarrito = carrito.find((prod) => prod.id == producto.id)
        carrito.splice(carrito.indexOf(productoCarrito), 1)

        const divProducto = document.getElementById(`producto-${producto.id}`)
        divProducto.remove()
    }
    else{
        alert("No se encontro el producto en el carrito")
    }
    document.getElementById("valor-total-carrito").innerText = `$ ${calcularMontoTotalCarrito()}`
    guardarCarrito();
}

function agregarProductoAlCarrito(producto, cantidad, cargaLocalStorage = false) {
    if(carrito.some((prod) => prod.id == producto.id) && !cargaLocalStorage) {
        const productoCarrito = carrito.find((prod) => { 
            if(prod.id == producto.id){
                prod.cantidad += cantidad
                return prod
            }
        })
        document.getElementById(`carrito-item-cantidad-${producto.id}`).innerText = productoCarrito.cantidad
        document.getElementById(`carrito-item-precio-${producto.id}`).innerText = `$ ${productoCarrito.cantidad*productoCarrito.precio}`
    }
    else{
        const div = document.createElement("div")
        div.classList.add("carrito-item")
        div.classList.add("row")
        div.classList.add("gx-0")
        div.id = `producto-${producto.id}`

        producto.cantidad = cantidad
        div.innerHTML = `
            <div class="col-md-4">
                <img class="carrito-item-img" src="${producto.img}" alt="${producto.nombre}">
            </div>
            <div class="col-md-8 row gx-0 align-content-around">
                <span class="carrito-item-titulo col-md-12">${producto.nombre}</span>
                <div class="col-md-12 d-flex justify-content-between align-items-center">
                    <div class="carrito-item-botones d-flex align-items-center">
                        <button class="btn btn-primary carrito-eliminar-btn d-flex justify-content-center align-items-center" type="button"  name="${producto.id}" id="carrito-eliminar-btn-${producto.id}">
                            <img class="basura-img" src="../images/icon-eliminar.png" alt="Eliminar">
                        </button>
                        <button class="btn btn-primary  carrito-menos-btn d-flex justify-content-center align-items-center" type="button" name="${producto.id}" id="carrito-menos-btn-${producto.id}">
                            <img class="menos-img" src="../images/icon-menos.png" alt="Eliminar">
                        </button>
                        <span class="carrito-item-cantidad" id="carrito-item-cantidad-${producto.id}">${producto.cantidad}</span>
                        <button class="btn btn-primary carrito-mas-btn d-flex justify-content-center align-items-center" type="button" name="${producto.id}" id="carrito-mas-btn-${producto.id}">
                            <img class="mas-img" src="../images/icon-mas.png" alt="Eliminar">
                        </button>
                    </div>
                    <span class="carrito-item-precio" id="carrito-item-precio-${producto.id}">$ ${producto.precio*producto.cantidad}</span>
                </div>
            </div>
        `
        carritoListaProductos.appendChild(div)

        let masCarritoBtn = document.getElementById("carrito-mas-btn-"+producto.id)
        masCarritoBtn.addEventListener("click", () => {
            stockProducto = productos.find(producto => producto.id == masCarritoBtn.name).cantidad
            productoSeleccionado = carrito.find(producto => producto.id == masCarritoBtn.name)
            if(productoSeleccionado == null || productoSeleccionado.cantidad >= stockProducto) {
                Swal.fire({
                    title: "Producto no disponible",
                    icon: "error"
                });
            }
            else{
                agregarProductoAlCarrito(productoSeleccionado, 1)
            }
        })

        let menosCarritoBtn = document.getElementById("carrito-menos-btn-"+producto.id)
        menosCarritoBtn.addEventListener("click", () => {
            productoSeleccionado = carrito.find(producto => producto.id == masCarritoBtn.name)
            if(productoSeleccionado == null) {
                Swal.fire({
                    title: "Producto no disponible",
                    icon: "error"
                });
            }
            else if(productoSeleccionado.cantidad <= 1){
                eliminarProductoDelCarrito(productoSeleccionado)
            }
            else{
                agregarProductoAlCarrito(productoSeleccionado, -1)
            }
        })

        let eliminarCarritoBtn = document.getElementById("carrito-eliminar-btn-"+producto.id)
        eliminarCarritoBtn.addEventListener("click", () => {
            productoSeleccionado = carrito.find(producto => producto.id == eliminarCarritoBtn.name)
            if(productoSeleccionado == null) {
                Swal.fire({
                    title: "Producto no disponible",
                    icon: "error"
                });
            }
            else{
                Swal.fire({
                    title: "¿Estás seguro de eliminar el producto?",
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: "Eliminar",
                    denyButtonText: `Cancelar`
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminarProductoDelCarrito(productoSeleccionado)
                        Swal.fire("Producto eliminado", "", "success");
                    }
                });
                
            }
        })

        if(!cargaLocalStorage){
            carrito.push(producto)
        }
    }
    document.getElementById("valor-total-carrito").innerText = `$ ${calcularMontoTotalCarrito()}`

    if(!cargaLocalStorage){
        guardarCarrito();
    }
}

function calcularMontoTotalCarrito() {
    let total = 0
    for (let producto of carrito) {
        total += producto.precio*producto.cantidad
    }
    return total.toFixed(2)
}

const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

cargarProductos("../data/productos.json");
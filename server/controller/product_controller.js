var Productdb = require('../model/product');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs'); 


// Crear producto
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, precioCosto, precio, stock, categoria, marca, proveedor } = req.body;

    // Validaciones básicas
    if (!nombre || !precio || !precioCosto || !stock || !categoria || !marca) {
      return res.status(400).send({ message: "Faltan datos obligatorios" });
    }

    if (isNaN(precio) || isNaN(precioCosto) || isNaN(stock)) {
      return res.status(400).send({ message: "Precio, costo y stock deben ser números" });
    }

    if (Number(precio) < Number(precioCosto)) {
      return res.status(400).send({ message: "El precio de venta no puede ser menor al costo" });
    }

    // Validación de ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoria)) return res.status(400).send({ message: "ID de categoría inválido" });
    if (!mongoose.Types.ObjectId.isValid(marca)) return res.status(400).send({ message: "ID de marca inválido" });
    if (proveedor && !mongoose.Types.ObjectId.isValid(proveedor)) return res.status(400).send({ message: "ID de proveedor inválido" });

    // Imagen
    const rutasImagenes = req.files
      ? req.files.map(file => `/assets/img/${file.filename}`)
      : [];

    // Crear producto
    const product = new Productdb({
      nombre,
      descripcion: descripcion || "",
      precioCosto: Number(precioCosto),
      precio: Number(precio),
      stock: Number(stock),
      categoria,
      marca,
      proveedor: proveedor || null,
      fotos: rutasImagenes
    });

    const savedProduct = await product.save();
    res.status(201).redirect('/read-producto'); // redirige a la lista de productos
  } catch (err) {
    console.error("ERROR CREATE PRODUCT:", err);
    res.status(500).send({ message: err.message });
  }
};


// find
exports.find = (req,res)=>{
    if(req.query.id){
        Productdb.findById(req.query.id)
            .populate('marca')
            .populate('categoria')
            .populate({
                path: 'proveedor',
                match: { _id: { $exists: true } }
            })
            .then(data => res.send(data))
            .catch(err => {
                console.error("ERROR EN FIND:", err);
                res.status(500).send(err);
            })
    }else{
        Productdb.find()
            .populate('marca')
            .populate('categoria')
            .populate('proveedor')
            .then(data => res.send(data))
            .catch(err => res.status(500).send(err))
    }
}

// update

exports.update = async (req, res) => {
    try {
        const product = await Productdb.findById(req.params.id);

        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        const nuevoPrecio = req.body.precio ? Number(req.body.precio) : product.precio;
        const nuevoCosto = req.body.precioCosto ? Number(req.body.precioCosto) : product.precioCosto;

        if (nuevoPrecio < nuevoCosto) {
            return res.status(400).send({
                message: "El precio no puede ser menor al costo"
            });
        }
        // MANEJO DE IMÁGENES
        let fotosActuales = [...product.fotos];
        // 1. ELIMINAR IMÁGENES
        if (req.body.eliminarFotos) {
            const eliminar = Array.isArray(req.body.eliminarFotos)
                ? req.body.eliminarFotos
                : [req.body.eliminarFotos];
            eliminar.forEach(foto => {
                const ruta = path.join(__dirname, '../public', foto);
                if (fs.existsSync(ruta)) {
                    fs.unlinkSync(ruta);
                }
            });

            fotosActuales = fotosActuales.filter(f => !eliminar.includes(f));
        }

        // 2. REEMPLAZAR IMÁGENES INDIVIDUALES
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                if (key.startsWith('foto_')) {
                    const index = parseInt(key.split('_')[1]);
                    const file = req.files[key][0];

                    if (file && fotosActuales[index]) {
                        fotosActuales[index] = `/assets/img/${file.filename}`;
                    }
                }
            });
        }

        // 3. AGREGAR NUEVAS IMÁGENES
        if (req.files && req.files.nuevasFotos) {
            const nuevas = req.files.nuevasFotos.map(f => `/assets/img/${f.filename}`);
            fotosActuales = [...fotosActuales, ...nuevas];
        }

        // 4. LIMPIAR (PRO)
        fotosActuales = [...new Set(fotosActuales)]; // sin duplicados
        fotosActuales = fotosActuales.slice(0, 4);   // máximo 4

        // UPDATE FINAL
        const updated = await Productdb.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre || product.nombre,
                descripcion: req.body.descripcion || product.descripcion,
                precioCosto: nuevoCosto,
                precio: nuevoPrecio,
                stock: req.body.stock !== undefined ? Number(req.body.stock) : product.stock,
                categoria: req.body.categoria || product.categoria,
                marca: req.body.marca || product.marca,
                proveedor: req.body.proveedor || product.proveedor,
                fotos: fotosActuales
            },
            { new: true }
        );

        res.redirect('/read-producto');

    } catch (err) {
        console.error("ERROR UPDATE:", err);
        res.status(500).send(err);
    }
};

// delete
exports.delete = async (req, res) => {
    try {
        const data = await Productdb.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        res.send({ message: "Producto eliminado correctamente" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};



exports.searchApi = async (req, res) => {
    try {
        console.log("QUERY:", req.query);
        const search = req.query.search;

        // 🔒 VALIDACIÓN
        if (!search || search.trim().length < 2) {
            return res.status(400).send({
                message: "Mínimo 2 caracteres para buscar"
            });
        }

        // 🔥 QUERY OPTIMIZADO
        const productos = await Productdb.find({
            nombre: { $regex: search, $options: 'i' },
            stock: { $gt: 0 } // 👈 solo productos disponibles
        })
        .select('nombre precio stock') // 👈 SOLO lo necesario
        .limit(10) // 👈 CLAVE PARA PERFORMANCE
        .lean();

        res.send(productos);

    } catch (err) {

        console.error("ERROR SEARCH API:", err);

        res.status(500).send({
            message: "Error en búsqueda de productos"
        });
    }
};


exports.getKPI = async () => {
    try {
        const orders = await Order.find();

        let ventasTotales = 0;
        let productosVendidos = 0;

        orders.forEach(order => {
            ventasTotales += order.total;

            order.productos.forEach(p => {
                productosVendidos += p.cantidad;
            });
        });

        return {
            ventasTotales,
            productosVendidos,
            ordenes: orders.length
        };

    } catch (err) {
        console.error(err);
        return null;
    }
};


exports.getLowStockProducts = async () => {
    try {
        const lowStock = await Productdb.find({
            stock: { $lte: 5 }
        }).select('nombre stock');

        return lowStock;
    } catch (err) {
        console.error("ERROR LOW STOCK:", err);
        return [];
    }
};


exports.getTopProducts = async () => {
    try {
        const productos = await Productdb.find();

        return productos
            .map(p => {
                const vendidos = Math.max(0, 100 - p.stock);

                return {
                    name: p.nombre,
                    value: vendidos,
                    label: `${vendidos} ventas`
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

    } catch (err) {
        console.error("ERROR TOP PRODUCTS:", err);
        return [];
    }
};




exports.getLowProducts = async () => {
    try {
        const productos = await Productdb.find();

        return productos
            .map(p => {
                const vendidos = Math.max(0, 100 - p.stock);

                return {
                    name: p.nombre,
                    value: vendidos,
                    label: `${vendidos} ventas`
                };
            })
            .sort((a, b) => a.value - b.value)
            .slice(0, 5);

    } catch (err) {
        console.error("ERROR LOW PRODUCTS:", err);
        return [];
    }
};





exports.getTopMarginProducts = async () => {
    try {
        const productos = await Productdb.find();

        return productos
            .map(p => {
                const margen = p.precio - p.precioCosto;

                return {
                    name: p.nombre,
                    value: margen,
                    label: `$${margen}`
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

    } catch (err) {
        console.error("ERROR MARGIN:", err);
        return [];
    }
};




exports.getSalesByDay = async () => {
    return [
        { name: "Lunes", value: 1200, label: "$1,200", color: "green" },
        { name: "Martes", value: 1800, label: "$1,800", color: "green" },
        { name: "Miércoles", value: 900, label: "$900", color: "green" },
        { name: "Jueves", value: 1600, label: "$1,600", color: "green" }
    ];
};
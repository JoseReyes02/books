
const Publicaciones = require('../models/inmueble');
const Like = require('../models/likes')
const User = require('../models/usuarios')
const { v4 } = require('uuid');
module.exports = (io) => {
    io.on('connection', async (socket) => {
        const hoy = new Date();
        let dia = hoy.getDate();
        let mes = hoy.getMonth() + 1; // Los meses empiezan desde 0
        const año = hoy.getFullYear();
        // Aseguramos que día y mes tengan dos dígitos
        dia = dia < 10 ? '0' + dia : dia;
        mes = mes < 10 ? '0' + mes : mes;
        const fecha = `${dia}/${mes}/${año}`;

        const ahora = new Date();

        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();
        let segundos = ahora.getSeconds();

        // Aseguramos que todos los valores tengan dos dígitos
        horas = horas < 10 ? '0' + horas : horas;
        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;

        const hora = `${horas}:${minutos}:${segundos}`;



        //CARGA DE IMAGENES
        socket.on('client:cargarImagen', async data => {
            const imagenName = data.nombreImagen;
            const idPublicacion = data.idPublicacion;
            const uniqueID = v4();
            const fotos = ({
                id: uniqueID,
                imagen: imagenName,
            })
            Publicaciones.findByIdAndUpdate(idPublicacion, { $push: { fotos: fotos } }, { new: true })
                .then(async (publicacionActualizada) => {
                    if (!publicacionActualizada) {
                        console.log('Publicación no encontrada');
                        // Manejar el caso en el que no se encuentra la publicación
                    } else {

                        const findImagenes = await Publicaciones.findById(idPublicacion);
                        const fotos = findImagenes.fotos;
                        socket.emit('server:mostrarFotos', fotos)

                    }
                })
                .catch((error) => {
                    console.error('Error al agregar el comentario:', error);
                });



        });
        //GUARDAR PUBLICACION
        socket.on('client:guardarPublicacion', async data => {
            var titulo = data.titulo;
            const tipoPropiedad = data.tipoPropiedad;
            const restron = data.restron;
            const habitaciones = data.habitaciones
            const marquesinas = data.marquesinas;
            const moneda = data.moneda;
            const disponibilidad = data.disponibilidad;
            const precio = data.precio;
            const pais = data.pais;
            const provincia = data.provincia;
            const municipio = data.municipio;
            const direccion = data.direccion;
            const descripcion = data.descripcion;
            const idPublicacion = data.idPublicacion;
            const tipo_operacion = data.tipo_operacion
            const publicacion = await Publicaciones.findById(idPublicacion);
            const likeCount = 0
            const nombre = data.nombre;
            const direccionPersonal = data.direccionPersonal
            const telefono = data.telefono
            const email = data.email

            if (!titulo) {
                const message = 'Describa un titulo para la publicacion!'
                socket.emit('server:error', message)

            } else if (!precio) {
                const message = 'Describa un precio para la publicacion!'
                socket.emit('server:error', message)

            } else if (!direccion) {
                const message = 'Describa una direccion para la publicacion!'
                socket.emit('server:error', message)
            } else if (!telefono) {
                const message = 'Campo telefono es obligatorio!'
                socket.emit('server:error', message)
            }

            else {
                const fotos = publicacion.fotos;
                if (fotos.length <= 0) {
                    const message = 'Agrege imagenes a la publicacion!'
                    socket.emit('server:error', message)
                } else {
                    titulo = titulo.toUpperCase()
                    const estado = 'activa';
                    await Publicaciones.findByIdAndUpdate(idPublicacion, {
                        titulo, tipoPropiedad, restron, fecha, hora, nombre, email,
                        habitaciones, marquesinas, moneda, disponibilidad, precio, pais
                        , provincia, municipio, direccion, descripcion, estado, tipo_operacion, likeCount
                    })
                    socket.emit('server:publicacionGuardada')
                }
            }
        });


        //Actualizar publicacion
        socket.on('client:ActualizarPublicacion', async data => {
            var titulo = data.titulo;
            const tipoPropiedad = data.tipoPropiedad;
            const restron = data.restron;
            const habitaciones = data.habitaciones
            const marquesinas = data.marquesinas;
            const moneda = data.moneda;
            const disponibilidad = data.disponibilidad;
            const precio = data.precio;
            const pais = data.pais;
            const provincia = data.provincia;
            const municipio = data.municipio;
            const direccion = data.direccion;
            const descripcion = data.descripcion;
            const idPublicacion = data.idPublicacion;
            const tipo_operacion = data.tipo_operacion
            const publicacion = await Publicaciones.findById(idPublicacion);
            const nombre = data.nombre;
            const direccionPersonal = data.direccionPersonal
            const telefono = data.telefono
            const email = data.email

            if (!titulo) {
                const message = 'Describa un titulo para la publicacion!'
                socket.emit('server:error', message)

            } else if (!precio) {
                const message = 'Describa un precio para la publicacion!'
                socket.emit('server:error', message)

            } else if (!direccion) {
                const message = 'Describa una direccion para la publicacion!'
                socket.emit('server:error', message)
            } else if (!telefono) {
                const message = 'Campo telefono es obligatorio!'
                socket.emit('server:error', message)
            }

            else {
                const fotos = publicacion.fotos;
                if (fotos.length <= 0) {
                    const message = 'Agrege imagenes a la publicacion!'
                    socket.emit('server:error', message)
                } else {
                    titulo = titulo.toUpperCase()
                    const estado = 'activa';
                    await Publicaciones.findByIdAndUpdate(idPublicacion, {
                        titulo, tipoPropiedad, restron, fecha, hora, telefono, nombre, email,
                        habitaciones, marquesinas, moneda, disponibilidad, precio, pais
                        , provincia, municipio, direccion, descripcion, estado, tipo_operacion
                    })
                    socket.emit('server:publicacionGuardada')
                }
            }
        });


        socket.on('client:quitarImagen', async data => {

            const idImagen = data.idImagen;
            const idPublicacion = data.idPublicacion
            const publicaciones = await Publicaciones.findById(idPublicacion);
            const fotos = publicaciones.fotos
            for (i = 0; i < fotos.length; i++) {
                const id = fotos[i].id;
                if (id == idImagen) {
                    Publicaciones.findByIdAndUpdate(
                        idPublicacion,
                        { $pull: { fotos: { id: id } } }, // Elimina la imagen específica
                        { new: true }
                    )
                        .then(async (publicacionActualizada) => {
                            if (!publicacionActualizada) {
                                console.log('Publicación no encontrada');
                            } else {

                                const findImagenes = await Publicaciones.findById(idPublicacion);
                                const fotos = findImagenes.fotos;
                                socket.emit('server:mostrarFotos', fotos)

                            }
                        })
                        .catch((error) => {
                            console.error('Error al eliminar la imagen:', error);
                        });

                }
            }
            // console.log(publicaciones);
        });


        socket.on('client:abrirImagen', async data => {
            const idImagen = data.idImagen;
            const idPublicacion = data.idPublicacion
            const publicaciones = await Publicaciones.findById(idPublicacion);
            const fotos = publicaciones.fotos
            for (i = 0; i < fotos.length; i++) {
                const id = fotos[i].id;
                if (id == idImagen) {
                    const imagenName = fotos[i].imagen;
                    socket.emit('server:abrirImagen', imagenName, id)
                }
            }
            // console.log(publicaciones);
        })

        socket.on('client:changeImageProfile', async data => {
            const imagenName = data.imagenName;
            const idUsuario = data.idUsuario
            const usuario = await Publicaciones.findById(idUsuario);
            console.log('usuario', usuario)

            // console.log(publicaciones);
        })
        socket.on('client:like', async data => {
            const idUser = data.idUser;
            const idPublicacion = data.idPublicacion;

            const likes = await Like.findOne({ idPublicacion: idPublicacion, idUser: idUser })

            if (likes) {
                const idLike = likes.id;
                await Like.findByIdAndDelete(idLike);
                const publicacionLike = await Publicaciones.findById(idPublicacion)
                likeCount = publicacionLike.likeCount - 1;
                await Publicaciones.findByIdAndUpdate(idPublicacion, { likeCount });

                Publicaciones.findByIdAndUpdate(
                    idPublicacion,
                    { $pull: { saveUser: { idUser: idUser } } }, // Elimina la imagen específica
                    { new: true }
                )
                    .then(async (publicacionActualizada) => {
                        if (!publicacionActualizada) {
                            console.log('Publicación no encontrada');
                        } else {
                            const publicacion = await Publicaciones.findById(idPublicacion)
                            socket.emit('server:quitarMeGusta', idPublicacion, likeCount, publicacion)

                        }
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la imagen:', error);
                    });


            } else {

                const newLike = new Like({ idUser, idPublicacion })
                await newLike.save()
                const newIdPublicacion = newLike.id
                const publicacionLike = await Publicaciones.findById(idPublicacion)
                var likeCount = publicacionLike.likeCount + 1

                // likeCount = likeCount + 1
                const user = await User.findById(idUser)
                const nameUser = user.nombre + ' ' + user.apellido;
                const photo = user.photo;
                const saveUser = ({
                    name: nameUser,
                    photo: photo,
                    idUser: idUser
                })

                Publicaciones.findByIdAndUpdate(idPublicacion, { $push: { saveUser: saveUser } }, { new: true })
                    .then(async (publicacionActualizada) => {
                        if (!publicacionActualizada) {
                            console.log('Publicación no encontrada');
                            // Manejar el caso en el que no se encuentra la publicación
                        } else {
                            await Publicaciones.findByIdAndUpdate(idPublicacion, { likeCount });
                            const publicacion = await Publicaciones.findById(idPublicacion)
                            socket.emit('server:ponerMeGusta', idPublicacion, likeCount, publicacion)
                        }
                    })
                    .catch((error) => {
                        console.error('Error al agregar el comentario:', error);
                    });

            }

            // console.log(publicaciones);
        })

        socket.on('client:quitarGuardado', async data => {

            const idUser = data.idUser;
            const idPublicacion = data.idPublicacion;
            const likes = await Like.findOne({ idPublicacion: idPublicacion, idUser: idUser })

            if (likes) {
                const idLike = likes.id;
                await Like.findByIdAndDelete(idLike);
                const publicacionLike = await Publicaciones.findById(idPublicacion);
                likeCount = publicacionLike.likeCount - 1;
                await Publicaciones.findByIdAndUpdate(idPublicacion, { likeCount });

                Publicaciones.findByIdAndUpdate(
                    idPublicacion,
                    { $pull: { saveUser: { idUser: idUser } } }, 
                    { new: true }
                )
                    .then(async (publicacionActualizada) => {
                        if (!publicacionActualizada) {
                            console.log('Publicación no encontrada');
                        } else {
                            console.log('publicacion Actualizada')
                    
                           

                            socket.emit('server:quitarGuardado', idPublicacion)

                        }
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la imagen:', error);
                    });


            }


        })
        //QIOTAR PUBLICACION
        socket.on('client:quitarPublicacion', async data => {
            const id = data.id
            const publicacion = await Publicaciones.findById(id);
            const idUser = publicacion.idUsuario;
            const publicacionesUsuario = await Publicaciones.find({ idUsuario: idUser, estado: 'activa' });
            const estado = 'quitada';
            await Publicaciones.findByIdAndUpdate(id, { estado })
            socket.emit('server:quitarPublicacion', publicacionesUsuario)
            // console.log(publicaciones);
        })

        socket.on('client:filtrarInmueble', async data => {
            const provincia = data.provincia;
            const municipio = data.municipio;
            const tipo_inmueble = data.tipo_inmueble



            if (provincia && !municipio && !tipo_inmueble) {
                const findInmueble = await Publicaciones.find({ provincia: provincia, estado: 'activa' });
                if (findInmueble && findInmueble.length > 0) {

                    socket.emit('server:filtrarInmueble', findInmueble)
                } else {

                    socket.emit('server:filtrarInmuebleError')
                }


            } else if (provincia && municipio) {
                const findInmueble = await Publicaciones.find({ provincia: provincia, municipio: municipio, estado: 'activa' })
                if (findInmueble && findInmueble.length > 0) {

                    socket.emit('server:filtrarInmueble', findInmueble)
                } else {

                    socket.emit('server:filtrarInmuebleError')
                }

            } else if (provincia && tipo_inmueble) {
                const findInmueble = await Publicaciones.find({ provincia: provincia, tipoPropiedad: tipo_inmueble, estado: 'activa' })
                if (findInmueble && findInmueble.length > 0) {

                    socket.emit('server:filtrarInmueble', findInmueble)
                } else {

                    socket.emit('server:filtrarInmuebleError')
                }


            } else if (municipio && tipo_inmueble) {
                const findInmueble = await Publicaciones.find({ municipio: municipio, tipoPropiedad: tipo_inmueble, estado: 'activa' })
                if (findInmueble && findInmueble.length > 0) {

                    socket.emit('server:filtrarInmueble', findInmueble)
                } else {

                    socket.emit('server:filtrarInmuebleError')
                }

            } else if (municipio && !provincia && !tipo_inmueble) {
                const findInmueble = await Publicaciones.find({ municipio: municipio, estado: 'activa' })
                if (findInmueble && findInmueble.length > 0) {

                    socket.emit('server:filtrarInmueble', findInmueble)
                } else {

                    socket.emit('server:filtrarInmuebleError')
                }


            } else if (tipo_inmueble && !municipio && !provincia) {
                const findInmueble = await Publicaciones.find({ tipoPropiedad: tipo_inmueble, estado: 'activa' })
                if (findInmueble && findInmueble.length > 0) {

                    socket.emit('server:filtrarInmueble', findInmueble)
                } else {

                    socket.emit('server:filtrarInmuebleError')
                }


            } else if (provincia && municipio && tipo_inmueble) {
                const findInmueble = await Publicaciones.find({ provincia: provincia, tipoPropiedad: tipo_inmueble, municipio: municipio, estado: 'activa' })
                if (findInmueble && findInmueble.length > 0) {

                    socket.emit('server:filtrarInmueble', findInmueble)
                } else {

                    socket.emit('server:filtrarInmuebleError')
                }


            }
        })



    });
};
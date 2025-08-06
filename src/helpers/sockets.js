

const User = require('../models/usuarios');

const Notification = require('../models/notifications')
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

        socket.on('client:newMessage', async (data) => {
            const idChat = data.idchat;
            const mensaje = data.mensaje;
            const idUser = data.idUser;

            const chat = await Conversacion.findById(idChat);
            const userEmisor = chat.userEmisor;
            const userReceptor = chat.userReceptor;

            const userquery = await User.findById(idUser);

            var NameUserSend = userquery.nombre
            var estado = 'noleido'
            var photo = userquery.photo;
            var datosMensaje = ({
                mensaje: mensaje,
                NameUserSend: NameUserSend,
                photo: photo,
                fecha: fecha,
                hora: hora,
                userEmisor: idUser,
                userReceptor: userReceptor,
            })
            Conversacion.findByIdAndUpdate(idChat, { $push: { mensajes: datosMensaje } }, { new: true })
                .then(async (publicacionActualizada) => {
                    if (!publicacionActualizada) {
                        console.log('Chat no encontrado');
                        // Manejar el caso en el que no se encuentra la publicación
                    } else {

                        const notificacionChat = await Notification.findOne({ idConversacion: idChat })
                        const ultimoId = idUser
                        if (notificacionChat) {
                            const findUserEmisor = await User.findById(userEmisor)
                            const nombreUserEmisor = await findUserEmisor.nombre;
                            const findUserReceptor = await User.findById(userReceptor)
                            const nombreUserReceptor = findUserReceptor.nombre

                            await Notification.findByIdAndUpdate(notificacionChat.id, { mensaje, ultimoId, nombreUserEmisor, nombreUserReceptor })
                            const notificaciones = await Notification.find({ estado: 'noleido' });
                            var cantidad = await Notification.find({ idUser: userEmisor, estado: 'noleido' }).count();
                            const query = await Conversacion.findById(idChat);
                            io.emit('server:mensaje', query, cantidad, notificaciones, idChat, idUser);

                        } else {
                            const findUserEmisor = await User.findById(userEmisor)
                            const nombreUserEmisor = await findUserEmisor.nombre;
                            const findUserReceptor = await User.findById(userReceptor)
                            const nombreUserReceptor = findUserReceptor.nombre

                            const idConversacion = idChat;
                            const newNotification = new Notification({
                                mensaje, fecha, estado, photo, idConversacion, idUser, userReceptor, nombreUserEmisor, nombreUserReceptor
                            })
                            await newNotification.save();
                            const notificaciones = await Notification.find({ estado: 'noleido' });

                            var cantidad = await Notification.find({ idUser: userEmisor, estado: 'noleido' }).count();
                            const query = await Conversacion.findById(idChat);
                            io.emit('server:mensaje', query, cantidad, notificaciones, idChat, idUser);
                        }


                    }
                })
                .catch((error) => {
                    console.error('Error al agregar el comentario:', error);
                    // Manejar el error según tus necesidades
                });





        })


    });
};
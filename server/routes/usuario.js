const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
// const { verificaToken } = require('../middlewares/autenticacion');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const { verificaToken, esAdminRole, tieneRole } = require('../middlewares');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let filtros = {
        estado: true
    };

    //console.log(desde, limite, filtros);

    Usuario.find(filtros, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments(filtros, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo

                });
            });

        });

});

app.post('/usuario', verificaToken, function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [verificaToken, tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'NOSE_ROLE')], function(req, res) {

    let id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, context: 'query' }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;
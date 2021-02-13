const { response } = require('express');

const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin verificar el token primero'
        });
    }

    const { role, nombre } = req.usuario;

    console.log(req.usuario);
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        });
    }
    next();
}

module.exports = {
    esAdminRole
}
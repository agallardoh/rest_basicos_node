const autenticacion = require('../middlewares/autenticacion');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {

    ...autenticacion,
    ...validaRoles
}
//========================
// Puerto
//========================

process.env.port = process.env.port || 3000;


//========================
// Vencimiento del token
//========================
//60 Segundos
//60 Minutos
//24 Horas
//30 Dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//========================
// SEED de autenciacion
//========================

process.env.SEED = process.env.SEED || 'secretDesa';
function verificarSesion(req, res, next) {
    if (req.session && req.session.usuario) {
        // Si hay usuario, le dejamos pasar a la siguiente función
        return next();
    }
    
    // Si no hay usuario, cortamos la petición aquí mismo
    console.log("⚠️ Intento bloqueado por el Middleware: Usuario no autenticado.");
    return res.status(401).json({ error: 'Debes iniciar sesión para sincronizar en la nube.' });
}

module.exports = verificarSesion;
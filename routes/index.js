var express = require('express');
var router = express.Router();

const verificarSesion = require('../middlewares/auth');

let baseDatosHistorial = []; 
let usuariosRegistrados = [
    { usuario: 'Admin', password: '1234' }
];

router.get('/', (req, res) => res.render('index', { titulo: 'Inicio' }));
router.get('/mapa', (req, res) => res.render('mapa', { titulo: 'Mapa' }));
router.get('/historial', (req, res) => res.render('historial', { titulo: 'Historial' }));

router.get('/login', (req, res) => res.render('login', { titulo: 'Iniciar Sesión', error: null }));

router.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    
    const usuarioEncontrado = usuariosRegistrados.find(u => u.usuario === usuario);

    if (usuarioEncontrado && usuarioEncontrado.password === password) {
        req.session.usuario = usuario; 
        res.redirect('/?login=success'); 
    } else {
        console.log("Intento de login fallido para:", usuario);
        res.render('login', { titulo: 'Iniciar Sesión', error: 'Usuario o contraseña incorrectos' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error al cerrar sesion:', error);
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        return res.redirect('/?logout=success');
    });
});

router.post('/api/guardar', verificarSesion, (req, res) => {
    baseDatosHistorial.push({ usuario: req.session.usuario, datos: req.body });
    console.log(`Sincronizado en la nube para el usuario [${req.session.usuario}]:`, req.body);
    res.status(200).json({ mensaje: 'Guardado en la nube correctamente' });
});

module.exports = router;
document.addEventListener('DOMContentLoaded', () => {

    // --- 🌟 ALERTAS SWEETALERT2 🌟 ---
    
    // 1. Alerta de Bienvenida al iniciar sesión
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
        Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente. Sincronización en la nube activada.',
            timer: 2500, // Se cierra solo a los 2.5 segundos
            showConfirmButton: false,
            backdrop: `rgba(0,0,123,0.4)` // Fondo oscurecido azulado
        });
        // Limpiamos la URL para que no siga saliendo "?login=success" al recargar
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (urlParams.get('logout') === 'success') {
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: 'Usuario desconectado correctamente',
            showConfirmButton: false,
            timer: 2200,
            timerProgressBar: true
        });

        window.history.replaceState({}, document.title, window.location.pathname);
    }

// 2. Alerta de Confirmación al Desconectar
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            Swal.fire({
                title: '¿Cerrar sesión?',
                text: "Tus nuevos aparcamientos solo se guardarán en este dispositivo.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545', 
                cancelButtonColor: '#6c757d',  
                confirmButtonText: '<i class="bi bi-box-arrow-right me-1"></i> Sí, desconectar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace('/logout'); 
                }
            });
        });
    }

    // --- 🚗 LÓGICA DE LA APLICACIÓN 🚗 ---

    const btnAparcar = document.getElementById('btn-aparcar');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const timerDisplay = document.getElementById('timer');
    const distDisplay = document.getElementById('distancia-texto');
    const infoAparcado = document.getElementById('info-aparcado');

    let intervaloCrono;

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371e3; 
        const phi1 = lat1 * Math.PI/180;
        const phi2 = lat2 * Math.PI/180;
        const deltaPhi = (lat2-lat1) * Math.PI/180;
        const deltaLambda = (lon2-lon1) * Math.PI/180;
        const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                  Math.cos(phi1) * Math.cos(phi2) *
                  Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.round(R * c);
    }

    // --- LÓGICA DE LA PÁGINA DE INICIO ---
    function actualizarSeguimiento() {
        const coche = JSON.parse(localStorage.getItem('cocheAparcado'));
        if (!coche) return;

        // Tiempo
        const diff = Date.now() - coche.timestamp;
        const horas = Math.floor(diff / 3600000).toString().padStart(2,'0');
        const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2,'0');
        const segs = Math.floor((diff % 60000) / 1000).toString().padStart(2,'0');
        if(timerDisplay) timerDisplay.innerText = `${horas}:${mins}:${segs}`;

        // Distancia
        navigator.geolocation.getCurrentPosition(pos => {
            const d = calcularDistancia(pos.coords.latitude, pos.coords.longitude, coche.lat, coche.lng);
            if(distDisplay) distDisplay.innerText = d;
        });
    }

    if (btnAparcar) {
        if (localStorage.getItem('cocheAparcado')) {
            btnAparcar.classList.add('d-none');
            btnFinalizar.classList.remove('d-none');
            infoAparcado.classList.remove('d-none');
            intervaloCrono = setInterval(actualizarSeguimiento, 1000);
        }

        btnAparcar.addEventListener('click', () => {
            btnAparcar.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Obteniendo ubicación...';
            btnAparcar.disabled = true;

            navigator.geolocation.getCurrentPosition(pos => {
                const datos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    timestamp: Date.now(),
                    fecha: new Date().toLocaleString()
                };
                
                // Persistencia Local
                localStorage.setItem('cocheAparcado', JSON.stringify(datos));

                // Persistencia Remota
                fetch('/api/guardar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                }).catch(err => console.error("Error al sincronizar:", err));

                location.reload();
            }, err => {
                alert('Activa el GPS y concede permisos para aparcar.');
                btnAparcar.innerHTML = '<i class="bi bi-pin-map-fill me-2"></i>Aparcar Vehículo Aquí';
                btnAparcar.disabled = false;
            }, { enableHighAccuracy: true });
        });
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            const actual = JSON.parse(localStorage.getItem('cocheAparcado'));
            if (actual) {
                let historial = JSON.parse(localStorage.getItem('historial')) || [];
                historial.push(actual);
                localStorage.setItem('historial', JSON.stringify(historial));
            }
            localStorage.removeItem('cocheAparcado');
            location.reload();
        });
    }

    // --- LÓGICA DEL MAPA ---
    const contenedorMapa = document.getElementById('map');
    if (contenedorMapa) {
        const coche = JSON.parse(localStorage.getItem('cocheAparcado'));
        
        if (!coche) {
            document.getElementById('alerta-mapa').classList.remove('d-none');
            contenedorMapa.parentElement.style.display = 'none'; // Ajuste sutil aquí para ocultar bien el cristal
        } else {
            const map = L.map('map').setView([coche.lat, coche.lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            const markerCoche = L.marker([coche.lat, coche.lng]).addTo(map)
                .bindPopup("<div class='text-center'><b>Vehículo</b><br><small class='text-muted'>Ubicación Registrada</small></div>").openPopup();

            navigator.geolocation.watchPosition(pos => {
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;
                
                L.circleMarker([userLat, userLng], {
                    color: '#0d6efd',
                    fillColor: '#0d6efd', 
                    fillOpacity: 0.6, 
                    radius: 8,
                    weight: 2
                }).addTo(map).bindPopup("Tu ubicación actual");

                const group = new L.featureGroup([markerCoche, L.marker([userLat, userLng])]);
                map.fitBounds(group.getBounds().pad(0.1));
            }, null, { enableHighAccuracy: true });
        }
    }

    // --- LÓGICA DEL HISTORIAL ---
    const tablaHistorial = document.getElementById('tabla-historial');
    if (tablaHistorial) {
        const historial = JSON.parse(localStorage.getItem('historial')) || [];
        const mensajeVacio = document.getElementById('sin-datos');

        if (historial.length === 0) {
            mensajeVacio.classList.remove('d-none');
        } else {
            historial.reverse().forEach((item) => {
                const fila = `
                    <tr>
                        <td class="ps-4 fw-medium text-dark">${item.fecha}</td>
                        <td><code class="text-secondary bg-white border px-2 py-1 rounded shadow-sm">${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}</code></td>
                        <td class="text-end pe-4">
                            <a href="/mapa" class="btn btn-sm btn-outline-primary shadow-sm btn-hover-scale">
                                <i class="bi bi-map me-1"></i>Ver Mapa
                            </a>
                        </td>
                    </tr>
                `;
                tablaHistorial.innerHTML += fila;
            });
        }

        const btnBorrar = document.getElementById('btn-borrar-historial');
        if (btnBorrar) {
            btnBorrar.addEventListener('click', () => {
                // Aquí también podríamos usar SweetAlert, pero de momento dejamos el confirm nativo para no recargarlo
                if(confirm('¿Confirmas que deseas eliminar todo el historial de registros? Esta acción no se puede deshacer.')) {
                    localStorage.removeItem('historial');
                    location.reload();
                }
            });
        }
    }
});
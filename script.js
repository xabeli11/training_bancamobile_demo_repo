/**
 * MÓDULO DE FECHA Y HORA
 * =====================================================
 * Actualiza la fecha y hora en tiempo real en la página
 */

/**
 * Actualiza el elemento de fecha y hora con la fecha/hora actual
 * Formatea la fecha en español con opción de incluir día de semana, hora y minutos
 * 
 * @function updateDateTime
 * @returns {void}
 * 
 * @example
 * updateDateTime(); // Actualiza el elemento con id 'dateTime'
 */
function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    const now = new Date();
    
    // Opciones de formato para toLocaleDateString
    // Genera formato como "lunes, 9 de febrero de 2026, 14:35:23"
    const options = {
        weekday: 'long',      // Día de la semana completo
        year: 'numeric',      // Año de 4 dígitos
        month: 'long',        // Mes completo
        day: 'numeric',       // Día del mes
        hour: '2-digit',      // Hora con 2 dígitos
        minute: '2-digit',    // Minutos con 2 dígitos
        second: '2-digit'     // Segundos con 2 dígitos
    };
    
    // Formatea la fecha en español
    const formattedDate = now.toLocaleDateString('es-ES', options);
    
    // Asigna la fecha formateada al elemento en el DOM
    dateTimeElement.textContent = formattedDate;
}

// Llamar la función al cargar la página
updateDateTime();

// Actualizar la fecha y hora cada segundo (1000ms)
setInterval(updateDateTime, 1000);


/**
 * MÓDULO DE FORMULARIOS Y EVENTOS
 * =====================================================
 * Maneja los eventos del formulario de transferencias y otros controles
 */

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // --- MANEJO DEL FORMULARIO DE TRANSFERENCIAS ---
    const transferForm = document.querySelector('.transfer-form');
    
    if (transferForm) {
        /**
         * Evento de envío del formulario de transferencias
         * Valida los campos y simula el envío de la transferencia
         * 
         * @event submit
         * @listens .transfer-form
         */
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Previene el envío por defecto del formulario
            
            // Obtiene los valores de los campos del formulario
            const fromAccount = document.getElementById('from-account').value;
            const recipient = document.getElementById('recipient').value;
            const accountNumber = document.getElementById('account-number').value;
            const amount = document.getElementById('amount').value;
            const concept = document.getElementById('concept').value;
            
            // VALIDACIÓN: Verifica que todos los campos requeridos estén completos
            if (!fromAccount || !recipient || !accountNumber || !amount) {
                alert('Por favor, completa todos los campos requeridos');
                return;
            }
            
            // VALIDACIÓN: Verifica que el monto sea mayor a 0
            if (parseFloat(amount) <= 0) {
                alert('El monto debe ser mayor a 0');
                return;
            }
            
            // Si las validaciones pasan, muestra notificación de éxito
            // y limpia el formulario
            showNotification(`Transferencia de $${amount} a ${recipient} realizada exitosamente`, 'success');
            transferForm.reset();
        });
    }
    
    // --- MANEJO DE BOTONES DE LOGOUT ---
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        /**
         * Evento click para botones
         * Si es un botón de logout, llama a la función handleLogout
         * 
         * @event click
         * @listens .btn
         */
        button.addEventListener('click', function(e) {
            if (this.id === 'logout' || this.classList.contains('logout-btn')) {
                e.preventDefault();
                handleLogout();
            }
        });
    });
});


/**
 * MÓDULO DE NOTIFICACIONES
 * =====================================================
 * Muestra notificaciones emergentes en la esquina superior derecha
 */

/**
 * Muestra una notificación emergente temporal en la página
 * Las notificaciones se desvanecen automáticamente después de 3 segundos
 * 
 * @function showNotification
 * @param {string} message - Texto del mensaje a mostrar
 * @param {string} [type='info'] - Tipo de notificación: 'success', 'error', 'info', 'warning'
 * @returns {void}
 * 
 * @example
 * showNotification('Operación completada', 'success');
 * showNotification('Error en la conexión', 'error');
 * showNotification('Este es un aviso', 'warning');
 */
function showNotification(message, type = 'info') {
    // Crea un nuevo elemento div para la notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Define los estilos CSS para las notificaciones
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos base para notificaciones */
        .notification {
            position: fixed;              /* Posición fija en la pantalla */
            top: 20px;                    /* 20px desde el tope */
            right: 20px;                  /* 20px desde la derecha */
            padding: 1rem 1.5rem;         /* Espaciado interno */
            border-radius: 6px;           /* Bordes redondeados */
            color: white;                 /* Texto blanco */
            font-weight: 500;             /* Texto más grueso */
            z-index: 2000;                /* Por encima de otros elementos */
            animation: slideInRight 0.3s ease;  /* Animación de entrada */
        }
        
        /* Colores según el tipo de notificación */
        .notification-success {
            background-color: #10b981;    /* Verde para éxito */
        }
        
        .notification-error {
            background-color: #ef4444;    /* Rojo para error */
        }
        
        .notification-info {
            background-color: #2563eb;    /* Azul para información */
        }
        
        .notification-warning {
            background-color: #f59e0b;    /* Naranja para advertencia */
        }
        
        /* Animación de entrada desde la derecha */
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    
    // Agrega el estilo al documento si aún no existe
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    // Agrega la notificación al cuerpo de la página
    document.body.appendChild(notification);
    
    // Después de 3 segundos, inicia la animación de salida
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        
        // Elimina la notificación del DOM después de la animación
        setTimeout(() => {
            notification.remove();
        }, 300); // 300ms es la duración de la animación inversa
    }, 3000); // 3 segundos antes de que desaparezca
}

/**
 * MÓDULO DE SESIÓN
 * =====================================================
 * Maneja el cierre de sesión del usuario
 */

/**
 * Maneja el cierre de sesión del usuario
 * Solicita confirmación, muestra una notificación y simula el logout
 * 
 * @function handleLogout
 * @returns {void}
 * 
 * @example
 * handleLogout(); // Abre diálogo de confirmación
 */
function handleLogout() {
    // Solicita confirmación al usuario
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Muestra notificación de éxito
        showNotification('Sesión cerrada correctamente', 'success');
        
        // Después de 1 segundo, simula la redirección
        setTimeout(() => {
            // En una aplicación real, aquí se redireccionaría a la página de login
            // Ejemplo: window.location.href = '/login';
            alert('Redireccionando a página de login...');
        }, 1000);
    }
    // Si el usuario cancela, no hace nada
}


/**
 * MÓDULO DE VALIDACIÓN DE ENTRADA
 * =====================================================
 * Valida y formatea los datos de entrada del usuario
 */

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // --- VALIDACIÓN: Número de Cuenta ---
    const accountInput = document.getElementById('account-number');
    if (accountInput) {
        /**
         * Evento input para validar el número de cuenta
         * Solo permite números y guiones
         * 
         * @event input
         * @listens #account-number
         */
        accountInput.addEventListener('input', function() {
            // Reemplaza caracteres que no sean números o guiones
            // Expresión regular: [^0-9\-] significa "cualquier carácter que NO sea número o guión"
            this.value = this.value.replace(/[^0-9\-]/g, '');
        });
    }
    
    // --- VALIDACIÓN: Monto ---
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        /**
         * Evento change para formatear el monto
         * Convierte el valor a número con 2 decimales
         * 
         * @event change
         * @listens #amount
         */
        amountInput.addEventListener('change', function() {
            // Convierte a número decimal y formatea con 2 decimales
            this.value = parseFloat(this.value).toFixed(2);
        });
    }
});


/**
 * MÓDULO DE NAVEGACIÓN
 * =====================================================
 * Maneja la navegación suave entre secciones
 */

/**
 * Agrega evento click a todos los enlaces internos
 * Permite navegación suave con scroll animado
 * 
 * @event click
 * @listens a[href^="#"]
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Previene el comportamiento por defecto del enlace
        
        // Obtiene el elemento destino basado en el href
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Realiza un scroll suave (smooth) hacia el elemento destino
            target.scrollIntoView({
                behavior: 'smooth',  // Animación suave
                block: 'start'       // Alinea el elemento al inicio de la ventana
            });
        }
    });
});


/**
 * MÓDULO DE ANIMACIONES
 * =====================================================
 * Maneja efectos visuales y animaciones de carga
 */

/**
 * Anima la carga de la página
 * Inicia con opacidad 0 y transiciona a 1 (fade in)
 * 
 * @event load
 * @listens window
 */
window.addEventListener('load', function() {
    // Establece la opacidad inicial en 0 (transparente)
    document.body.style.opacity = '0';
    
    // Habilita la transición CSS para un fade suave
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Después de 100ms, cambia la opacidad a 1 (visible)
    // Esto crea un efecto de fade in suave
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});


/**
 * MÓDULO DE DETECCIÓN DE DISPOSITIVOS
 * =====================================================
 * Detecta el tipo de dispositivo y aplica ajustes
 */

/**
 * Detecta si el navegador se está ejecutando en un dispositivo móvil
 * Utiliza la cadena del User Agent para identificar dispositivos comunes
 * 
 * @function isMobileDevice
 * @returns {boolean} true si es un dispositivo móvil, false en caso contrario
 * 
 * @example
 * if (isMobileDevice()) {
 *     console.log('El usuario está en un dispositivo móvil');
 * }
 */
function isMobileDevice() {
    // Expresión regular que detecta agents comunes de dispositivos móviles
    // Incluye: Android, iOS (iPhone, iPad, iPod), BlackBerry, Opera Mini, etc.
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Si el dispositivo es móvil, agrega una clase CSS al body
// Esto permite aplicar estilos específicos para móviles si es necesario
if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
}


/**
 * MÓDULO DE UTILIDADES
 * =====================================================
 * Funciones auxiliares para demostración y análisis
 */

/**
 * Simula movimientos de cuenta para demostración
 * Retorna un array de objetos con información de transacciones
 * 
 * @function simulateAccountMovements
 * @returns {Array<Object>} Array de movimientos de cuenta
 * @returns {string} returns[].date - Fecha y hora de la transacción
 * @returns {string} returns[].concept - Descripción de la transacción
 * @returns {string} returns[].type - Tipo de transacción ('debit' o 'credit')
 * @returns {string} returns[].amount - Monto de la transacción
 * @returns {string} returns[].balance - Saldo después de la transacción
 * 
 * @example
 * const movements = simulateAccountMovements();
 * console.log(movements); // Muestra los movimientos simulados
 */
function simulateAccountMovements() {
    const movements = [
        { 
            date: '09/02/2026 14:35', 
            concept: 'Transferencia a Carlos López', 
            type: 'debit', 
            amount: '-$500.00', 
            balance: '$5,850.00' 
        },
        { 
            date: '08/02/2026 10:15', 
            concept: 'Depósito de nómina', 
            type: 'credit', 
            amount: '+$3,200.00', 
            balance: '$6,350.00' 
        }
    ];
    return movements;
}

/**
 * Exporta los datos de transacciones a un archivo CSV
 * Descarga un archivo con todas las transacciones de la tabla
 * 
 * @function exportTransactions
 * @returns {void}
 * 
 * @example
 * exportTransactions(); // Descarga un archivo 'transacciones.csv'
 */
function exportTransactions() {
    // Inicia el contenido CSV con los encabezados
    const csv = 'Fecha,Concepto,Tipo,Monto,Saldo\n';
    
    // Obtiene todas las filas de la tabla de transacciones
    const rows = document.querySelectorAll('.transaction-table tbody tr');
    
    // Itera sobre cada fila y agrega los datos al CSV
    rows.forEach(row => {
        // Obtiene todas las celdas de la fila
        const cells = row.querySelectorAll('td');
        
        // Convierte cada celda en una cadena entrecomillada
        // Separa cada celda con una coma (formato CSV)
        const rowData = Array.from(cells)
            .map(cell => `"${cell.textContent.trim()}"`)
            .join(',');
        
        // Agrega la fila al CSV con un salto de línea
        csv += rowData + '\n';
    });
    
    // Crea un Blob (Binary Large Object) con el contenido CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    
    // Crea una URL temporal para el Blob
    const url = window.URL.createObjectURL(blob);
    
    // Crea un elemento <a> temporal para descargar
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transacciones.csv'; // Nombre del archivo a descargar
    
    // Agrega el elemento al documento (necesario para algunos navegadores)
    document.body.appendChild(a);
    
    // Simula un click en el elemento para iniciar la descarga
    a.click();
    
    // Limpia los recursos
    window.URL.revokeObjectURL(url); // Libera la URL temporal
    a.remove();                       // Elimina el elemento del documento
}

/**
 * INFORMACIÓN DE CONSOLA
 * =====================================================
 * Información de depuración en la consola del navegador
 */

// Mensajes informativos en la consola para identificar la aplicación
console.log('BancaMobile - Página Web de Demostración');
console.log('Versión 1.0');
console.log('Para usar funcionalidades reales, conectar con backend');

/**
 * NOTAS DE DESARROLLO
 * =====================================================
 * 
 * Esta es una aplicación de DEMOSTRACIÓN. Las funcionalidades siguientes
 * son simuladas y necesitan un backend real para funcionar:
 * 
 * 1. TRANSFERENCIAS: Actualmente solo valida los datos localmente.
 *    En producción, se debe conectar con una API de transferencias.
 * 
 * 2. LOGOUT: Solo muestra una notificación.
 *    En producción, se debe enviar una petición al servidor para cerrar sesión.
 * 
 * 3. SALDOS: Los saldos mostrados son datos estáticos.
 *    En producción, se deben obtener de una base de datos.
 * 
 * 4. HISTORIAL: Las transacciones son datos de ejemplo.
 *    En producción, se deben obtener del servidor.
 * 
 * PRÓXIMAS MEJORAS:
 * - Conectar con API Backend
 * - Agregar autenticación real
 * - Implementar persistencia de datos
 * - Agregar más validaciones
 * - Mejorar seguridad (CSRF, HTTPS, etc.)
 */

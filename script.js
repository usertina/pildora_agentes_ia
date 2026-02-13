document.addEventListener('DOMContentLoaded', () => {
    // ===== SIMULACIÓN DE AGENTE =====
    const simulateAgentBtn = document.getElementById('simulateAgentBtn');
    const agentLog = document.getElementById('agentLog');

    if (simulateAgentBtn) {
        simulateAgentBtn.addEventListener('click', () => {
            agentLog.innerHTML = '<div class="log-entry system">[SISTEMA] Agente iniciado...</div>';
            
            const steps = [
                { type: 'system', text: '[SISTEMA] Escuchando nuevo email...' },
                { type: 'user', text: '[EMAIL] De: cliente@empresa.com | Asunto: URGENTE: Problema de seguridad' },
                { type: 'assistant', text: '[AGENTE] 🧠 Analizando contenido del email...' },
                { type: 'action', text: '[ACCIÓN] Buscando palabras clave: "URGENTE", "seguridad", "problema"' },
                { type: 'assistant', text: '[AGENTE] 🤔 Determinando prioridad: ALTA' },
                { type: 'assistant', text: '[AGENTE] ❓ Decisión: Este email requiere notificación inmediata' },
                { type: 'action', text: '[ACCIÓN] Enviando notificación push al usuario...' },
                { type: 'system', text: '[SISTEMA] ✅ Notificación enviada' },
                { type: 'assistant', text: '[AGENTE] 📁 Archivando email en carpeta "Urgentes"' },
                { type: 'system', text: '[SISTEMA] ✅ Tarea completada en 2.3s' }
            ];

            let i = 0;
            const interval = setInterval(() => {
                if (i < steps.length) {
                    const entry = document.createElement('div');
                    entry.className = `log-entry ${steps[i].type}`;
                    entry.textContent = steps[i].text;
                    agentLog.appendChild(entry);
                    agentLog.scrollTop = agentLog.scrollHeight;
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 500);
        });
    }

    // ===== SETTINGS WHEEL FUNCTIONALITY =====
    const settingsWheel = document.getElementById('settingsWheel');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const resetSettingsBtn = document.getElementById('resetSettings');

    // Abrir/cerrar panel de ajustes
    if (settingsWheel && settingsPanel) {
        settingsWheel.addEventListener('click', () => {
            settingsPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeSettings.addEventListener('click', () => {
            settingsPanel.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Cerrar al hacer clic fuera del panel
        document.addEventListener('click', (e) => {
            if (settingsPanel.classList.contains('active') && 
                !settingsPanel.contains(e.target) && 
                !settingsWheel.contains(e.target)) {
                settingsPanel.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Cambiar tema
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('aiPillTheme', theme);
            
            showAlert(`🎨 Tema "${theme}" aplicado`, 'success');
        });
    });

    // Cambiar fuente
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const font = btn.getAttribute('data-font');
            document.body.setAttribute('data-font', font);
            localStorage.setItem('aiPillFont', font);
            
            showAlert(`🔤 Fuente "${font}" aplicada`, 'success');
        });
    });

    // Cambiar tamaño
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const size = btn.getAttribute('data-size');
            document.body.setAttribute('data-size', size);
            localStorage.setItem('aiPillSize', size);
            
            showAlert(`🔍 Tamaño "${size}" aplicado`, 'success');
        });
    });

    // Reset de ajustes
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            localStorage.removeItem('aiPillTheme');
            localStorage.removeItem('aiPillFont');
            localStorage.removeItem('aiPillSize');
            
            // Resetear valores
            document.body.removeAttribute('data-theme');
            document.body.removeAttribute('data-font');
            document.body.removeAttribute('data-size');
            
            // Actualizar UI
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.theme-btn[data-theme="default"]').classList.add('active');
            
            document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.font-btn[data-font="default"]').classList.add('active');
            
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.size-btn[data-size="normal"]').classList.add('active');
            
            showAlert('↺ Ajustes restablecidos correctamente', 'success');
        });
    }

    // Cargar ajustes guardados
    const savedTheme = localStorage.getItem('aiPillTheme');
    const savedFont = localStorage.getItem('aiPillFont');
    const savedSize = localStorage.getItem('aiPillSize');
    
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('.theme-btn').forEach(btn => {
            if (btn.getAttribute('data-theme') === savedTheme) {
                btn.classList.add('active');
            }
        });
    }
    
    if (savedFont) {
        document.body.setAttribute('data-font', savedFont);
        document.querySelectorAll('.font-btn').forEach(btn => {
            if (btn.getAttribute('data-font') === savedFont) {
                btn.classList.add('active');
            }
        });
    }
    
    if (savedSize) {
        document.body.setAttribute('data-size', savedSize);
        document.querySelectorAll('.size-btn').forEach(btn => {
            if (btn.getAttribute('data-size') === savedSize) {
                btn.classList.add('active');
            }
        });
    }

    // ===== RELOJ DE BILBAO =====
    function actualizarRelojBilbao() {
        const ahora = new Date();
        
        // Formatear hora (24h) con zona horaria de España
        const hora = ahora.toLocaleTimeString('es-ES', {
            timeZone: 'Europe/Madrid',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // Formatear fecha (día/mes/año)
        const fecha = ahora.toLocaleDateString('es-ES', {
            timeZone: 'Europe/Madrid',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Actualizar elementos del footer
        const horaElement = document.getElementById('bilbaoTimeFooter');
        const fechaElement = document.getElementById('bilbaoDateFooter');
        
        if (horaElement) horaElement.textContent = hora;
        if (fechaElement) fechaElement.textContent = fecha;
    }

    // Actualizar inmediatamente al cargar
    actualizarRelojBilbao();

    // Actualizar cada segundo
    setInterval(actualizarRelojBilbao, 1000);

    // ===== TABS FUNCTIONALITY =====
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs');
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            
            this.classList.add('active');
            
            const contentGroup = this.closest('.code-example').querySelector('.tab-content');
            contentGroup.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // ===== CHECKBOX ANIMATION =====
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.checklist-item');
            
            if (this.checked) {
                item.style.borderColor = 'var(--color-success)';
                item.style.backgroundColor = '#dcfce7';
                
                setTimeout(() => {
                    item.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 200);
                }, 100);
            } else {
                item.style.borderColor = '#e2e8f0';
                item.style.backgroundColor = '#f8fafc';
            }
        });
    });

    console.log('🤖 Píldora de Agentes de IA cargada correctamente');
    console.log('💡 Prueba las demos interactivas y ajusta el tema a tu gusto');
});

// Función para mostrar alertas
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'danger') {
        alertDiv.style.background = "#ef4444";
    } else if (type === 'success') {
        alertDiv.style.background = "#10b981";
    } else if (type === 'warning') {
        alertDiv.style.background = "#f59e0b";
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = "slideOut 0.3s ease";
        setTimeout(() => alertDiv.remove(), 300);
    }, 2500);
}

// Añadir animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', () => {
    
    // ===== DEMO 1: Simular agente en acción =====
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

    // ===== DEMO 2: Chat con/sin memoria =====
    const sendNoMemory = document.getElementById('sendNoMemory');
    const sendWithMemory = document.getElementById('sendWithMemory');
    const inputNoMemory = document.getElementById('inputNoMemory');
    const inputWithMemory = document.getElementById('inputWithMemory');
    const chatNoMemory = document.getElementById('chatNoMemory');
    const chatWithMemory = document.getElementById('chatWithMemory');

    if (sendNoMemory) {
        sendNoMemory.addEventListener('click', () => {
            const message = inputNoMemory.value.trim();
            if (!message) return;

            // Agregar mensaje del usuario
            addMessage(chatNoMemory, message, 'user');
            inputNoMemory.value = '';

            // Simular respuesta (SIN MEMORIA - siempre responde igual)
            setTimeout(() => {
                addMessage(chatNoMemory, 'Entendido. ¿Algo más en lo que pueda ayudarte?', 'assistant');
            }, 800);
        });
    }

    if (sendWithMemory) {
        let conversationHistory = [];

        sendWithMemory.addEventListener('click', () => {
            const message = inputWithMemory.value.trim();
            if (!message) return;

            // Agregar mensaje del usuario
            addMessage(chatWithMemory, message, 'user');
            conversationHistory.push({ role: 'user', content: message });
            inputWithMemory.value = '';

            // Simular respuesta (CON MEMORIA - recuerda contexto)
            setTimeout(() => {
                let response;
                
                // Analizar el contexto
                const context = conversationHistory.slice(-3).map(m => m.content).join(' ');
                
                if (context.includes('nombre') || context.includes('cómo te llamas')) {
                    response = 'Me llamo QUBIZ, soy tu asistente de IA. ¿En qué más puedo ayudarte?';
                } else if (context.includes('adiós') || context.includes('hasta luego')) {
                    response = '¡Hasta luego! Estaré aquí cuando me necesites.';
                } else if (conversationHistory.length > 3) {
                    response = `Entendido. Llevamos ${conversationHistory.length + 1} mensajes en esta conversación. ¿Algo más?`;
                } else {
                    response = 'Entendido. ¿Algo más en lo que pueda ayudarte?';
                }

                addMessage(chatWithMemory, response, 'assistant');
                conversationHistory.push({ role: 'assistant', content: response });
            }, 800);
        });
    }

    function addMessage(chatBox, text, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ===== DEMO 3: Selector de herramientas =====
    const capabilitiesList = document.getElementById('capabilitiesList');
    const selectedTools = new Set();

    window.toggleTool = function(toolName) {
        const checkbox = document.getElementById(`tool${toolName.charAt(0).toUpperCase() + toolName.slice(1)}`);
        
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                selectedTools.add(toolName);
            } else {
                selectedTools.delete(toolName);
            }

            updateCapabilities();
        }
    };

    function updateCapabilities() {
        capabilitiesList.innerHTML = '';

        if (selectedTools.size === 0) {
            const item = document.createElement('div');
            item.className = 'capability disabled';
            item.textContent = 'Sin herramientas seleccionadas';
            capabilitiesList.appendChild(item);
            return;
        }

        selectedTools.forEach(tool => {
            const item = document.createElement('div');
            item.className = 'capability enabled';
            
            const descriptions = {
                'email': '📧 Puede enviar y recibir emails',
                'search': '🔍 Puede buscar información en internet',
                'files': '📁 Puede crear, leer y modificar archivos',
                'calendar': '📅 Puede gestionar eventos y recordatorios'
            };

            item.textContent = descriptions[tool] || `✅ Herramienta: ${tool}`;
            capabilitiesList.appendChild(item);
        });
    }

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
    console.log('💡 Prueba las demos interactivas para entender mejor cada concepto');
});
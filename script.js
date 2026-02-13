document.addEventListener('DOMContentLoaded', () => {
    // ===== SIMULACIÓN DE AGENTE =====
    const simulateAgentBtn = document.getElementById('simulateAgentBtn');
    const agentLog = document.getElementById('agentLog');

    if (simulateAgentBtn && agentLog) {
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

    if (sendNoMemory && chatNoMemory && inputNoMemory) {
        sendNoMemory.addEventListener('click', () => {
            const message = inputNoMemory.value.trim();
            if (!message) return;

            addMessage(chatNoMemory, message, 'user');
            inputNoMemory.value = '';

            setTimeout(() => {
                addMessage(chatNoMemory, 'Entendido. ¿Algo más en lo que pueda ayudarte?', 'assistant');
            }, 800);
        });

        inputNoMemory.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendNoMemory.click();
        });
    }

    if (sendWithMemory && chatWithMemory && inputWithMemory) {
        let conversationHistory = [];

        sendWithMemory.addEventListener('click', () => {
            const message = inputWithMemory.value.trim();
            if (!message) return;

            addMessage(chatWithMemory, message, 'user');
            conversationHistory.push({ role: 'user', content: message });
            inputWithMemory.value = '';

            setTimeout(() => {
                let response;
                const context = conversationHistory.slice(-3).map(m => m.content).join(' ');
                
                if (context.toLowerCase().includes('nombre') || context.toLowerCase().includes('cómo te llamas')) {
                    response = 'Me llamo QUBIZ, soy tu asistente de IA. ¿En qué más puedo ayudarte?';
                } else if (context.toLowerCase().includes('adiós') || context.toLowerCase().includes('hasta luego')) {
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

        inputWithMemory.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendWithMemory.click();
        });
    }

    function addMessage(chatBox, text, role) {
        if (!chatBox) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ===== DEMO 3: Selector de herramientas (Rule 3) =====
    // FIXED: Uses data-tool attribute instead of conflicting IDs
    const capabilitiesList = document.getElementById('capabilitiesList');
    const demoToolCards = document.querySelectorAll('.tools-selector .tool-card');

    demoToolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            // Only toggle if the click wasn't directly on the checkbox (label click already toggles it)
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            updateCapabilities();
        });
    });

    function updateCapabilities() {
        if (!capabilitiesList) return;
        
        capabilitiesList.innerHTML = '';

        const descriptions = {
            'email': '📧 Puede enviar y recibir emails',
            'search': '🔍 Puede buscar información en internet',
            'files': '📁 Puede crear, leer y modificar archivos',
            'calendar': '📅 Puede gestionar eventos y recordatorios'
        };

        let hasSelected = false;

        demoToolCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            const toolName = card.getAttribute('data-tool');
            
            if (checkbox && checkbox.checked && toolName) {
                hasSelected = true;
                const item = document.createElement('div');
                item.className = 'capability enabled';
                item.textContent = descriptions[toolName] || `✅ Herramienta: ${toolName}`;
                capabilitiesList.appendChild(item);
            }
        });

        if (!hasSelected) {
            const item = document.createElement('div');
            item.className = 'capability disabled';
            item.textContent = 'Sin herramientas seleccionadas';
            capabilitiesList.appendChild(item);
        }
    }

    // ===== AGENT BUILDER INTERACTIVO (Rule 6) =====
    // Actualizar vista previa del nombre
    const agentNameInput = document.getElementById('agentName');
    const previewName = document.getElementById('previewName');
    
    if (agentNameInput && previewName) {
        agentNameInput.addEventListener('input', () => {
            previewName.textContent = agentNameInput.value.trim() || 'MiAgenteIA';
        });
    }
    
    // Actualizar vista previa de personalidad
    const personalityOptions = document.querySelectorAll('.personality-option');
    const previewPersonality = document.getElementById('previewPersonality');
    
    personalityOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Also check the radio inside
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            
            personalityOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const personalityValue = option.getAttribute('data-value');
            const personalityText = option.querySelector('.personality-name').textContent;
            const personalityIcon = option.querySelector('.personality-icon').textContent;
            
            if (previewPersonality) {
                previewPersonality.innerHTML = `
                    <span class="personality-badge ${personalityValue}">
                        ${personalityIcon} ${personalityText}
                    </span>
                `;
            }
        });
    });
    
    // Actualizar vista previa de propósito
    const agentPurposeInput = document.getElementById('agentPurpose');
    const previewPurpose = document.getElementById('previewPurpose');
    
    if (agentPurposeInput && previewPurpose) {
        agentPurposeInput.addEventListener('input', () => {
            previewPurpose.textContent = agentPurposeInput.value.trim() || 'Sin propósito definido';
        });
    }
    
    // Actualizar vista previa de herramientas (Rule 6 builder)
    // FIXED: Scoped to .tools-checkbox-grid only, no more conflicting IDs
    const builderToolCheckboxes = document.querySelectorAll('.tools-checkbox-grid .tool-checkbox');
    const previewTools = document.getElementById('previewTools');
    
    builderToolCheckboxes.forEach(toolCheckbox => {
        const checkbox = toolCheckbox.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        
        toolCheckbox.addEventListener('click', (e) => {
            // Only toggle if click wasn't directly on the checkbox
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            
            if (checkbox.checked) {
                toolCheckbox.classList.add('checked');
            } else {
                toolCheckbox.classList.remove('checked');
            }
            
            updatePreviewTools();
        });
    });
    
    function updatePreviewTools() {
        if (!previewTools) return;
        
        const selectedTools = [];
        builderToolCheckboxes.forEach(toolCheckbox => {
            const checkbox = toolCheckbox.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const label = checkbox.nextElementSibling;
                const toolName = label ? label.querySelector('.tool-name')?.textContent : '';
                const toolIcon = label ? label.querySelector('.tool-icon')?.textContent : '';
                if (toolName) selectedTools.push({ icon: toolIcon, name: toolName });
            }
        });
        
        if (selectedTools.length === 0) {
            previewTools.innerHTML = '<span class="tool-badge">❌ Sin herramientas</span>';
        } else {
            previewTools.innerHTML = selectedTools.map(tool => 
                `<span class="tool-badge">${tool.icon} ${tool.name}</span>`
            ).join('');
        }
    }
    
    // Helper: get selected builder tools
    function getSelectedBuilderTools() {
        const tools = [];
        builderToolCheckboxes.forEach(toolCheckbox => {
            const checkbox = toolCheckbox.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const label = checkbox.nextElementSibling;
                const toolName = label ? label.querySelector('.tool-name')?.textContent : '';
                if (toolName) tools.push(toolName);
            }
        });
        return tools;
    }
    
    // Generar código del agente
    const generateAgentBtn = document.getElementById('generateAgentBtn');
    const generatedCodeSection = document.getElementById('generatedCodeSection');
    const generatedCode = document.getElementById('generatedCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const downloadCodeBtn = document.getElementById('downloadCodeBtn');
    
    if (generateAgentBtn && generatedCodeSection && generatedCode) {
        generateAgentBtn.addEventListener('click', () => {
            const agentName = (document.getElementById('agentName')?.value || 'MiAgenteIA').trim() || 'MiAgenteIA';
            const personalityElement = document.querySelector('input[name="personality"]:checked');
            const personality = personalityElement?.value || 'formal';
            const purpose = (document.getElementById('agentPurpose')?.value || 'Gestionar emails importantes y buscar información relevante').trim() || 'Sin propósito definido';
            
            const tools = getSelectedBuilderTools();
            
            // Generar código Python por defecto
            const pythonCode = generatePythonCode(agentName, personality, purpose, tools);
            
            // Mostrar sección de código
            generatedCodeSection.style.display = 'block';
            generatedCode.innerHTML = `<code>${pythonCode}</code>`;
            
            // Scroll suave a la sección de código
            generatedCodeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            showAlert(`✅ ¡Código generado para ${agentName}!`, 'success');
        });
    }
    
    // Tabs de código (Python/JavaScript) en el generador
    document.querySelectorAll('.code-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const lang = btn.getAttribute('data-lang');
            const agentName = (document.getElementById('agentName')?.value || 'MiAgenteIA').trim() || 'MiAgenteIA';
            const personalityElement = document.querySelector('input[name="personality"]:checked');
            const personality = personalityElement?.value || 'formal';
            const purpose = (document.getElementById('agentPurpose')?.value || 'Gestionar emails importantes y buscar información relevante').trim() || 'Sin propósito definido';
            
            const tools = getSelectedBuilderTools();
            
            let code = '';
            if (lang === 'python') {
                code = generatePythonCode(agentName, personality, purpose, tools);
            } else {
                code = generateJavaScriptCode(agentName, personality, purpose, tools);
            }
            
            if (generatedCode) {
                generatedCode.innerHTML = `<code>${code}</code>`;
            }
        });
    });
    
    // Copiar código
    if (copyCodeBtn && generatedCode) {
        copyCodeBtn.addEventListener('click', () => {
            const codeText = generatedCode.querySelector('code')?.textContent || '';
            if (!codeText) return;
            
            navigator.clipboard.writeText(codeText).then(() => {
                const originalText = copyCodeBtn.textContent;
                copyCodeBtn.textContent = '✓ ¡Copiado!';
                copyCodeBtn.style.background = 'var(--color-success)';
                
                setTimeout(() => {
                    copyCodeBtn.textContent = originalText;
                    copyCodeBtn.style.background = '';
                }, 2000);
                
                showAlert('📋 Código copiado al portapapeles', 'success');
            }).catch(err => {
                console.error('Error al copiar:', err);
                showAlert('❌ Error al copiar el código', 'danger');
            });
        });
    }
    
    // Descargar código
    if (downloadCodeBtn && generatedCode) {
        downloadCodeBtn.addEventListener('click', () => {
            const agentName = (document.getElementById('agentName')?.value || 'MiAgenteIA').trim() || 'MiAgenteIA';
            const codeText = generatedCode.querySelector('code')?.textContent || '';
            if (!codeText) return;
            
            const lang = document.querySelector('.code-tab-btn.active')?.getAttribute('data-lang') || 'python';
            const extension = lang === 'python' ? 'py' : 'js';
            const filename = `${agentName.replace(/\s+/g, '_')}.${extension}`;
            
            const blob = new Blob([codeText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showAlert(`📥 Código descargado como ${filename}`, 'success');
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
            document.querySelector('.theme-btn[data-theme="default"]')?.classList.add('active');
            
            document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.font-btn[data-font="default"]')?.classList.add('active');
            
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.size-btn[data-size="normal"]')?.classList.add('active');
            
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
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === savedTheme) {
                btn.classList.add('active');
            }
        });
    }
    
    if (savedFont) {
        document.body.setAttribute('data-font', savedFont);
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-font') === savedFont) {
                btn.classList.add('active');
            }
        });
    }
    
    if (savedSize) {
        document.body.setAttribute('data-size', savedSize);
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-size') === savedSize) {
                btn.classList.add('active');
            }
        });
    }

    // ===== RELOJ DE BILBAO =====
    function actualizarRelojBilbao() {
        const ahora = new Date();
        
        const hora = ahora.toLocaleTimeString('es-ES', {
            timeZone: 'Europe/Madrid',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const fecha = ahora.toLocaleDateString('es-ES', {
            timeZone: 'Europe/Madrid',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const horaElement = document.getElementById('bilbaoTimeFooter');
        const fechaElement = document.getElementById('bilbaoDateFooter');
        
        if (horaElement) horaElement.textContent = hora;
        if (fechaElement) fechaElement.textContent = fecha;
    }

    actualizarRelojBilbao();
    setInterval(actualizarRelojBilbao, 1000);

    // ===== TABS FUNCTIONALITY (para ejemplos de código) =====
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs');
            if (!tabGroup) return;
            
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const contentGroup = this.closest('.code-example')?.querySelector('.tab-content');
            if (!contentGroup) return;
            
            contentGroup.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            const tabId = this.getAttribute('data-tab');
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // ===== CHECKBOX ANIMATION =====
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.checklist-item');
            if (!item) return;
            
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

// ===== FUNCIONES PARA GENERAR CÓDIGO =====
function generatePythonCode(agentName, personality, purpose, tools) {
    const personalityPrompts = {
        formal: 'Eres un asistente profesional y formal. Responde de manera precisa y técnica.',
        casual: 'Eres un asistente amigable y casual. Responde de manera relajada y cercana.',
        technical: 'Eres un asistente técnico experto. Responde con detalle y precisión, incluyendo código cuando sea necesario.',
        creative: 'Eres un asistente creativo e innovador. Responde con ideas originales y enfoques únicos.'
    };
    
    const toolImports = [];
    const toolDefinitions = [];
    
    if (tools.includes('Enviar emails')) {
        toolImports.push('from langchain.tools import Tool');
        toolImports.push('import smtplib');
        toolDefinitions.push(`
def send_email(recipient, subject, body):
    \"\"\"Envía un email al destinatario especificado\"\"\"
    # Implementación real con SMTP
    return f"Email enviado a {recipient}"
`);
    }
    
    if (tools.includes('Buscar en web')) {
        toolImports.push('from langchain.utilities import GoogleSearchAPIWrapper');
        toolDefinitions.push(`
search = GoogleSearchAPIWrapper()
`);
    }
    
    if (tools.includes('Gestionar archivos')) {
        toolDefinitions.push(`
def read_file(filename):
    \"\"\"Lee el contenido de un archivo\"\"\"
    with open(filename, 'r') as f:
        return f.read()

def write_file(filename, content):
    \"\"\"Escribe contenido en un archivo\"\"\"
    with open(filename, 'w') as f:
        f.write(content)
    return f"Archivo {filename} guardado"
`);
    }
    
    const uniqueImports = [...new Set(toolImports)];
    
    return `# ${'='.repeat(50)}
# Agente de IA: ${agentName}
# ${'='.repeat(50)}
# Propósito: ${purpose}
# Personalidad: ${personality}
# Herramientas: ${tools.join(', ') || 'Ninguna'}
# ${'='.repeat(50)}

${uniqueImports.join('\n')}

from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory

${toolDefinitions.join('\n')}

# Configurar el modelo de lenguaje
llm = ChatOpenAI(
    temperature=0.7,
    model_name="gpt-4"
)

# Configurar memoria
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# Sistema de instrucciones (Personalidad: ${personality})
SYSTEM_PROMPT = \"\"\"
${personalityPrompts[personality]}

Propósito del agente: ${purpose}

Instrucciones:
- Sé útil y responde a las preguntas del usuario
- Usa las herramientas disponibles cuando sea necesario
- Mantén un contexto de la conversación
- Sé conciso pero completo en tus respuestas
\"\"\"

# Definir herramientas
tools = [
    ${tools.map(tool => {
        if (tool === 'Enviar emails') {
            return 'Tool(name="SendEmail", func=send_email, description="Envía emails a destinatarios")';
        } else if (tool === 'Buscar en web') {
            return 'Tool(name="Search", func=search.run, description="Busca información en internet")';
        } else if (tool === 'Gestionar archivos') {
            return 'Tool(name="ReadFile", func=read_file, description="Lee archivos"),\n    Tool(name="WriteFile", func=write_file, description="Escribe en archivos")';
        } else if (tool === 'Calendario') {
            return 'Tool(name="Calendar", func=lambda x: "Eventos del calendario", description="Gestiona eventos de calendario")';
        } else if (tool === 'APIs externas') {
            return 'Tool(name="API", func=lambda x: "Llamada a API", description="Conecta con APIs externas")';
        } else if (tool === 'Base de datos') {
            return 'Tool(name="Database", func=lambda x: "Consulta BD", description="Accede a base de datos")';
        }
        return '';
    }).filter(t => t).join(',\n    ')}
]

# Crear el agente
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    verbose=True,
    memory=memory,
    handle_parsing_errors=True
)

print(f"✅ Agente '${agentName}' iniciado correctamente")
print(f"📝 Propósito: ${purpose}")
print(f"🛠️  Herramientas: ${tools.length} disponibles")
print("=" * 50)

# Ejemplo de uso
if __name__ == "__main__":
    while True:
        user_input = input("\\n👤 Tú: ")
        
        if user_input.lower() in ['salir', 'exit', 'quit']:
            print("👋 ¡Hasta luego!")
            break
        
        try:
            response = agent.run(user_input)
            print(f"🤖 ${agentName}: {response}")
        except Exception as e:
            print(f"❌ Error: {e}")
`;
}

function generateJavaScriptCode(agentName, personality, purpose, tools) {
    const personalityPrompts = {
        formal: 'Eres un asistente profesional y formal. Responde de manera precisa y técnica.',
        casual: 'Eres un asistente amigable y casual. Responde de manera relajada y cercana.',
        technical: 'Eres un asistente técnico experto. Responde con detalle y precisión, incluyendo código cuando sea necesario.',
        creative: 'Eres un asistente creativo e innovador. Responde con ideas originales y enfoques únicos.'
    };
    
    return `// ${'='.repeat(50)}
// Agente de IA: ${agentName}
// ${'='.repeat(50)}
// Propósito: ${purpose}
// Personalidad: ${personality}
// Herramientas: ${tools.join(', ') || 'Ninguna'}
// ${'='.repeat(50)}

const { ChatOpenAI } = require('langchain/chat_models/openai');
const { BufferMemory } = require('langchain/memory');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');

// Configurar el modelo de lenguaje
const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-4"
});

// Configurar memoria
const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true
});

// Sistema de instrucciones (Personalidad: ${personality})
const SYSTEM_PROMPT = \`
${personalityPrompts[personality]}

Propósito del agente: ${purpose}

Instrucciones:
- Sé útil y responde a las preguntas del usuario
- Usa las herramientas disponibles cuando sea necesario
- Mantén un contexto de la conversación
- Sé conciso pero completo en tus respuestas
\`;

// Definir herramientas
const tools = [
    ${tools.map(tool => {
        if (tool === 'Enviar emails') {
            return `{ name: "SendEmail", description: "Envía emails a destinatarios", func: async (input) => { return \`Email enviado: \${input}\`; } }`;
        } else if (tool === 'Buscar en web') {
            return `{ name: "Search", description: "Busca información en internet", func: async (input) => { return \`Resultados para: \${input}\`; } }`;
        } else if (tool === 'Gestionar archivos') {
            return `{ name: "ReadFile", description: "Lee archivos", func: async (input) => { return \`Contenido de \${input}\`; } },
    { name: "WriteFile", description: "Escribe en archivos", func: async (input) => { return \`Archivo guardado: \${input}\`; } }`;
        } else if (tool === 'Calendario') {
            return `{ name: "Calendar", description: "Gestiona eventos de calendario", func: async (input) => { return \`Eventos: \${input}\`; } }`;
        } else if (tool === 'APIs externas') {
            return `{ name: "API", description: "Conecta con APIs externas", func: async (input) => { return \`API response: \${input}\`; } }`;
        } else if (tool === 'Base de datos') {
            return `{ name: "Database", description: "Accede a base de datos", func: async (input) => { return \`DB result: \${input}\`; } }`;
        }
        return `{ name: "${tool}", description: "${tool}", func: async (input) => { return \`\${input}\`; } }`;
    }).join(',\n    ')}
];

// Crear el agente
const agent = await initializeAgentExecutorWithOptions(
    tools,
    model,
    {
        agentType: "chat-conversational-react-description",
        verbose: true,
        memory: memory
    }
);

console.log(\`✅ Agente '${agentName}' iniciado correctamente\`);
console.log(\`📝 Propósito: ${purpose}\`);
console.log(\`🛠️  Herramientas: ${tools.length} disponibles\`);
console.log("=".repeat(50));

// Ejemplo de uso
async function runAgent() {
    const prompts = [
        "Hola, ¿qué puedes hacer?",
        "Explícame tu propósito"
    ];
    
    for (const prompt of prompts) {
        console.log(\`\\n👤 Tú: \${prompt}\`);
        const result = await agent.call({ input: prompt });
        console.log(\`🤖 ${agentName}: \${result.output}\`);
    }
}

runAgent().catch(console.error);
`;
}

// ===== FUNCIÓN PARA MOSTRAR ALERTAS =====
function showAlert(message, type) {
    // Eliminar alertas existentes
    const existingAlerts = document.querySelectorAll('.alert-toast');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-toast';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        margin-bottom: 10px;
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

// ===== AÑADIR ANIMACIONES CSS =====
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
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
// ===== COMPARISON SECTION =====
// No necesita JavaScript adicional, es estático

// ===== AGENT BUILDER INTERACTIVO =====
document.addEventListener('DOMContentLoaded', () => {
    
    // Actualizar vista previa del nombre
    const agentNameInput = document.getElementById('agentName');
    const previewName = document.getElementById('previewName');
    
    if (agentNameInput && previewName) {
        agentNameInput.addEventListener('input', () => {
            previewName.textContent = agentNameInput.value || 'MiAgenteIA';
        });
    }
    
    // Actualizar vista previa de personalidad
    const personalityOptions = document.querySelectorAll('.personality-option');
    const previewPersonality = document.getElementById('previewPersonality');
    
    personalityOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Quitar clase active de todos
            personalityOptions.forEach(opt => opt.classList.remove('active'));
            // Añadir a este
            option.classList.add('active');
            
            // Actualizar vista previa
            const personalityValue = option.getAttribute('data-value');
            const personalityText = option.querySelector('.personality-name').textContent;
            const personalityIcon = option.querySelector('.personality-icon').textContent;
            
            previewPersonality.innerHTML = `
                <span class="personality-badge ${personalityValue}">
                    ${personalityIcon} ${personalityText}
                </span>
            `;
        });
    });
    
    // Actualizar vista previa de propósito
    const agentPurposeInput = document.getElementById('agentPurpose');
    const previewPurpose = document.getElementById('previewPurpose');
    
    if (agentPurposeInput && previewPurpose) {
        agentPurposeInput.addEventListener('input', () => {
            previewPurpose.textContent = agentPurposeInput.value || 'Sin propósito definido';
        });
    }
    
    // Actualizar vista previa de herramientas
    const toolCheckboxes = document.querySelectorAll('.tool-checkbox input[type="checkbox"]');
    const previewTools = document.getElementById('previewTools');
    
    toolCheckboxes.forEach(checkbox => {
        const toolCheckbox = checkbox.closest('.tool-checkbox');
        toolCheckbox.addEventListener('click', (e) => {
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
        
        checkbox.addEventListener('change', updatePreviewTools);
    });
    
    function updatePreviewTools() {
        const selectedTools = [];
        toolCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const toolName = checkbox.nextElementSibling.querySelector('.tool-name').textContent;
                const toolIcon = checkbox.nextElementSibling.querySelector('.tool-icon').textContent;
                selectedTools.push({ icon: toolIcon, name: toolName });
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
    
    // Generar código del agente
    const generateAgentBtn = document.getElementById('generateAgentBtn');
    const generatedCodeSection = document.getElementById('generatedCodeSection');
    const generatedCode = document.getElementById('generatedCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const downloadCodeBtn = document.getElementById('downloadCodeBtn');
    
    if (generateAgentBtn) {
        generateAgentBtn.addEventListener('click', () => {
            const agentName = document.getElementById('agentName').value.trim() || 'MiAgenteIA';
            const personality = document.querySelector('input[name="personality"]:checked').value;
            const purpose = document.getElementById('agentPurpose').value.trim() || 'Sin propósito definido';
            
            // Obtener herramientas seleccionadas
            const tools = [];
            document.querySelectorAll('.tool-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
                const toolName = checkbox.nextElementSibling.querySelector('.tool-name').textContent;
                tools.push(toolName);
            });
            
            // Generar código Python
            const pythonCode = generatePythonCode(agentName, personality, purpose, tools);
            
            // Mostrar sección de código
            generatedCodeSection.style.display = 'block';
            generatedCode.innerHTML = `<code>${pythonCode}</code>`;
            
            // Scroll suave a la sección de código
            generatedCodeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            showAlert(`✅ ¡Código generado para ${agentName}!`, 'success');
        });
    }
    
    // Tabs de código (Python/JavaScript)
    document.querySelectorAll('.code-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const lang = btn.getAttribute('data-lang');
            const agentName = document.getElementById('agentName').value.trim() || 'MiAgenteIA';
            const personality = document.querySelector('input[name="personality"]:checked').value;
            const purpose = document.getElementById('agentPurpose').value.trim() || 'Sin propósito definido';
            
            const tools = [];
            document.querySelectorAll('.tool-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
                const toolName = checkbox.nextElementSibling.querySelector('.tool-name').textContent;
                tools.push(toolName);
            });
            
            let code = '';
            if (lang === 'python') {
                code = generatePythonCode(agentName, personality, purpose, tools);
            } else {
                code = generateJavaScriptCode(agentName, personality, purpose, tools);
            }
            
            generatedCode.innerHTML = `<code>${code}</code>`;
        });
    });
    
    // Copiar código
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const codeText = generatedCode.querySelector('code').textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                const originalText = copyCodeBtn.textContent;
                copyCodeBtn.textContent = '✓ ¡Copiado!';
                copyCodeBtn.style.background = 'var(--color-success)';
                
                setTimeout(() => {
                    copyCodeBtn.textContent = originalText;
                    copyCodeBtn.style.background = '';
                }, 2000);
            });
        });
    }
    
    // Descargar código
    if (downloadCodeBtn) {
        downloadCodeBtn.addEventListener('click', () => {
            const agentName = document.getElementById('agentName').value.trim() || 'MiAgenteIA';
            const codeText = generatedCode.querySelector('code').textContent;
            const lang = document.querySelector('.code-tab-btn.active').getAttribute('data-lang');
            
            const blob = new Blob([codeText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${agentName}.${lang === 'python' ? 'py' : 'js'}`;
            a.click();
            URL.revokeObjectURL(url);
            
            showAlert('📥 Código descargado', 'success');
        });
    }
});

// Función para generar código Python
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

// Función para generar código JavaScript
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
        } else {
            return `{ name: "${tool}", description: "${tool}", func: async (input) => { return \`\${input}\`; } }`;
        }
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
// ===== SETTINGS WHEEL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    const settingsWheel = document.getElementById('settingsWheel');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const resetSettingsBtn = document.getElementById('resetSettings');

    // Abrir/cerrar panel de ajustes
    if (settingsWheel && settingsPanel) {
        settingsWheel.addEventListener('click', () => {
            settingsPanel.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evita scroll al abrir panel
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
            // Quitar clase active de todos
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Aplicar tema
            const theme = btn.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('aiPillTheme', theme);
            
            // Mostrar notificación
            if (notificationsToggle.checked) {
                showAlert(`🎨 Tema "${theme}" aplicado`, 'success');
            }
        });
    });

    // Cambiar densidad
    document.querySelectorAll('.density-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.density-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const density = btn.getAttribute('data-density');
            document.body.setAttribute('data-density', density);
            localStorage.setItem('aiPillDensity', density);
            
            if (notificationsToggle.checked) {
                showAlert(`📊 Vista "${density}" aplicada`, 'success');
            }
        });
    });

    // Guardar estado de notificaciones
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', () => {
            localStorage.setItem('aiPillNotifications', notificationsToggle.checked);
        });
    }

    // Reset de ajustes
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            // Resetear valores
            localStorage.removeItem('aiPillTheme');
            localStorage.removeItem('aiPillDensity');
            localStorage.removeItem('aiPillNotifications');
            
            // Aplicar valores por defecto
            document.body.removeAttribute('data-theme');
            document.body.removeAttribute('data-density');
            if (notificationsToggle) notificationsToggle.checked = true;
            
            // Actualizar UI
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.theme-btn[data-theme="default"]').classList.add('active');
            
            document.querySelectorAll('.density-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.density-btn[data-density="normal"]').classList.add('active');
            
            showAlert('↺ Ajustes restablecidos correctamente', 'success');
        });
    }

    // Cargar ajustes guardados
    const savedTheme = localStorage.getItem('aiPillTheme');
    const savedDensity = localStorage.getItem('aiPillDensity');
    const savedNotifications = localStorage.getItem('aiPillNotifications');
    
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('.theme-btn').forEach(btn => {
            if (btn.getAttribute('data-theme') === savedTheme) {
                btn.classList.add('active');
            }
        });
    }
    
    if (savedDensity) {
        document.body.setAttribute('data-density', savedDensity);
        document.querySelectorAll('.density-btn').forEach(btn => {
            if (btn.getAttribute('data-density') === savedDensity) {
                btn.classList.add('active');
            }
        });
    }
    
    if (savedNotifications !== null && notificationsToggle) {
        notificationsToggle.checked = savedNotifications === 'true';
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
    
    console.log('⚙️ Panel de ajustes y reloj de Bilbao cargados correctamente');
});
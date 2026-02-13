document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // AUTO-ADD COPY BUTTONS TO ALL CODE BLOCKS
    // ============================================
    document.querySelectorAll('.code-example').forEach(codeExample => {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = '📋 Copiar';
        btn.addEventListener('click', () => {
            // Get the currently visible tab-pane, or fall back to the first pre
            const activePane = codeExample.querySelector('.tab-pane.active code') 
                            || codeExample.querySelector('pre code')
                            || codeExample.querySelector('code');
            if (!activePane) return;
            
            const text = activePane.textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✓ ¡Copiado!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 Copiar';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.textContent = '✓ ¡Copiado!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 Copiar';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
        codeExample.appendChild(btn);
    });

    // Also add to generated code container
    const codeDisplayContainer = document.querySelector('.code-display-container');
    if (codeDisplayContainer && !codeDisplayContainer.querySelector('.code-copy-btn')) {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = '📋 Copiar';
        btn.addEventListener('click', () => {
            const code = codeDisplayContainer.querySelector('code');
            if (!code) return;
            navigator.clipboard.writeText(code.textContent).then(() => {
                btn.textContent = '✓ ¡Copiado!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = '📋 Copiar'; btn.classList.remove('copied'); }, 2000);
            });
        });
        codeDisplayContainer.appendChild(btn);
    }

    // ============================================
    // SIMULACIÓN DE AGENTE (Rule 1)
    // ============================================
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

    // ============================================
    // DEMO 2: Chat con/sin memoria (Rule 2)
    // ============================================
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
        inputNoMemory.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendNoMemory.click(); });
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
        inputWithMemory.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendWithMemory.click(); });
    }

    function addMessage(chatBox, text, role) {
        if (!chatBox) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ============================================
    // DEMO 3: Selector de herramientas (Rule 3)
    // ============================================
    const capabilitiesList = document.getElementById('capabilitiesList');
    const demoToolCards = document.querySelectorAll('.tools-selector .tool-card');

    demoToolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const checkbox = card.querySelector('input[type="checkbox"]');
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

    // ============================================
    // AGENT BUILDER INTERACTIVO (Rule 6)
    // ============================================
    
    // Preview: nombre
    const agentNameInput = document.getElementById('agentName');
    const previewName = document.getElementById('previewName');
    if (agentNameInput && previewName) {
        agentNameInput.addEventListener('input', () => {
            previewName.textContent = agentNameInput.value.trim() || 'MiAgenteIA';
        });
    }
    
    // Preview: personalidad
    const personalityOptions = document.querySelectorAll('.personality-option');
    const previewPersonality = document.getElementById('previewPersonality');
    
    personalityOptions.forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            personalityOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const val = option.getAttribute('data-value');
            const name = option.querySelector('.personality-name').textContent;
            const icon = option.querySelector('.personality-icon').textContent;
            
            if (previewPersonality) {
                previewPersonality.innerHTML = `<span class="personality-badge ${val}">${icon} ${name}</span>`;
            }
        });
    });
    
    // Preview: propósito
    const agentPurposeInput = document.getElementById('agentPurpose');
    const previewPurpose = document.getElementById('previewPurpose');
    if (agentPurposeInput && previewPurpose) {
        agentPurposeInput.addEventListener('input', () => {
            previewPurpose.textContent = agentPurposeInput.value.trim() || 'Sin propósito definido';
        });
    }
    
    // Preview: herramientas (Rule 6 builder - scoped to .tools-checkbox-grid)
    const builderToolCheckboxes = document.querySelectorAll('.tools-checkbox-grid .tool-checkbox');
    const previewTools = document.getElementById('previewTools');
    
    builderToolCheckboxes.forEach(toolCheckbox => {
        const checkbox = toolCheckbox.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        
        toolCheckbox.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            toolCheckbox.classList.toggle('checked', checkbox.checked);
            updatePreviewTools();
        });
    });
    
    function updatePreviewTools() {
        if (!previewTools) return;
        const selected = [];
        builderToolCheckboxes.forEach(tc => {
            const cb = tc.querySelector('input[type="checkbox"]');
            if (cb && cb.checked) {
                const label = cb.nextElementSibling;
                const name = label?.querySelector('.tool-name')?.textContent || '';
                const icon = label?.querySelector('.tool-icon')?.textContent || '';
                if (name) selected.push({ icon, name });
            }
        });
        
        if (selected.length === 0) {
            previewTools.innerHTML = '<span class="tool-badge">❌ Sin herramientas</span>';
        } else {
            previewTools.innerHTML = selected.map(t => `<span class="tool-badge">${t.icon} ${t.name}</span>`).join('');
        }
    }
    
    function getSelectedBuilderTools() {
        const tools = [];
        builderToolCheckboxes.forEach(tc => {
            const cb = tc.querySelector('input[type="checkbox"]');
            if (cb && cb.checked) {
                const label = cb.nextElementSibling;
                const name = label?.querySelector('.tool-name')?.textContent || '';
                if (name) tools.push(name);
            }
        });
        return tools;
    }
    
    // Generar código
    const generateAgentBtn = document.getElementById('generateAgentBtn');
    const generatedCodeSection = document.getElementById('generatedCodeSection');
    const generatedCode = document.getElementById('generatedCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const downloadCodeBtn = document.getElementById('downloadCodeBtn');
    
    if (generateAgentBtn && generatedCodeSection && generatedCode) {
        generateAgentBtn.addEventListener('click', () => {
            const agentName = (document.getElementById('agentName')?.value || 'MiAgenteIA').trim() || 'MiAgenteIA';
            const personality = document.querySelector('input[name="personality"]:checked')?.value || 'formal';
            const purpose = (document.getElementById('agentPurpose')?.value || '').trim() || 'Sin propósito definido';
            const tools = getSelectedBuilderTools();
            
            const pythonCode = generatePythonCode(agentName, personality, purpose, tools);
            generatedCodeSection.style.display = 'block';
            generatedCode.innerHTML = `<code>${escapeHtml(pythonCode)}</code>`;
            generatedCodeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showAlert(`✅ ¡Código generado para ${agentName}!`, 'success');
        });
    }
    
    // Tabs Python/JS en generador
    document.querySelectorAll('.code-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const lang = btn.getAttribute('data-lang');
            const agentName = (document.getElementById('agentName')?.value || 'MiAgenteIA').trim() || 'MiAgenteIA';
            const personality = document.querySelector('input[name="personality"]:checked')?.value || 'formal';
            const purpose = (document.getElementById('agentPurpose')?.value || '').trim() || 'Sin propósito definido';
            const tools = getSelectedBuilderTools();
            
            const code = lang === 'python' 
                ? generatePythonCode(agentName, personality, purpose, tools) 
                : generateJavaScriptCode(agentName, personality, purpose, tools);
            
            if (generatedCode) {
                generatedCode.innerHTML = `<code>${escapeHtml(code)}</code>`;
            }
        });
    });
    
    // Copiar código generado
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const codeText = generatedCode?.querySelector('code')?.textContent || '';
            if (!codeText) return;
            navigator.clipboard.writeText(codeText).then(() => {
                const orig = copyCodeBtn.textContent;
                copyCodeBtn.textContent = '✓ ¡Copiado!';
                copyCodeBtn.style.background = 'var(--color-success)';
                setTimeout(() => { copyCodeBtn.textContent = orig; copyCodeBtn.style.background = ''; }, 2000);
                showAlert('📋 Código copiado al portapapeles', 'success');
            });
        });
    }
    
    // Descargar código generado
    if (downloadCodeBtn) {
        downloadCodeBtn.addEventListener('click', () => {
            const agentName = (document.getElementById('agentName')?.value || 'MiAgenteIA').trim() || 'MiAgenteIA';
            const codeText = generatedCode?.querySelector('code')?.textContent || '';
            if (!codeText) return;
            
            const lang = document.querySelector('.code-tab-btn.active')?.getAttribute('data-lang') || 'python';
            const ext = lang === 'python' ? 'py' : 'js';
            const filename = `${agentName.replace(/\s+/g, '_')}.${ext}`;
            
            const blob = new Blob([codeText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showAlert(`📥 Descargado como ${filename}`, 'success');
        });
    }

    // ============================================
    // SETTINGS
    // ============================================
    const settingsWheel = document.getElementById('settingsWheel');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const resetSettingsBtn = document.getElementById('resetSettings');

    if (settingsWheel && settingsPanel) {
        settingsWheel.addEventListener('click', () => {
            settingsPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeSettings?.addEventListener('click', () => {
            settingsPanel.classList.remove('active');
            document.body.style.overflow = '';
        });

        document.addEventListener('click', (e) => {
            if (settingsPanel.classList.contains('active') && 
                !settingsPanel.contains(e.target) && 
                !settingsWheel.contains(e.target)) {
                settingsPanel.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const theme = btn.getAttribute('data-theme');
            if (theme === 'default') {
                document.body.removeAttribute('data-theme');
            } else {
                document.body.setAttribute('data-theme', theme);
            }
            localStorage.setItem('aiPillTheme', theme);
            showAlert(`🎨 Tema "${btn.textContent.trim()}" aplicado`, 'success');
        });
    });

    // Font buttons
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const font = btn.getAttribute('data-font');
            if (font === 'default') {
                document.body.removeAttribute('data-font');
            } else {
                document.body.setAttribute('data-font', font);
            }
            localStorage.setItem('aiPillFont', font);
            showAlert(`🔤 Fuente "${btn.textContent.trim()}" aplicada`, 'success');
        });
    });

    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const size = btn.getAttribute('data-size');
            if (size === 'normal') {
                document.body.removeAttribute('data-size');
            } else {
                document.body.setAttribute('data-size', size);
            }
            localStorage.setItem('aiPillSize', size);
            showAlert(`🔍 Tamaño "${btn.textContent.trim()}" aplicado`, 'success');
        });
    });

    // Reset settings
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            localStorage.removeItem('aiPillTheme');
            localStorage.removeItem('aiPillFont');
            localStorage.removeItem('aiPillSize');
            
            document.body.removeAttribute('data-theme');
            document.body.removeAttribute('data-font');
            document.body.removeAttribute('data-size');
            
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.theme-btn[data-theme="default"]')?.classList.add('active');
            document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.font-btn[data-font="default"]')?.classList.add('active');
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.size-btn[data-size="normal"]')?.classList.add('active');
            
            showAlert('↺ Ajustes restablecidos', 'success');
        });
    }

    // Load saved settings
    const savedTheme = localStorage.getItem('aiPillTheme');
    const savedFont = localStorage.getItem('aiPillFont');
    const savedSize = localStorage.getItem('aiPillSize');
    
    if (savedTheme && savedTheme !== 'default') {
        document.body.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('.theme-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-theme') === savedTheme);
        });
    }
    if (savedFont && savedFont !== 'default') {
        document.body.setAttribute('data-font', savedFont);
        document.querySelectorAll('.font-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-font') === savedFont);
        });
    }
    if (savedSize && savedSize !== 'normal') {
        document.body.setAttribute('data-size', savedSize);
        document.querySelectorAll('.size-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-size') === savedSize);
        });
    }

    // ============================================
    // RELOJ DE BILBAO
    // ============================================
    function actualizarRelojBilbao() {
        const ahora = new Date();
        const hora = ahora.toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const fecha = ahora.toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', year: 'numeric' });
        const horaEl = document.getElementById('bilbaoTimeFooter');
        const fechaEl = document.getElementById('bilbaoDateFooter');
        if (horaEl) horaEl.textContent = hora;
        if (fechaEl) fechaEl.textContent = fecha;
    }
    actualizarRelojBilbao();
    setInterval(actualizarRelojBilbao, 1000);

    // ============================================
    // TABS (code examples in rules)
    // ============================================
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
            const target = document.getElementById(tabId);
            if (target) target.classList.add('active');
        });
    });

    // ============================================
    // CHECKBOX ANIMATION (checklist)
    // ============================================
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.checklist-item');
            if (!item) return;
            if (this.checked) {
                item.style.borderColor = 'var(--color-success)';
                item.style.backgroundColor = '#dcfce7';
                item.style.transform = 'scale(1.02)';
                setTimeout(() => { item.style.transform = 'scale(1)'; }, 200);
            } else {
                item.style.borderColor = '#e2e8f0';
                item.style.backgroundColor = '#f8fafc';
            }
        });
    });

    console.log('🤖 Píldora de Agentes de IA cargada correctamente');
});

// ============================================
// UTILITY: Escape HTML for safe insertion
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// CODE GENERATORS
// ============================================
function generatePythonCode(agentName, personality, purpose, tools) {
    const prompts = {
        formal: 'Eres un asistente profesional y formal. Responde de manera precisa y técnica.',
        casual: 'Eres un asistente amigable y casual. Responde de manera relajada y cercana.',
        technical: 'Eres un asistente técnico experto. Responde con detalle y precisión, incluyendo código cuando sea necesario.',
        creative: 'Eres un asistente creativo e innovador. Responde con ideas originales y enfoques únicos.'
    };
    
    const toolImports = new Set();
    const toolDefs = [];
    
    if (tools.includes('Enviar emails')) {
        toolImports.add('from langchain.tools import Tool');
        toolImports.add('import smtplib');
        toolDefs.push(`
def send_email(recipient, subject, body):
    """Envía un email al destinatario especificado"""
    # Implementación real con SMTP
    return f"Email enviado a {recipient}"`);
    }
    
    if (tools.includes('Buscar en web')) {
        toolImports.add('from langchain.utilities import GoogleSearchAPIWrapper');
        toolDefs.push(`
search = GoogleSearchAPIWrapper()`);
    }
    
    if (tools.includes('Gestionar archivos')) {
        toolDefs.push(`
def read_file(filename):
    """Lee el contenido de un archivo"""
    with open(filename, 'r') as f:
        return f.read()

def write_file(filename, content):
    """Escribe contenido en un archivo"""
    with open(filename, 'w') as f:
        f.write(content)
    return f"Archivo {filename} guardado"`);
    }
    
    const toolLines = tools.map(tool => {
        if (tool === 'Enviar emails') return '    Tool(name="SendEmail", func=send_email, description="Envía emails")';
        if (tool === 'Buscar en web') return '    Tool(name="Search", func=search.run, description="Busca en internet")';
        if (tool === 'Gestionar archivos') return '    Tool(name="ReadFile", func=read_file, description="Lee archivos"),\n    Tool(name="WriteFile", func=write_file, description="Escribe archivos")';
        if (tool === 'Calendario') return '    Tool(name="Calendar", func=lambda x: "Eventos", description="Calendario")';
        if (tool === 'APIs externas') return '    Tool(name="API", func=lambda x: "API call", description="APIs externas")';
        if (tool === 'Base de datos') return '    Tool(name="Database", func=lambda x: "Query", description="Base de datos")';
        return '';
    }).filter(Boolean);
    
    return `# ==================================================
# Agente de IA: ${agentName}
# ==================================================
# Propósito: ${purpose}
# Personalidad: ${personality}
# Herramientas: ${tools.join(', ') || 'Ninguna'}
# ==================================================

${[...toolImports].join('\n')}

from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
${toolDefs.join('\n')}

# Configurar el modelo
llm = ChatOpenAI(temperature=0.7, model_name="gpt-4")

# Configurar memoria
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# Personalidad: ${personality}
SYSTEM_PROMPT = """
${prompts[personality]}

Propósito: ${purpose}
"""

# Herramientas
tools = [
${toolLines.join(',\n')}
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

print(f"✅ Agente '${agentName}' iniciado")
print(f"🛠️  Herramientas: ${tools.length} disponibles")

# Uso
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
    const prompts = {
        formal: 'Eres un asistente profesional y formal.',
        casual: 'Eres un asistente amigable y casual.',
        technical: 'Eres un asistente técnico experto.',
        creative: 'Eres un asistente creativo e innovador.'
    };
    
    const toolLines = tools.map(tool => {
        const safeName = tool.replace(/\s+/g, '');
        return `    { name: "${safeName}", description: "${tool}", func: async (input) => \`Resultado: \${input}\` }`;
    });
    
    return `// ==================================================
// Agente de IA: ${agentName}
// ==================================================
// Propósito: ${purpose}
// Personalidad: ${personality}
// Herramientas: ${tools.join(', ') || 'Ninguna'}
// ==================================================

const { ChatOpenAI } = require('langchain/chat_models/openai');
const { BufferMemory } = require('langchain/memory');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');

const model = new ChatOpenAI({ temperature: 0.7, modelName: "gpt-4" });

const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true
});

const SYSTEM_PROMPT = \`
${prompts[personality]}
Propósito: ${purpose}
\`;

const tools = [
${toolLines.join(',\n')}
];

const agent = await initializeAgentExecutorWithOptions(
    tools, model,
    { agentType: "chat-conversational-react-description", verbose: true, memory }
);

console.log(\`✅ Agente '${agentName}' iniciado\`);
console.log(\`🛠️  Herramientas: ${tools.length} disponibles\`);

async function runAgent() {
    const prompts = ["Hola, ¿qué puedes hacer?", "Explícame tu propósito"];
    for (const prompt of prompts) {
        console.log(\`\\n👤 Tú: \${prompt}\`);
        const result = await agent.call({ input: prompt });
        console.log(\`🤖 ${agentName}: \${result.output}\`);
    }
}

runAgent().catch(console.error);
`;
}

// ============================================
// ALERT TOAST
// ============================================
function showAlert(message, type) {
    document.querySelectorAll('.alert-toast').forEach(a => a.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-toast';
    alertDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        padding: 12px 24px; border-radius: 8px;
        color: white; font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000; animation: slideIn 0.3s ease;
        max-width: 90vw; word-break: break-word;
    `;
    
    const colors = { danger: '#ef4444', success: '#10b981', warning: '#f59e0b' };
    alertDiv.style.background = colors[type] || '#10b981';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 2500);
}

// Inject animation keyframes
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
`;
document.head.appendChild(animStyle);
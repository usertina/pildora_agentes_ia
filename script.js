document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // AUTO-ADD COPY + DOWNLOAD BUTTONS TO ALL CODE BLOCKS
    // ============================================
    
    function getVisibleCode(container) {
        // Get code from active tab pane, or first pre/code
        const activePane = container.querySelector('.tab-pane.active code')
                        || container.querySelector('.tab-pane.active')
                        || container.querySelector('pre code')
                        || container.querySelector('code');
        return activePane ? activePane.textContent : '';
    }
    
    function getActiveLang(container) {
        const activeTab = container.querySelector('.tab-btn.active') || container.querySelector('.code-tab-btn.active');
        if (!activeTab) return 'python';
        const text = activeTab.textContent.toLowerCase();
        if (text.includes('javascript') || text.includes('js')) return 'javascript';
        return 'python';
    }
    
    function copyCode(container, btn) {
        const text = getVisibleCode(container);
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = '✓ Copiado';
            btn.classList.add('success');
            setTimeout(() => { btn.textContent = '📋 Copiar'; btn.classList.remove('success'); }, 2000);
        }).catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            btn.textContent = '✓ Copiado';
            btn.classList.add('success');
            setTimeout(() => { btn.textContent = '📋 Copiar'; btn.classList.remove('success'); }, 2000);
        });
    }
    
    function downloadCode(container, btn) {
        const text = getVisibleCode(container);
        if (!text) return;
        const lang = getActiveLang(container);
        const ext = lang === 'javascript' ? 'js' : 'py';
        const filename = `codigo_agente.${ext}`;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        btn.textContent = '✓ Descargado';
        btn.classList.add('success');
        setTimeout(() => { btn.textContent = '📥 Descargar'; btn.classList.remove('success'); }, 2000);
    }
    
    // Add buttons to all .code-example blocks
    document.querySelectorAll('.code-example').forEach(codeExample => {
        const btnGroup = document.createElement('div');
        btnGroup.className = 'code-action-buttons';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-action-btn';
        copyBtn.textContent = '📋 Copiar';
        copyBtn.addEventListener('click', () => copyCode(codeExample, copyBtn));
        
        const dlBtn = document.createElement('button');
        dlBtn.className = 'code-action-btn';
        dlBtn.textContent = '📥 Descargar';
        dlBtn.addEventListener('click', () => downloadCode(codeExample, dlBtn));
        
        btnGroup.appendChild(copyBtn);
        btnGroup.appendChild(dlBtn);
        codeExample.appendChild(btnGroup);
    });

    // Add buttons to generated code container too
    const codeDisplayContainer = document.querySelector('.code-display-container');
    if (codeDisplayContainer && !codeDisplayContainer.querySelector('.code-action-buttons')) {
        const btnGroup = document.createElement('div');
        btnGroup.className = 'code-action-buttons';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-action-btn';
        copyBtn.textContent = '📋 Copiar';
        copyBtn.addEventListener('click', () => copyCode(codeDisplayContainer, copyBtn));
        
        const dlBtn = document.createElement('button');
        dlBtn.className = 'code-action-btn';
        dlBtn.textContent = '📥 Descargar';
        dlBtn.addEventListener('click', () => downloadCode(codeDisplayContainer, dlBtn));
        
        btnGroup.appendChild(copyBtn);
        btnGroup.appendChild(dlBtn);
        codeDisplayContainer.appendChild(btnGroup);
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
            if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
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
    
    const agentNameInput = document.getElementById('agentName');
    const previewName = document.getElementById('previewName');
    if (agentNameInput && previewName) {
        agentNameInput.addEventListener('input', () => {
            previewName.textContent = agentNameInput.value.trim() || 'MiAgenteIA';
        });
    }
    
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
    
    const agentPurposeInput = document.getElementById('agentPurpose');
    const previewPurpose = document.getElementById('previewPurpose');
    if (agentPurposeInput && previewPurpose) {
        agentPurposeInput.addEventListener('input', () => {
            previewPurpose.textContent = agentPurposeInput.value.trim() || 'Sin propósito definido';
        });
    }
    
    const builderToolCheckboxes = document.querySelectorAll('.tools-checkbox-grid .tool-checkbox');
    const previewTools = document.getElementById('previewTools');
    
    builderToolCheckboxes.forEach(toolCheckbox => {
        const checkbox = toolCheckbox.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        toolCheckbox.addEventListener('click', (e) => {
            if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
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
    
    // Generate code
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
    
    // Tabs Python/JS
    document.querySelectorAll('.code-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            const agentName = (document.getElementById('agentName')?.value || 'MiAgenteIA').trim() || 'MiAgenteIA';
            const personality = document.querySelector('input[name="personality"]:checked')?.value || 'formal';
            const purpose = (document.getElementById('agentPurpose')?.value || '').trim() || 'Sin propósito definido';
            const tools = getSelectedBuilderTools();
            const code = lang === 'python' ? generatePythonCode(agentName, personality, purpose, tools) : generateJavaScriptCode(agentName, personality, purpose, tools);
            if (generatedCode) generatedCode.innerHTML = `<code>${escapeHtml(code)}</code>`;
        });
    });
    
    // Copy & download for generated code (standalone buttons below)
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const codeText = generatedCode?.querySelector('code')?.textContent || '';
            if (!codeText) return;
            navigator.clipboard.writeText(codeText).then(() => {
                const orig = copyCodeBtn.textContent;
                copyCodeBtn.textContent = '✓ ¡Copiado!';
                copyCodeBtn.style.background = 'var(--color-success)';
                setTimeout(() => { copyCodeBtn.textContent = orig; copyCodeBtn.style.background = ''; }, 2000);
            });
        });
    }
    
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
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click();
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
            if (settingsPanel.classList.contains('active') && !settingsPanel.contains(e.target) && !settingsWheel.contains(e.target)) {
                settingsPanel.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Theme
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const theme = btn.getAttribute('data-theme');
            if (theme === 'default') document.body.removeAttribute('data-theme');
            else document.body.setAttribute('data-theme', theme);
            localStorage.setItem('aiPillTheme', theme);
            showAlert(`🎨 Tema de código "${btn.textContent.trim()}" aplicado`, 'success');
        });
    });

    // Font
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const font = btn.getAttribute('data-font');
            if (font === 'default') document.body.removeAttribute('data-font');
            else document.body.setAttribute('data-font', font);
            localStorage.setItem('aiPillFont', font);
            showAlert(`🔤 Fuente "${btn.textContent.trim()}" aplicada`, 'success');
        });
    });

    // Size
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const size = btn.getAttribute('data-size');
            if (size === 'normal') document.body.removeAttribute('data-size');
            else document.body.setAttribute('data-size', size);
            localStorage.setItem('aiPillSize', size);
            showAlert(`🔍 Tamaño "${btn.textContent.trim()}" aplicado`, 'success');
        });
    });

    // Reset
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

    // Load saved
    const savedTheme = localStorage.getItem('aiPillTheme');
    const savedFont = localStorage.getItem('aiPillFont');
    const savedSize = localStorage.getItem('aiPillSize');
    if (savedTheme && savedTheme !== 'default') {
        document.body.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-theme') === savedTheme));
    }
    if (savedFont && savedFont !== 'default') {
        document.body.setAttribute('data-font', savedFont);
        document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-font') === savedFont));
    }
    if (savedSize && savedSize !== 'normal') {
        document.body.setAttribute('data-size', savedSize);
        document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-size') === savedSize));
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
    // TABS (code examples)
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
// UTILITIES
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generatePythonCode(agentName, personality, purpose, tools) {
    const prompts = {
        formal: 'Eres un asistente profesional y formal. Responde de manera precisa y técnica.',
        casual: 'Eres un asistente amigable y casual. Responde de manera relajada y cercana.',
        technical: 'Eres un asistente técnico experto. Responde con detalle y precisión.',
        creative: 'Eres un asistente creativo e innovador. Responde con ideas originales.'
    };
    const toolImports = new Set();
    const toolDefs = [];
    if (tools.includes('Enviar emails')) { toolImports.add('import smtplib'); toolDefs.push(`\ndef send_email(recipient, subject, body):\n    """Envía un email"""\n    return f"Email enviado a {recipient}"`); }
    if (tools.includes('Buscar en web')) { toolImports.add('from langchain.utilities import GoogleSearchAPIWrapper'); toolDefs.push(`\nsearch = GoogleSearchAPIWrapper()`); }
    if (tools.includes('Gestionar archivos')) { toolDefs.push(`\ndef read_file(filename):\n    with open(filename, 'r') as f:\n        return f.read()\n\ndef write_file(filename, content):\n    with open(filename, 'w') as f:\n        f.write(content)\n    return f"Archivo {filename} guardado"`); }
    const toolLines = tools.map(tool => {
        if (tool === 'Enviar emails') return '    Tool(name="SendEmail", func=send_email, description="Envía emails")';
        if (tool === 'Buscar en web') return '    Tool(name="Search", func=search.run, description="Busca en internet")';
        if (tool === 'Gestionar archivos') return '    Tool(name="ReadFile", func=read_file, description="Lee archivos"),\n    Tool(name="WriteFile", func=write_file, description="Escribe archivos")';
        if (tool === 'Calendario') return '    Tool(name="Calendar", func=lambda x: "Eventos", description="Calendario")';
        if (tool === 'APIs externas') return '    Tool(name="API", func=lambda x: "API call", description="APIs externas")';
        if (tool === 'Base de datos') return '    Tool(name="Database", func=lambda x: "Query", description="Base de datos")';
        return '';
    }).filter(Boolean);
    return `# Agente: ${agentName}\n# Propósito: ${purpose}\n# Personalidad: ${personality}\n\nfrom langchain.chat_models import ChatOpenAI\nfrom langchain.agents import initialize_agent, AgentType\nfrom langchain.memory import ConversationBufferMemory\nfrom langchain.tools import Tool\n${[...toolImports].join('\n')}\n${toolDefs.join('\n')}\n\nllm = ChatOpenAI(temperature=0.7, model_name="gpt-4")\n\nmemory = ConversationBufferMemory(\n    memory_key="chat_history",\n    return_messages=True\n)\n\nSYSTEM_PROMPT = """\n${prompts[personality]}\nPropósito: ${purpose}\n"""\n\ntools = [\n${toolLines.join(',\n')}\n]\n\nagent = initialize_agent(\n    tools=tools, llm=llm,\n    agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,\n    verbose=True, memory=memory\n)\n\nprint(f"✅ Agente '${agentName}' iniciado")\n\nif __name__ == "__main__":\n    while True:\n        user_input = input("\\n👤 Tú: ")\n        if user_input.lower() in ['salir', 'exit']:\n            print("👋 ¡Hasta luego!")\n            break\n        response = agent.run(user_input)\n        print(f"🤖 ${agentName}: {response}")\n`;
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
    return `// Agente: ${agentName}\n// Propósito: ${purpose}\n// Personalidad: ${personality}\n\nconst { ChatOpenAI } = require('langchain/chat_models/openai');\nconst { BufferMemory } = require('langchain/memory');\nconst { initializeAgentExecutorWithOptions } = require('langchain/agents');\n\nconst model = new ChatOpenAI({ temperature: 0.7, modelName: "gpt-4" });\nconst memory = new BufferMemory({ memoryKey: "chat_history", returnMessages: true });\n\nconst SYSTEM_PROMPT = \`\n${prompts[personality]}\nPropósito: ${purpose}\n\`;\n\nconst tools = [\n${toolLines.join(',\n')}\n];\n\nconst agent = await initializeAgentExecutorWithOptions(\n    tools, model,\n    { agentType: "chat-conversational-react-description", verbose: true, memory }\n);\n\nconsole.log(\`✅ Agente '${agentName}' iniciado\`);\n\nasync function runAgent() {\n    const prompts = ["Hola, ¿qué puedes hacer?"];\n    for (const prompt of prompts) {\n        console.log(\`\\n👤 Tú: \${prompt}\`);\n        const result = await agent.call({ input: prompt });\n        console.log(\`🤖 ${agentName}: \${result.output}\`);\n    }\n}\n\nrunAgent().catch(console.error);\n`;
}

function showAlert(message, type) {
    document.querySelectorAll('.alert-toast').forEach(a => a.remove());
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-toast';
    alertDiv.style.cssText = `position:fixed;top:20px;right:20px;padding:12px 24px;border-radius:8px;color:white;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:10000;animation:slideIn 0.3s ease;max-width:90vw;word-break:break-word;`;
    const colors = { danger: '#ef4444', success: '#10b981', warning: '#f59e0b' };
    alertDiv.style.background = colors[type] || '#10b981';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => { alertDiv.style.animation = 'slideOut 0.3s ease'; setTimeout(() => alertDiv.remove(), 300); }, 2500);
}

const animStyle = document.createElement('style');
animStyle.textContent = `@keyframes slideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}`;
document.head.appendChild(animStyle);
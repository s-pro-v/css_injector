/**
 * Panel ustawień edytora Monaco dla css.html (CSS VAR INJECTOR)
 * Użycie: loadSettings() na starcie, getEditorOptions() przy tworzeniu edytorów,
 * window.inputEditor / window.outputEditor ustawione przez stronę, showSettings() do otwarcia panelu.
 */


const CODE_EDITOR_SETTINGS_KEY = 'codeEditorSettings';
const THEME_KEY = 'cyber-refactor-theme';

let editorSettings = {
    fontSize: 14,
    fontFamily: '"JetBrains Mono", monospace',
    lineHeight: 0,
    wordWrap: 'off',
    minimap: true,
    lineNumbers: 'on',
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    tabSize: 4,
    insertSpaces: true,
    renderWhitespace: 'none',
    renderLineHighlight: 'all',
    renderIndentGuides: true,
    cursorStyle: 'line',
    cursorBlinking: 'blink',
    scrollBeyondLastLine: true,
    smoothScrolling: false,
    mouseWheelZoom: false,
    roundedSelection: false,
    formatOnPaste: false,
    formatOnType: false,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    quickSuggestions: { other: true, comments: false, strings: true },
    quickSuggestionsDelay: 100,
    autoIndent: 'full',
    bracketPairColorization: true,
    colorDecorators: true,
    folding: true,
    showFoldingControls: 'mouseover',
    matchBrackets: 'always',
    occurrencesHighlight: true,
    selectionHighlight: true,
    codeLens: false,
    links: true,
    multiCursorModifier: 'alt',
    dragAndDrop: true,
    emptySelectionClipboard: true,
    copyWithSyntaxHighlighting: true,
    cursorSmoothCaretAnimation: false,
    cursorSurroundingLines: 0,
    cursorSurroundingLinesStyle: 'default',
    stickyScroll: { enabled: false },
    guides: { bracketPairs: true }
};

const elements = {
    settingsSidebar: {
        get overlay() { return document.getElementById('settingsOverlay'); },
        get sidebar() { return document.getElementById('settingsSidebar'); },
        get body() { return document.getElementById('settingsSidebarBody'); }
    }
};

/** Referencje do edytorów (nie używaj window.inputEditor – id="inputEditor" nadpisuje to w DOM). */
let _inputEditor = null;
let _outputEditor = null;

function setEditors(inputEditor, outputEditor) {
    _inputEditor = inputEditor;
    _outputEditor = outputEditor;
}

function loadSettings() {
    const saved = localStorage.getItem(CODE_EDITOR_SETTINGS_KEY);
    if (saved) try { editorSettings = { ...editorSettings, ...JSON.parse(saved) }; } catch (e) { }
}

function getEditorOptions() {
    const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
    const monacoTheme = currentTheme === 'dark' ? 'terminal-dark' : 'terminal-light';

    return {
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily,
        lineHeight: editorSettings.lineHeight || 0,
        automaticLayout: true,
        wordWrap: editorSettings.wordWrap || 'off',
        minimap: { enabled: editorSettings.minimap },
        lineNumbersMinChars: 2,
        lineDecorationsWidth: 8,
        theme: monacoTheme,
        cursorBlinking: editorSettings.cursorBlinking || 'blink',
        cursorStyle: editorSettings.cursorStyle || 'line',
        cursorSmoothCaretAnimation: editorSettings.cursorSmoothCaretAnimation || false,
        cursorSurroundingLines: editorSettings.cursorSurroundingLines || 0,
        cursorSurroundingLinesStyle: editorSettings.cursorSurroundingLinesStyle || 'default',
        scrollBeyondLastLine: editorSettings.scrollBeyondLastLine !== false,
        roundedSelection: editorSettings.roundedSelection || false,
        renderLineHighlight: editorSettings.renderLineHighlight || 'all',
        renderIndentGuides: editorSettings.renderIndentGuides !== false,
        tabSize: editorSettings.tabSize || 4,
        insertSpaces: editorSettings.insertSpaces !== false,
        renderWhitespace: editorSettings.renderWhitespace || 'none',
        formatOnPaste: editorSettings.formatOnPaste || false,
        formatOnType: editorSettings.formatOnType || false,
        autoIndent: editorSettings.autoIndent || 'full',
        bracketPairColorization: { enabled: editorSettings.bracketPairColorization !== false },
        matchBrackets: editorSettings.matchBrackets || 'always',
        guides: editorSettings.guides || { bracketPairs: true },
        autoClosingBrackets: editorSettings.autoClosingBrackets || 'always',
        autoClosingQuotes: editorSettings.autoClosingQuotes || 'always',
        suggestOnTriggerCharacters: editorSettings.suggestOnTriggerCharacters !== false,
        acceptSuggestionOnEnter: editorSettings.acceptSuggestionOnEnter || 'on',
        acceptSuggestionOnCommitCharacter: true,
        quickSuggestions: editorSettings.quickSuggestions || { other: true, comments: false, strings: true },
        quickSuggestionsDelay: editorSettings.quickSuggestionsDelay || 100,
        snippetSuggestions: 'top',
        wordBasedSuggestions: 'matchingDocuments',
        suggestSelection: 'first',
        tabCompletion: 'on',
        suggestLocality: 'recentFiles',
        suggest: {
            showKeywords: true, showSnippets: true, showClasses: true, showFunctions: true,
            showVariables: true, showFields: true, showInterfaces: true, showStructs: true,
            showModules: true, showProperties: true, showEvents: true, showOperators: true,
            showUnits: true, showValues: true, showConstants: true, showEnums: true,
            showEnumMembers: true, showColors: true, showFiles: true, showReferences: true,
            showFolders: true, showTypeParameters: true, showIssues: true, showUsers: true,
            showText: true, showCustomcolors: true, showIcons: true
        },
        parameterHints: { enabled: true, cycle: false },
        occurrencesHighlight: editorSettings.occurrencesHighlight !== false,
        selectionHighlight: editorSettings.selectionHighlight !== false,
        colorDecorators: editorSettings.colorDecorators !== false,
        folding: editorSettings.folding !== false,
        showFoldingControls: editorSettings.showFoldingControls || 'mouseover',
        codeLens: editorSettings.codeLens || false,
        links: editorSettings.links !== false,
        mouseWheelZoom: editorSettings.mouseWheelZoom || false,
        multiCursorModifier: editorSettings.multiCursorModifier || 'alt',
        dragAndDrop: editorSettings.dragAndDrop !== false,
        emptySelectionClipboard: editorSettings.emptySelectionClipboard !== false,
        copyWithSyntaxHighlighting: editorSettings.copyWithSyntaxHighlighting !== false,
        smoothScrolling: editorSettings.smoothScrolling || false,
        stickyScroll: editorSettings.stickyScroll || { enabled: false }
    };
}

function applyEditorOptions() {
    const opts = getEditorOptions();
    if (_inputEditor && typeof _inputEditor.updateOptions === 'function') _inputEditor.updateOptions(opts);
    if (_outputEditor && typeof _outputEditor.updateOptions === 'function') _outputEditor.updateOptions(opts);
}

function buildJaSelect(settingKey, options, currentValue) {
    const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const currentOption = options.find((o) => String(o.value) === String(currentValue));
    const currentLabel = currentOption ? currentOption.label : options[0].label;
    const items = options
        .map((o) =>
            `<div class="ja-select-item ${String(o.value) === String(currentValue) ? 'ja-selected' : ''}" data-value="${esc(o.value)}"><span class="ja-select-prefix">»</span>${esc(o.label)}</div>`
        )
        .join('');
    return `<div class="ja-select-wrap" data-setting="${esc(settingKey)}">
  <button type="button" class="ja-select-btn">
    <span class="ja-select-label">${esc(currentLabel)}</span>
    <span class="ja-select-arrow">▼</span>
  </button>
  <div class="ja-select-list">${items}</div>
</div>`;
}

function bindJaSelects(container) {
    if (!container) return;
    const closeAll = () => {
        document.querySelectorAll('.ja-select-list.ja-visible').forEach((list) => list.classList.remove('ja-visible'));
        document.querySelectorAll('.ja-select-btn.ja-open').forEach((btn) => btn.classList.remove('ja-open'));
    };
    container.querySelectorAll('.ja-select-wrap').forEach((wrap) => {
        const btn = wrap.querySelector('.ja-select-btn');
        const list = wrap.querySelector('.ja-select-list');
        const labelEl = wrap.querySelector('.ja-select-label');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = list.classList.contains('ja-visible');
            closeAll();
            if (!isOpen) {
                list.classList.add('ja-visible');
                btn.classList.add('ja-open');
            }
        });
        wrap.querySelectorAll('.ja-select-item').forEach((item) => {
            item.addEventListener('click', () => {
                const key = wrap.dataset.setting;
                let v = item.getAttribute('data-value');
                if (v === 'true') v = true;
                else if (v === 'false') v = false;
                updateSetting(key, v);
                const prefix = item.querySelector('.ja-select-prefix');
                labelEl.textContent = prefix ? item.textContent.replace(prefix.textContent, '').trim() : item.textContent.trim();
                wrap.querySelectorAll('.ja-select-item').forEach((i) => i.classList.remove('ja-selected'));
                item.classList.add('ja-selected');
                list.classList.remove('ja-visible');
                btn.classList.remove('ja-open');
            });
        });
    });
    if (!window._jaSelectDocBound) {
        window._jaSelectDocBound = true;
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ja-select-wrap')) return;
            closeAll();
        });
    }
}

function closeSettings() {
    const s = elements.settingsSidebar;
    if (s.sidebar) s.sidebar.classList.remove('active');
    if (s.overlay) s.overlay.classList.remove('active');
}

function switchSettingsTab(tabId) {
    document.querySelectorAll('.settings-tab').forEach((el) => el.classList.remove('active'));
    document.querySelectorAll('.settings-tab-content').forEach((el) => el.classList.remove('active'));
    const tab = document.querySelector('.settings-tab[data-tab="' + tabId + '"]');
    if (tab) tab.classList.add('active');
    const content = document.getElementById('settings-' + tabId);
    if (content) content.classList.add('active');
}

function updateSetting(key, value) {
    editorSettings[key] = value;
    localStorage.setItem(CODE_EDITOR_SETTINGS_KEY, JSON.stringify(editorSettings));
    applyEditorOptions();
}

function showSettings() {
    const sb = elements.settingsSidebar.body;
    const s = elements.settingsSidebar;
    if (!sb || !s.sidebar || !s.overlay) return;
    const html = `
<div class="settings-tabs">
    <div class="settings-tab active" data-tab="general" onclick="switchSettingsTab('general')"><i class="fas fa-cog settings-tab-icon"></i> GENERAL</div>
    <div class="settings-tab" data-tab="cursor" onclick="switchSettingsTab('cursor')"><i class="fas fa-mouse-pointer settings-tab-icon"></i> CURSOR</div>
    <div class="settings-tab" data-tab="formatting" onclick="switchSettingsTab('formatting')"><i class="fas fa-code settings-tab-icon"></i> FORMATTING</div>
    <div class="settings-tab" data-tab="display" onclick="switchSettingsTab('display')"><i class="fas fa-eye settings-tab-icon"></i> DISPLAY</div>
    <div class="settings-tab" data-tab="advanced" onclick="switchSettingsTab('advanced')"><i class="fas fa-sliders-h settings-tab-icon"></i> ADVANCED</div>
</div>
<div id="settings-general" class="settings-tab-content active">
    <div class="setting-item setting-range">
        <label class="setting-label"><i class="fas fa-font setting-icon"></i> Font Size</label>
        <div class="setting-control">
            <input type="range" min="10" max="24" value="${editorSettings.fontSize}" onchange="updateSetting('fontSize', parseInt(this.value))" oninput="this.nextElementSibling.textContent = this.value + 'px'">
            <span class="setting-value">${editorSettings.fontSize}px</span>
        </div>
    </div>
    <div class="setting-item setting-range">
        <label class="setting-label"><i class="fas fa-text-height setting-icon"></i> Line Height</label>
        <div class="setting-control">
            <input type="range" min="0" max="50" value="${editorSettings.lineHeight || 0}" onchange="updateSetting('lineHeight', parseInt(this.value))" oninput="this.nextElementSibling.textContent = (this.value == 0 ? 'Auto' : this.value + 'px')">
            <span class="setting-value">${editorSettings.lineHeight === 0 ? 'Auto' : editorSettings.lineHeight + 'px'}</span>
        </div>
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-font setting-icon"></i> Font Family</label>
        ${buildJaSelect('fontFamily', [
        { value: '"JetBrains Mono", monospace', label: 'JetBrains Mono' },
        { value: '"Share Tech Mono", monospace', label: 'Share Tech Mono' },
        { value: '"Courier New", monospace', label: 'Courier New' },
        { value: 'monospace', label: 'System Monospace' }
    ], editorSettings.fontFamily)}
    </div>
    <div class="setting-item setting-range">
        <label class="setting-label"><i class="fas fa-indent setting-icon"></i> Tab Size</label>
        <div class="setting-control">
            <input type="range" min="2" max="8" value="${editorSettings.tabSize}" onchange="updateSetting('tabSize', parseInt(this.value))" oninput="this.nextElementSibling.textContent = this.value">
            <span class="setting-value">${editorSettings.tabSize}</span>
        </div>
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-text-width setting-icon"></i> Word Wrap</label>
        ${buildJaSelect('wordWrap', [{ value: 'on', label: 'ON' }, { value: 'off', label: 'OFF' }], editorSettings.wordWrap)}
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-map setting-icon"></i> Minimap <input type="checkbox" ${editorSettings.minimap ? 'checked' : ''} onchange="updateSetting('minimap', this.checked)"></label>
    </div>
</div>
<div id="settings-cursor" class="settings-tab-content">
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-mouse-pointer setting-icon"></i> Cursor Style</label>
        ${buildJaSelect('cursorStyle', [
        { value: 'line', label: 'LINE' }, { value: 'block', label: 'BLOCK' },
        { value: 'underline', label: 'UNDERLINE' }, { value: 'line-thin', label: 'LINE THIN' },
        { value: 'block-outline', label: 'BLOCK OUTLINE' }
    ], editorSettings.cursorStyle)}
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-circle setting-icon"></i> Cursor Blinking</label>
        ${buildJaSelect('cursorBlinking', [
        { value: 'blink', label: 'BLINK' }, { value: 'smooth', label: 'SMOOTH' },
        { value: 'phase', label: 'PHASE' }, { value: 'expand', label: 'EXPAND' },
        { value: 'solid', label: 'SOLID' }
    ], editorSettings.cursorBlinking)}
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-magic setting-icon"></i> Smooth Caret Animation <input type="checkbox" ${editorSettings.cursorSmoothCaretAnimation ? 'checked' : ''} onchange="updateSetting('cursorSmoothCaretAnimation', this.checked)"></label>
    </div>
</div>
<div id="settings-formatting" class="settings-tab-content">
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-brackets-curly setting-icon"></i> Auto Close Brackets</label>
        ${buildJaSelect('autoClosingBrackets', [
        { value: 'always', label: 'ALWAYS' }, { value: 'languageDefined', label: 'LANGUAGE DEFINED' },
        { value: 'beforeWhitespace', label: 'BEFORE WHITESPACE' }, { value: 'never', label: 'NEVER' }
    ], editorSettings.autoClosingBrackets)}
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-quote-right setting-icon"></i> Auto Close Quotes</label>
        ${buildJaSelect('autoClosingQuotes', [
        { value: 'always', label: 'ALWAYS' }, { value: 'languageDefined', label: 'LANGUAGE DEFINED' },
        { value: 'beforeWhitespace', label: 'BEFORE WHITESPACE' }, { value: 'never', label: 'NEVER' }
    ], editorSettings.autoClosingQuotes)}
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-palette setting-icon"></i> Bracket Pair Colorization <input type="checkbox" ${editorSettings.bracketPairColorization ? 'checked' : ''} onchange="updateSetting('bracketPairColorization', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-code-branch setting-icon"></i> Folding <input type="checkbox" ${editorSettings.folding ? 'checked' : ''} onchange="updateSetting('folding', this.checked)"></label>
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-indent setting-icon"></i> Insert Spaces</label>
        ${buildJaSelect('insertSpaces', [{ value: true, label: 'SPACES' }, { value: false, label: 'TABS' }], editorSettings.insertSpaces)}
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-align-left setting-icon"></i> Auto Indent</label>
        ${buildJaSelect('autoIndent', [
        { value: 'none', label: 'NONE' }, { value: 'keep', label: 'KEEP' },
        { value: 'brackets', label: 'BRACKETS' }, { value: 'advanced', label: 'ADVANCED' },
        { value: 'full', label: 'FULL' }
    ], editorSettings.autoIndent)}
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-paste setting-icon"></i> Format on Paste <input type="checkbox" ${editorSettings.formatOnPaste ? 'checked' : ''} onchange="updateSetting('formatOnPaste', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-keyboard setting-icon"></i> Format on Type <input type="checkbox" ${editorSettings.formatOnType ? 'checked' : ''} onchange="updateSetting('formatOnType', this.checked)"></label>
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-brackets-curly setting-icon"></i> Match Brackets</label>
        ${buildJaSelect('matchBrackets', [
        { value: 'always', label: 'ALWAYS' }, { value: 'near', label: 'NEAR' },
        { value: 'never', label: 'NEVER' }
    ], editorSettings.matchBrackets)}
    </div>
</div>
<div id="settings-display" class="settings-tab-content">
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-eye-slash setting-icon"></i> Render Whitespace</label>
        ${buildJaSelect('renderWhitespace', [
        { value: 'none', label: 'NONE' }, { value: 'boundary', label: 'BOUNDARY' },
        { value: 'selection', label: 'SELECTION' }, { value: 'trailing', label: 'TRAILING' },
        { value: 'all', label: 'ALL' }
    ], editorSettings.renderWhitespace)}
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-align-left setting-icon"></i> Render Indent Guides <input type="checkbox" ${editorSettings.renderIndentGuides ? 'checked' : ''} onchange="updateSetting('renderIndentGuides', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-arrows-alt-v setting-icon"></i> Scroll Beyond Last Line <input type="checkbox" ${editorSettings.scrollBeyondLastLine ? 'checked' : ''} onchange="updateSetting('scrollBeyondLastLine', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-search-plus setting-icon"></i> Mouse Wheel Zoom <input type="checkbox" ${editorSettings.mouseWheelZoom ? 'checked' : ''} onchange="updateSetting('mouseWheelZoom', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-highlighter setting-icon"></i> Occurrences Highlight <input type="checkbox" ${editorSettings.occurrencesHighlight ? 'checked' : ''} onchange="updateSetting('occurrencesHighlight', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-marker setting-icon"></i> Selection Highlight <input type="checkbox" ${editorSettings.selectionHighlight ? 'checked' : ''} onchange="updateSetting('selectionHighlight', this.checked)"></label>
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-highlighter setting-icon"></i> Render Line Highlight</label>
        ${buildJaSelect('renderLineHighlight', [
        { value: 'none', label: 'NONE' }, { value: 'gutter', label: 'GUTTER' },
        { value: 'line', label: 'LINE' }, { value: 'all', label: 'ALL' }
    ], editorSettings.renderLineHighlight)}
    </div>
</div>
<div id="settings-advanced" class="settings-tab-content">
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-palette setting-icon"></i> Color Decorators <input type="checkbox" ${editorSettings.colorDecorators ? 'checked' : ''} onchange="updateSetting('colorDecorators', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-link setting-icon"></i> Links <input type="checkbox" ${editorSettings.links !== false ? 'checked' : ''} onchange="updateSetting('links', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-code setting-icon"></i> Code Lens <input type="checkbox" ${editorSettings.codeLens ? 'checked' : ''} onchange="updateSetting('codeLens', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-mouse setting-icon"></i> Drag and Drop <input type="checkbox" ${editorSettings.dragAndDrop !== false ? 'checked' : ''} onchange="updateSetting('dragAndDrop', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-copy setting-icon"></i> Empty Selection Clipboard <input type="checkbox" ${editorSettings.emptySelectionClipboard !== false ? 'checked' : ''} onchange="updateSetting('emptySelectionClipboard', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-highlighter setting-icon"></i> Copy with Syntax Highlighting <input type="checkbox" ${editorSettings.copyWithSyntaxHighlighting !== false ? 'checked' : ''} onchange="updateSetting('copyWithSyntaxHighlighting', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-sliders-h setting-icon"></i> Smooth Scrolling <input type="checkbox" ${editorSettings.smoothScrolling ? 'checked' : ''} onchange="updateSetting('smoothScrolling', this.checked)"></label>
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-circle setting-icon"></i> Rounded Selection <input type="checkbox" ${editorSettings.roundedSelection ? 'checked' : ''} onchange="updateSetting('roundedSelection', this.checked)"></label>
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-mouse-pointer setting-icon"></i> Multi Cursor Modifier</label>
        ${buildJaSelect('multiCursorModifier', [
        { value: 'ctrlCmd', label: 'CTRL/CMD' },
        { value: 'alt', label: 'ALT' }
    ], editorSettings.multiCursorModifier)}
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-code-branch setting-icon"></i> Show Folding Controls</label>
        ${buildJaSelect('showFoldingControls', [
        { value: 'always', label: 'ALWAYS' }, { value: 'mouseover', label: 'MOUSEOVER' },
        { value: 'never', label: 'NEVER' }
    ], editorSettings.showFoldingControls)}
    </div>
    <div class="setting-item">
        <label class="setting-label"><i class="fas fa-lightbulb setting-icon"></i> Suggest on Trigger Characters <input type="checkbox" ${editorSettings.suggestOnTriggerCharacters !== false ? 'checked' : ''} onchange="updateSetting('suggestOnTriggerCharacters', this.checked)"></label>
    </div>
    <div class="setting-item setting-select">
        <label class="setting-label"><i class="fas fa-keyboard setting-icon"></i> Accept Suggestion on Enter</label>
        ${buildJaSelect('acceptSuggestionOnEnter', [
        { value: 'on', label: 'ON' }, { value: 'smart', label: 'SMART' },
        { value: 'off', label: 'OFF' }
    ], editorSettings.acceptSuggestionOnEnter)}
    </div>
    <div class="setting-item setting-range">
        <label class="setting-label"><i class="fas fa-clock setting-icon"></i> Quick Suggestions Delay</label>
        <div class="setting-control">
            <input type="range" min="0" max="1000" step="50" value="${editorSettings.quickSuggestionsDelay || 100}" onchange="updateSetting('quickSuggestionsDelay', parseInt(this.value))" oninput="this.nextElementSibling.textContent = this.value + 'ms'">
            <span class="setting-value">${editorSettings.quickSuggestionsDelay || 100}ms</span>
        </div>
    </div>
</div>`;
    sb.innerHTML = html;
    bindJaSelects(sb);
    s.sidebar.classList.add('active');
    s.overlay.classList.add('active');
}

if (typeof window !== 'undefined') {
    window.MonacoEditorSettings = {
        loadSettings,
        getEditorOptions,
        applyEditorOptions,
        setEditors,
        showSettings,
        closeSettings,
        switchSettingsTab,
        updateSetting
    };
}

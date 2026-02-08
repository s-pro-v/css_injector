let inputEditor, outputEditor;
let detectedMatches = [];
let selectedMatchId = -1;
let currentSelectionDecorations = [];
let appliedDecorations = [];

const systemVars = [
    'var(--bg-color)', 'var(--border-color)', 'var(--border-color-hover)', 'var(--highlight-color)',
    'var(--success-color)', 'var(--bg)', 'var(--bg-primary)', 'var(--bg-secondary)', 'var(--bg-tertiary)',
    'var(--panel-bg)', 'var(--card-bg)', 'var(--text-color)', 'var(--text-primary)', 'var(--text-muted)',
    'var(--hover-bg)', 'var(--shadow-drop)', 'var(--shadow-inset)', 'var(--shadow-hover)'
];

function isSystemVar(val) {
    const v = (val || '').trim().replace(/\s+/g, ' ');
    return systemVars.some(s => v === s || v === s.replace(/\s+/g, ' '));
}

const varLibrary = {
    color: ['var(--text-color)', 'var(--text-muted)', 'var(--text-primary)', 'var(--text-inverse)'],
    background: ['var(--bg-tertiary)', 'var(--hover-bg)', 'var(--bg-primary)', 'var(--panel-bg)', 'var(--bg-color)'],
    border: ['var(--border-color)', 'var(--border-color-hover)'],
    shadow: ['var(--shadow-drop)', 'var(--shadow-inset)', 'var(--shadow-hover)']
};

/**
 * Schemat: klasyfikacja selektora, żeby nie ujednolicać kolorów.
 * Różne typy elementów dostają różne zmienne (primary/muted/panel/card itd.).
 */
function getSelectorRole(selector) {
    const s = (selector || '').toLowerCase().replace(/:+hover|:active|:focus[\w-]*/g, '').trim();
    if (!s) return 'default';
    // Nagłówki — tekst główny
    if (/^h[1-6]\b|\.(title|heading|headline)/.test(s) || /\b(h[1-6]|\.title|\.heading)\b/.test(s)) return 'heading';
    // Przyciski, CTA
    if (/\b(btn|button|cta|action)\b/.test(s)) return 'button';
    // Linki
    if (/\ba\b|\.(link|nav)\b/.test(s)) return 'link';
    // Karty, bloki treści
    if (/\b(card|tile|block|box)\b/.test(s)) return 'card';
    // Panele, sidebar, nawigacja boczna
    if (/\b(panel|sidebar|aside|nav|menu)\b/.test(s)) return 'panel';
    // Formularze, inputy
    if (/\b(input|form|field|control)\b/.test(s)) return 'input';
    // Ściśle drugoplanowy tekst
    if (/\b(muted|caption|secondary|hint|placeholder|meta)\b/.test(s)) return 'muted';
    // Ściśle główny akcent
    if (/\b(primary|lead|hero)\b/.test(s)) return 'primary';
    // Element na ciemnym tle (np. przycisk primary)
    if (/\b(inverse|dark|overlay)\b/.test(s)) return 'inverse';
    return 'default';
}

/** Prosty hash tekstu → liczba (do rotacji zmiennych przy "default"). */
function hashSelector(selector) {
    let h = 0;
    const str = String(selector || '');
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i) | 0;
    return Math.abs(h);
}

/** Mapuje dopasowanie (prop + selector + stan) na zmienną systemową według schematu. */
function getTargetVar(match) {
    if (!match || !match.prop) return null;
    const sel = (match.selector || '').toLowerCase();
    const isHover = sel.includes(':hover');
    const isActive = sel.includes(':active');
    const isFocus = sel.includes(':focus');
    const isInteractive = isHover || isActive || isFocus;
    const role = getSelectorRole(match.selector);
    const h = hashSelector(match.selector);

    if (match.prop.startsWith('border')) {
        return isInteractive ? 'var(--border-color-hover)' : 'var(--border-color)';
    }

    if (match.prop === 'color') {
        if (isInteractive) return 'var(--text-color)';
        switch (role) {
            case 'heading': return 'var(--text-primary)';
            case 'button': return 'var(--text-muted)';
            case 'link': return 'var(--text-muted)';
            case 'muted': return 'var(--text-muted)';
            case 'primary': return 'var(--text-primary)';
            case 'inverse': return 'var(--text-inverse)';
            case 'card':
            case 'panel': return (h % 2 === 0) ? 'var(--text-primary)' : 'var(--text-muted)';
            default: return (h % 2 === 0) ? 'var(--text-primary)' : 'var(--text-muted)';
        }
    }

    if (match.prop.startsWith('background')) {
        if (isInteractive) return 'var(--hover-bg)';
        switch (role) {
            case 'card': return 'var(--card-bg)';
            case 'panel': return 'var(--panel-bg)';
            case 'button':
            case 'input': return 'var(--bg-tertiary)';
            case 'heading': return (h % 2 === 0) ? 'var(--bg-primary)' : 'var(--bg-tertiary)';
            default:
                const idx = h % 3;
                return idx === 0 ? 'var(--bg-primary)' : idx === 1 ? 'var(--bg-secondary)' : 'var(--bg-tertiary)';
        }
    }

    if (match.prop === 'box-shadow') {
        if (isActive || isFocus) return 'var(--shadow-inset)';
        if (isHover) return 'var(--shadow-hover)';
        return 'var(--shadow-drop)';
    }
    return null;
}

const ThemeManager = {
    save: (t) => localStorage.setItem('cyber-refactor-theme', t),
    load: () => localStorage.getItem('cyber-refactor-theme') || 'light',
    apply: (t) => {
        document.documentElement.setAttribute('theme', t === 'dark' ? 'dark' : '');
        ThemeManager.save(t);
        if (window.monaco) monaco.editor.setTheme(t === 'dark' ? 'terminal-dark' : 'terminal-light');
        if (window.MonacoEditorSettings) window.MonacoEditorSettings.applyEditorOptions();
    }
};

if (typeof MonacoEditorSettings !== 'undefined') MonacoEditorSettings.loadSettings();

const SIDEBAR_STORAGE_KEY = 'cyber-refactor-sidebar-width';
const SIDEBAR_MIN = 240;
const SIDEBAR_MAX = 720;
const SNAP_POINTS = [280, 320, 400, 480, 560];
const SNAP_THRESHOLD = 14;

function getSidebarWidth() {
    const container = document.querySelector('.main-container');
    const raw = container ? getComputedStyle(container).getPropertyValue('--sidebar-width').trim() : '';
    const px = parseInt(raw, 10);
    return isNaN(px) ? 400 : Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, px));
}

function setSidebarWidth(px) {
    const w = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, px));
    const container = document.querySelector('.main-container');
    if (container) container.style.setProperty('--sidebar-width', w + 'px');
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(w));
}

function snapToMagnetic(px) {
    for (const point of SNAP_POINTS) {
        if (Math.abs(px - point) <= SNAP_THRESHOLD) return point;
    }
    return px;
}

function initResizeHandles() {
    const container = document.querySelector('.main-container');
    const sidebar = document.getElementById('sidebarCol');
    const gutterLeft = document.getElementById('gutterLeft');
    const gutterRight = document.getElementById('gutterRight');
    if (!container || !sidebar || !gutterLeft || !gutterRight) return;
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (saved) {
        const w = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, parseInt(saved, 10)));
        if (!isNaN(w)) container.style.setProperty('--sidebar-width', w + 'px');
    }

    function startDrag(side) {
        gutterLeft.classList.toggle('resizing', true);
        gutterRight.classList.toggle('resizing', true);
        function move(e) {
            const cr = container.getBoundingClientRect();
            const sr = sidebar.getBoundingClientRect();
            let w;
            if (side === 'left') w = sr.right - e.clientX;
            else w = e.clientX - sr.left;
            w = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, w));
            w = snapToMagnetic(w);
            setSidebarWidth(w);
        }
        function stop() {
            const w = snapToMagnetic(getSidebarWidth());
            setSidebarWidth(w);
            gutterLeft.classList.remove('resizing');
            gutterRight.classList.remove('resizing');
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', stop);
            if (inputEditor) inputEditor.layout();
            if (outputEditor) outputEditor.layout();
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);
    }

    gutterLeft.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag('left'); });
    gutterRight.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag('right'); });
}

document.addEventListener('DOMContentLoaded', initResizeHandles);

require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    if (window.defineMonacoThemes) defineMonacoThemes();
    ThemeManager.apply(ThemeManager.load());

    const options = {
        language: 'css',
        ...MonacoEditorSettings.getEditorOptions(),
        value: ''
    };

    inputEditor = monaco.editor.create(document.getElementById('inputEditor'), {
        ...options,
        value: `.btn {\n  background: #ffffff;\n  color: #6c757d;\n  border: 1px solid #dee2e6;\n}\n\n.btn:hover {\n  background: rgba(0,0,0,0.05);\n  color: #212529;\n}`
    });

    outputEditor = monaco.editor.create(document.getElementById('outputEditor'), {
        ...options,
        value: ''
    });

    MonacoEditorSettings.setEditors(inputEditor, outputEditor);

    // Event: Selection Change in Workbench
    outputEditor.onDidChangeCursorSelection((e) => {
        handleSelectionChange(e);
    });

    loadSourceToWorkbench();
});

function handleSelectionChange(e) {
    if (!outputEditor) return;
    const model = outputEditor.getModel();
    if (!model) return;
    const contextPanel = document.getElementById('selectionContext');
    if (!contextPanel) return;

    const selection = outputEditor.getSelection();
    const selectedText = model.getValueInRange(selection);
    const selectionType = document.getElementById('selectionType');
    const selectionVars = document.getElementById('selectionVars');

    if (!selectedText || selectedText.trim().length === 0) {
        contextPanel.style.display = 'none';
        return;
    }

    // Get full line to determine property
    const lineContent = model.getLineContent(selection.startLineNumber);
    contextPanel.style.display = 'block';

    let type = 'general';
    if (lineContent.includes('color')) type = 'color';
    if (lineContent.includes('background')) type = 'background';
    if (lineContent.includes('border')) type = 'border';
    if (lineContent.includes('shadow')) type = 'shadow';

    if (selectionType) selectionType.innerText = `CONTEXT: ${type.toUpperCase()}`;

    // Populate relevant variables
    if (selectionVars) {
        selectionVars.innerHTML = '';
        const targets = varLibrary[type] || Object.values(varLibrary).flat();
        [...new Set(targets)].forEach(v => {
            const btn = document.createElement('button');
            btn.className = 'var-btn';
            btn.style.setProperty('--btn-preview', v);
            btn.innerText = v.replace('var(--', '').replace(')', '');
            btn.onclick = () => injectAtSelection(v);
            selectionVars.appendChild(btn);
        });
    }
}

function injectAtSelection(varName) {
    if (!outputEditor) return;
    const selection = outputEditor.getSelection();
    outputEditor.executeEdits('selection-inject', [{
        range: selection,
        text: varName,
        forceMoveMarkers: true
    }]);
    setTimeout(refreshScanner, 100);
}

function loadSourceToWorkbench() {
    if (!inputEditor || !outputEditor) return;
    outputEditor.setValue(inputEditor.getValue());
    refreshScanner();
}

function refreshScanner() {
    if (!outputEditor) return;
    const css = outputEditor.getValue();
    const regex = /(border(?:-bottom|-top|-left|-right|-color)?|background(?:-color)?|box-shadow|color)\s*:\s*([^;]+);/gi;

    detectedMatches = [];
    const listContainer = document.getElementById('detectedList');
    const footerLog = document.getElementById('footerLog');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    let match;
    let counter = 0;
    let occurrences = {};

    while ((match = regex.exec(css)) !== null) {
        const prop = match[1].toLowerCase().trim();
        const val = match[2].trim();
        const fullLine = match[0];

        // Pomiń tylko wartości już będące zmiennymi systemowymi; inne var() i hex/rgba dodaj do listy
        if (!isSystemVar(val)) {
            const preText = css.substring(0, match.index);
            const lastBraceIndex = preText.lastIndexOf('{');
            const lastBlockStart = preText.lastIndexOf('}', lastBraceIndex);
            const selector = preText.substring(lastBlockStart + 1, lastBraceIndex).trim();

            occurrences[fullLine] = (occurrences[fullLine] || 0) + 1;
            const canAutoInject = true;

            const matchData = {
                full: fullLine, prop, val, id: counter,
                occurrenceIndex: occurrences[fullLine] - 1,
                selector: selector
            };
            detectedMatches.push(matchData);

            const div = document.createElement('div');
            div.className = 'detected-row auto-ready';
            div.innerHTML = `<div><span style="opacity:0.5; font-size:0.6rem">${selector}</span><br><strong>${prop}</strong>: ${val}</div>`;
            div.onclick = () => selectInEditor(matchData);
            div.dataset.id = counter;
            listContainer.appendChild(div);
            counter++;
        }
    }
    if (footerLog) footerLog.innerText = `IDENTIFIED: ${counter}`;
}

function selectInEditor(match) {
    if (!outputEditor) return;
    const model = outputEditor.getModel();
    if (!model) return;
    const matches = model.findMatches(match.full, false, false, true, null, true);
    const targetMatch = matches[match.occurrenceIndex];

    if (targetMatch) {
        outputEditor.setSelection(targetMatch.range);
        outputEditor.revealRangeInCenter(targetMatch.range, monaco.editor.ScrollType.Smooth);

        currentSelectionDecorations = outputEditor.deltaDecorations(currentSelectionDecorations, [
            { range: targetMatch.range, options: { isWholeLine: true, className: 'monaco-line-highlight' } }
        ]);
    }
}

function runSmartAutoRefactor() {
    if (!outputEditor) return;
    const model = outputEditor.getModel();
    if (!model) return;
    const edits = [];

    detectedMatches.forEach(match => {
        const targetVar = getTargetVar(match);
        if (targetVar) {
            const ranges = model.findMatches(match.full, false, false, true, null, true);
            const targetRange = ranges[match.occurrenceIndex];
            if (targetRange) {
                edits.push({ range: targetRange.range, text: `${match.prop}: ${targetVar};`, forceMoveMarkers: true });
            }
        }
    });

    if (edits.length === 0) return;

    // Monaco: "Overlapping ranges are not allowed" — usuń duplikaty i nakładające się zakresy
    const posLeq = (l1, c1, l2, c2) => l1 < l2 || (l1 === l2 && c1 <= c2);
    const rangesOverlap = (a, b) =>
        posLeq(a.startLineNumber, a.startColumn, b.endLineNumber, b.endColumn) &&
        posLeq(b.startLineNumber, b.startColumn, a.endLineNumber, a.endColumn);

    const uniqueEdits = [];
    for (const ed of edits) {
        const isDup = uniqueEdits.some((e) =>
            e.range.startLineNumber === ed.range.startLineNumber &&
            e.range.startColumn === ed.range.startColumn &&
            e.range.endLineNumber === ed.range.endLineNumber &&
            e.range.endColumn === ed.range.endColumn);
        if (isDup) continue;
        const overlaps = uniqueEdits.some((e) => rangesOverlap(e.range, ed.range));
        if (!overlaps) uniqueEdits.push(ed);
    }

    if (uniqueEdits.length === 0) return;

    outputEditor.executeEdits('smart-auto-map', uniqueEdits);
    setTimeout(refreshScanner, 100);
}

function applyVar(varName) {
    if (!outputEditor) return;
    // Fallback to manual selection if no row selected
    const selection = outputEditor.getSelection();
    if (!selection.isEmpty()) {
        injectAtSelection(varName);
        return;
    }

    // Row logic if needed...
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) themeToggle.onclick = () => ThemeManager.apply(ThemeManager.load() === 'dark' ? 'light' : 'dark');

const copyBtn = document.getElementById('copyBtn');
if (copyBtn) copyBtn.onclick = () => {
    if (!outputEditor) return;
    const val = outputEditor.getValue();
    const textArea = document.createElement("textarea");
    textArea.value = val; document.body.appendChild(textArea);
    textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);
    const btn = document.getElementById('copyBtn');
    if (btn) { btn.innerText = '[SYNCED]'; setTimeout(() => btn.innerText = '[EXTRACT_CODE]', 2000); }
};
// Funkcja do definiowania motywów Monaco - wywoływana natychmiast gdy Monaco jest dostępne
function defineMonacoThemes() {
    // Sprawdzamy czy Monaco jest załadowane
    if (typeof monaco === 'undefined' || !monaco.editor) {
        console.warn('Monaco Editor not available yet');
        return false;
    }

    try {
        // Definicja ciemnego motywu z pełnym mapowaniem palety CORE
        monaco.editor.defineTheme('terminal-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // OGÓLNE
                { token: 'comment', foreground: '4d595f', fontStyle: 'bold' },
                { token: 'keyword', foreground: 'b267e6', fontStyle: 'bold' },
                { token: 'string', foreground: '21fd6b' },
                { token: 'number', foreground: 'F39C12' },
                { token: 'identifier', foreground: '00ffd9', fontStyle: 'bold' },
                { token: 'type', foreground: 'f859b1' },
                { token: 'delimiter', foreground: 'aaa8a8ec' },
                { token: 'operator', foreground: '2493fa' },
                { token: 'regexp', foreground: '21fd6b' },

                // HTML
                { token: 'tag', foreground: '00B2FF', fontStyle: 'bold' },
                { token: 'tag.html', foreground: '00B2FF', fontStyle: 'bold' },
                { token: 'attribute.name', foreground: 'fed404', fontStyle: 'bold' },
                { token: 'attribute.name.html', foreground: 'fed404', fontStyle: 'bold' },
                { token: 'attribute.value', foreground: '37E7AC' },
                { token: 'attribute.value.html', foreground: '37E7AC' },
                { token: 'metatag', foreground: '1ab2f8' },
                { token: 'metatag.content.html', foreground: 'c5c5c5' },
                { token: 'entity.other.attribute-name.id.html', foreground: 'f64ab4' },
                { token: 'punctuation.definition.tag.html', foreground: '0587c4' },

                // CSS
                { token: 'tag.css', foreground: '00B2FF', fontStyle: 'bold' },
                { token: 'attribute.name.css', foreground: '37E7AC' },
                { token: 'attribute.value.css', foreground: 'FED604' },
                { token: 'string.css', foreground: 'FED604' },
                { token: 'number.css', foreground: 'FED604' },
                { token: 'keyword.css', foreground: 'ab54fd', fontStyle: 'bold' },
                { token: 'type.css', foreground: '37E7AC' },
                { token: 'comment.css', foreground: '4d595f', fontStyle: 'bold' },
                { token: 'variable.css', foreground: 'f15a4c' },
                { token: 'variable.predefined.css', foreground: 'f15a4c' },
                { token: 'entity.other.attribute-name.class.css', foreground: 'c34ef1', fontStyle: 'bold' },
                { token: 'entity.other.attribute-name.id.css', foreground: 'CC6699', fontStyle: 'bold' },
                { token: 'support.type.property-name.css', foreground: '37E7AC' },
                { token: 'constant.other.color.rgb-value.hex.css', foreground: 'FED604' },
                { token: 'constant.numeric.css', foreground: 'FED604' },
                { token: 'keyword.control.at-rule.media.css', foreground: 'ab54fd' },
                { token: 'support.function.misc.css', foreground: 'F39C12' },
                { token: 'support.function.calc.css', foreground: 'F39C12' },
                { token: 'support.function.gradient.css', foreground: 'F39C12' },
                { token: 'entity.other.attribute-name.pseudo-class.css', foreground: 'd63384' },

                // JAVASCRIPT
                { token: 'keyword.js', foreground: 'b267e6', fontStyle: 'bold' },
                { token: 'string.js', foreground: '21fd6b' },
                { token: 'number.js', foreground: 'F39C12' },
                { token: 'identifier.js', foreground: '00ffd9', fontStyle: 'bold' },
                { token: 'type.js', foreground: 'f859b1' },
                { token: 'comment.js', foreground: '4D595F', fontStyle: 'bold' },
                { token: 'comment.block.js', foreground: '4D595F', fontStyle: 'bold' },
                { token: 'comment.line.js', foreground: '4D595F', fontStyle: 'bold' },
                { token: 'variable.js', foreground: '00ffd9', fontStyle: 'bold' },
                { token: 'variable.predefined.js', foreground: '00ffd9', fontStyle: 'bold' },
                { token: 'variable.parameter.js', foreground: '00ffd9' },
                { token: 'function.js', foreground: 'FED604', fontStyle: 'bold' },
                { token: 'function.call.js', foreground: 'FED604', fontStyle: 'bold' },
                { token: 'entity.name.function.js', foreground: 'FED604', fontStyle: 'bold' },
                { token: 'property.js', foreground: 'FED604', fontStyle: 'bold' },
                { token: 'variable.other.property.js', foreground: 'FED604', fontStyle: 'bold' },
                { token: 'operator.js', foreground: 'E2E2E2EC' },
                { token: 'regexp.js', foreground: '21fd6b' },
                { token: 'constant.js', foreground: '2493fa', fontStyle: 'bold' },
                { token: 'constant.numeric.js', foreground: 'F39C12' },
                { token: 'constant.language.js', foreground: '2493fa', fontStyle: 'bold' },
                { token: 'constant.language.boolean.true.js', foreground: '46fc55' },
                { token: 'constant.language.boolean.false.js', foreground: 'ee1f18' },
                { token: 'constant.language.null.js', foreground: '2493fa', fontStyle: 'bold' },
                { token: 'constant.language.undefined.js', foreground: '2493fa', fontStyle: 'bold' },
                { token: 'support.function.js', foreground: 'FED604', fontStyle: 'bold' },
                { token: 'support.class.js', foreground: 'f859b1', fontStyle: 'bold' },
                { token: 'support.type.js', foreground: 'f859b1' },
                { token: 'support.variable.js', foreground: '00ffd9', fontStyle: 'bold' },
                { token: 'entity.name.class.js', foreground: 'f859b1' },
                { token: 'entity.name.type.js', foreground: 'f859b1' },
                { token: 'storage.type.js', foreground: 'b267e6', fontStyle: 'bold' },
                { token: 'storage.modifier.js', foreground: 'b267e6', fontStyle: 'bold' },
                { token: 'storage.modifier.async.js', foreground: '2493fa', fontStyle: 'bold' },
                { token: 'variable.language.this.js', foreground: 'f859b1', fontStyle: 'bold' },
                { token: 'meta.function-call.js', foreground: 'F39C12', fontStyle: 'bold' },
                { token: 'variable.other.object.js', foreground: 'F39C12', fontStyle: 'bold' },
                { token: 'string.template.js', foreground: '21fd6b', fontStyle: 'bold' },
                { token: 'punctuation.definition.string.js', foreground: '21fd6b' },
                { token: 'punctuation.definition.comment.js', foreground: '4D595F' },
                { token: 'meta.object-literal.key.js', foreground: 'f15a4c' },
                { token: 'variable.other.readwrite.alias.js', foreground: 'FED604', fontStyle: 'bold' },
                { token: 'support.type.object.module.js', foreground: 'F39C12' }
            ],
            colors: {
                'editor.background': '#191919',
                'editor.foreground': '#e2e2e2ec',
                'editorCursor.foreground': '#ff7300',
                'editor.lineHighlightBackground': '#2e2e2e52',
                'editorLineNumber.foreground': '#94949460',
                'editorLineNumber.activeForeground': '#fffffff8',
                'editor.selectionBackground': '#a0a0a033',
                'editor.selectionHighlightBackground': '#47474754',
                'editor.wordHighlightBackground': '#535353',
                'editor.foldBackground': '#111111',
                'editorWhitespace.foreground': '#3b3a32',
                'editorIndentGuide.background': '#97a7c826',
                'scrollbarSlider.background': '#252526',
                'scrollbarSlider.hoverBackground': '#2b2b2b',
                'scrollbarSlider.activeBackground': '#ffffff50',
                'editorWidget.background': '#111111',
                'editorWidget.border': '#585858',
                'editorSuggestWidget.background': '#212224',
                'editorSuggestWidget.foreground': '#cecece',
                'editorSuggestWidget.highlightForeground': '#ff7300',
                'editorSuggestWidget.selectedBackground': '#1c423cc5',
                'editorSuggestWidget.border': '#585858',
                'editorHoverWidget.background': '#111111',
                'editorHoverWidget.foreground': '#cecece',
                'list.activeSelectionBackground': '#e6e6e609',
                'list.activeSelectionForeground': '#ffffff',
                'list.focusBackground': '#111111',
                'list.focusForeground': '#fff',
                'list.hoverBackground': '#242424',
                'list.highlightForeground': '#ff7300',
                'input.background': '#252525',
                'input.foreground': '#f0f0f0',
                'input.border': '#dfdfdf23',
                'input.placeholderForeground': '#c0c0c06e',
                'dropdown.background': '#202124',
                'dropdown.foreground': '#eeeeee',
                'dropdown.border': '#ff7300',
                'peekView.border': '#ff7300',
                'peekViewEditor.background': '#111111',
                'peekViewResult.background': '#111111',
                'peekViewTitle.background': '#161616',
                'peekViewTitleLabel.foreground': '#ff7300',
                'button.background': '#ff7300',
                'button.foreground': '#f0f0f0',
                'button.hoverBackground': '#ff8c33',
                'button.border': '#ff7300',
                'findMatchBorder': '#ff7300',
                'editorGroupHeader.tabsBackground': '#121315',
                'editorGroupHeader.tabsBorder': '#dfdfdf44',
                'tab.activeBackground': '#2a2a2ab4',
                'tab.hoverBackground': '#2a2a2ab4',
                'tab.inactiveBackground': '#181818c9',
                'tab.inactiveForeground': '#f0f0f0',
                'tab.unfocusedInactiveForeground': '#ff7300',
                'editorGutter.addedBackground': '#ff7300',
                'editorGutter.modifiedBackground': '#938464'
            }
        });

        // Definicja jasnego motywu z pełnym mapowaniem palety CORE
        monaco.editor.defineTheme('terminal-light', {
            base: 'vs',
            inherit: true,
            rules: [
                // Podstawowe tokeny
                { token: '', foreground: '1a1a1a', background: 'ffffff' },
                { token: 'comment', foreground: '8b8b8b', fontStyle: 'italic' },
                { token: 'comment.line', foreground: '8b8b8b', fontStyle: 'italic' },
                { token: 'comment.block', foreground: '8b8b8b', fontStyle: 'italic' },
                { token: 'comment.doc', foreground: '8b8b8b', fontStyle: 'italic' },

                // Słowa kluczowe
                { token: 'keyword', foreground: 'fd810d', fontStyle: 'bold' },
                { token: 'keyword.control', foreground: 'fd810d', fontStyle: 'bold' },
                { token: 'keyword.operator', foreground: 'fd810d' },
                { token: 'keyword.other', foreground: 'fd810d', fontStyle: 'bold' },

                // Stringi
                { token: 'string', foreground: '28a745' },
                { token: 'string.quoted', foreground: '28a745' },
                { token: 'string.template', foreground: '28a745' },
                { token: 'string.regexp', foreground: '28a745' },

                // Liczby
                { token: 'number', foreground: 'fd810d' },
                { token: 'number.hex', foreground: 'fd810d' },
                { token: 'number.binary', foreground: 'fd810d' },
                { token: 'number.octal', foreground: 'fd810d' },
                { token: 'number.float', foreground: 'fd810d' },

                // Typy i klasy
                { token: 'type', foreground: '1a1a1a' },
                { token: 'type.identifier', foreground: '1a1a1a' },
                { token: 'class', foreground: '1a1a1a', fontStyle: 'bold' },
                { token: 'class.name', foreground: '1a1a1a', fontStyle: 'bold' },

                // Identyfikatory
                { token: 'identifier', foreground: '1a1a1a' },
                { token: 'identifier.function', foreground: '1a1a1a' },
                { token: 'identifier.variable', foreground: '1a1a1a' },
                { token: 'identifier.constant', foreground: 'fd810d' },

                // Funkcje
                { token: 'function', foreground: '1a1a1a' },
                { token: 'function.name', foreground: '1a1a1a' },

                // Operatory i delimitery
                { token: 'delimiter', foreground: '1a1a1a' },
                { token: 'delimiter.bracket', foreground: '1a1a1a' },
                { token: 'delimiter.parenthesis', foreground: '1a1a1a' },
                { token: 'delimiter.square', foreground: '1a1a1a' },
                { token: 'operator', foreground: 'fd810d' },

                // Tagi (HTML/XML)
                { token: 'tag', foreground: 'fd810d' },
                { token: 'tag.name', foreground: 'fd810d' },
                { token: 'tag.attribute', foreground: '1a1a1a' },
                { token: 'tag.delimiter', foreground: '1a1a1a' },

                // Atrybuty
                { token: 'attribute.name', foreground: '1a1a1a' },
                { token: 'attribute.value', foreground: '28a745' },

                // CSS
                { token: 'property', foreground: '1a1a1a' },
                { token: 'property.name', foreground: '1a1a1a' },
                { token: 'property.value', foreground: '28a745' },
                { token: 'selector', foreground: 'fd810d' },
                { token: 'unit', foreground: 'fd810d' },

                // JSON
                { token: 'key', foreground: '1a1a1a' },
                { token: 'value', foreground: '28a745' },

                // Zmienne specjalne
                { token: 'variable', foreground: '1a1a1a' },
                { token: 'variable.predefined', foreground: 'fd810d' },
                { token: 'variable.parameter', foreground: '1a1a1a' },

                // Inne
                { token: 'constant', foreground: 'fd810d' },
                { token: 'constant.language', foreground: 'fd810d', fontStyle: 'bold' },
                { token: 'constant.numeric', foreground: 'fd810d' },
                { token: 'entity.name', foreground: '1a1a1a' },
                { token: 'support', foreground: '1a1a1a' },
                { token: 'support.function', foreground: '1a1a1a' },
                { token: 'support.class', foreground: '1a1a1a' },
                { token: 'meta', foreground: '1a1a1a' },
                { token: 'invalid', foreground: 'ff0000', fontStyle: 'bold' },
                { token: 'invalid.deprecated', foreground: 'ff0000', fontStyle: 'italic' }
            ],
            colors: {
                // Edytor główny
                'editor.background': '#ffffff',
                'editor.foreground': '#1a1a1a',
                'editorCursor.foreground': '#fd810d',
                'editor.lineHighlightBackground': '#f5f5f5',
                'editorLineNumber.foreground': '#8b8b8b61',
                'editorLineNumber.activeForeground': '#8b8b8b',

                // Zaznaczenie i dopasowania
                'editor.selectionBackground': '#c5c5c544',
                'editor.inactiveSelectionBackground': '#e8e8e8',
                'editor.selectionHighlightBackground': '#fd810d22',
                'editor.wordHighlightBackground': '#00000000',
                'editor.findMatchBackground': '#fd810d22',

                // Widgety (Find, Suggest, Hover)
                'editorWidget.background': '#f5f5f5',
                'editorWidget.border': '#e0e0e0',
                'editorSuggestWidget.background': '#f5f5f5',
                'editorSuggestWidget.border': '#e0e0e0',
                'editorSuggestWidget.selectedBackground': '#e8e8e8',
                'editorSuggestWidget.foreground': '#1a1a1a',
                'editorSuggestWidget.highlightForeground': '#fd810d',
                'editorHoverWidget.background': '#f5f5f5',
                'editorHoverWidget.border': '#e0e0e0',
                'editorHoverWidget.foreground': '#1a1a1a',

                // Menu kontekstowe
                'menu.background': '#f5f5f5',
                'menu.foreground': '#1a1a1a',
                'menu.selectionBackground': '#e8e8e8',
                'menu.selectionForeground': '#fd810d',
                'menu.separatorBackground': '#e0e0e0',
                'menu.border': '#e0e0e0',

                // Input
                'input.background': '#ffffff',
                'input.border': '#e0e0e0',
                'input.foreground': '#1a1a1a',
                'inputOption.activeForeground': '#fd810d',

                // Lista i selekcja
                'list.activeSelectionBackground': '#e8e8e8',
                'list.activeSelectionForeground': '#fd810d',
                'list.dropBackground': '#e8e8e8',
                'list.hoverBackground': '#e8e8e8',
                'list.hoverForeground': '#fd810d',
                'list.focusBackground': '#e8e8e8',
                'list.focusForeground': '#fd810d',
                'list.inactiveSelectionBackground': '#e8e8e8',
                'list.inactiveSelectionForeground': '#1a1a1a',
                'quickInputList.focusBackground': '#e8e8e8',
                'quickInputList.focusForeground': '#fd810d',

                // Inne
                'editorBracketMatch.background': '#fd810d44',
                'editorBracketMatch.border': '#fd810d',
                'button.background': '#e8e8e8',
                'button.foreground': '#1a1a1a',
                'button.hoverBackground': '#fd810d',
                'badge.background': '#e8e8e8',
                'badge.foreground': '#1a1a1a',
                'focusBorder': '#fd810d',
                'editorGutter.background': '#ffffff',
                'editorGutter.foldingControlForeground': '#8b8b8b',
                'scrollbar.shadow': '#00000011',
                'scrollbarSlider.background': '#e0e0e0',
                'scrollbarSlider.hoverBackground': '#fd810d',
                'scrollbarSlider.activeBackground': '#fd810d'
            }
        });

        console.log('Monaco themes defined successfully');
        return true;
    } catch (e) {
        console.error('Error defining Monaco themes:', e);
        return false;
    }
}

// Eksportuj funkcję dla użycia w innych miejscach
window.defineMonacoThemes = defineMonacoThemes;

// Próbuj zdefiniować motywy od razu (jeśli Monaco jest już załadowane)
if (typeof monaco !== 'undefined' && monaco.editor) {
    defineMonacoThemes();
} else {
    // Jeśli Monaco nie jest jeszcze załadowane, czekaj na nie
    const checkMonaco = setInterval(() => {
        if (typeof monaco !== 'undefined' && monaco.editor) {
            clearInterval(checkMonaco);
            defineMonacoThemes();
        }
    }, 50);

    // Timeout po 5 sekundach
    setTimeout(() => {
        clearInterval(checkMonaco);
    }, 5000);
}
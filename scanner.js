const {source, simple} = require('./index');

//const tokens = ['<!--', '@!', '/@!', '-->', '@{', '}', 'case', 'else', 'each', 'dump', 'bind', 'slot'];
const Tokens = {
    //single character tokens
    LEFT_PAREN: 'LEFT_PAREN', RIGHT_PAREN: 'RIGHT_PAREN', LEFT_BRACE: 'LEFT_BRACE',
    RIGHT_BRACE: 'RIGHT_BRACE', COMMA: 'COMMA', DOT: 'DOT', MINUS: 'MINUS',
    PLUS: 'PLUS', SEMICOLON: 'SEMICOLON', SLASH: 'SLASH', STAR: 'STAR',
    //One or two character tokens
    BANG: 'BANG', BANG_EQUAL: 'BANG_EQUAL', EQUAL: 'EQUAL', EQUAL_EQUAL: 'EQUAL_EQUAL',
    GREATER: 'GREATER', GREATER_EQUAL: 'GREATER_EQUAL', LESS: 'LESS',
    LESS_EQUAL: 'LESS_EQUAL', INCREMENT: 'INCREMENT', DECREMENT: 'DECREMENT',
    //literals
    IDENTIFIER: 'IDENTIFIER', STRING: 'STRING', NUMBER: 'NUMBER', ATTRIBUTE: 'ATTRIBUTE',
    //closeComments
    OPEN_COMMENT: 'OPEN_COMMENT', CLOSE_COMMENT: 'CLOSE_COMMENT',
    OPEN_DEFINITION: 'OPEN_DEFINITION', CLOSE_DEFINITION: 'CLOSE_DEFINITION',
    OPEN_EXPRESSION: 'OPEN_EXPRESSION', CLOSE_EXPRESSION: 'CLOSE_EXPRESSION',
    //Key words
    CASE: 'CASE', ELSE: 'ELSE', EACH: 'EACH', BIND: 'BIND', DUMP: 'DUMP', SLOT: 'SLOT',
    TRUE: 'TRUE', FALSE: 'FALSE', IN: 'IN', AND: 'AND', OR: 'OR', NONE: 'NONE',
    //other
    EOF: 'EOF'
}

const keywords = {
    'case': 'CASE',
    'else': 'ELSE',
    'each': 'EACH',
    'bind': 'BIND',
    'dump': 'DUMP',
    'slot': 'SLOT',
    'true': 'TRUE',
    'false': 'FALSE',
    'in': 'IN',
    'and': 'AND',
    'or': 'OR',
    'none': 'NONE'
}

function Token(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;

    this.toString = () => {
        return `${type} ${lexeme} ${literal}`;
    }
}

function Scanner(source) {
    let tokens = [];
    let line = 0;
    let start = 0;
    let current = 0;

    const addToken = (type, literal) => {
        let text = source.substring(start, current);
        tokens.push(new Token(type, text, literal, line));
    }

    const isAtEnd = () => {
        return current >= source.length;
    }

    const peek = () => {
        if (isAtEnd()) return '\0';
        return source.charAt(current);
    }

    const peekNext = (step) => {
        if (!step || step === 1) {
            if (current + 1 >= source.length) return '\0';
            return source.charAt(current + 1);
        }
        else {
            if (current + 1 >= source.length) return '\0';
            return source.substring(start, start + step)
        }
    }

    const advance = () => {
        current++;
        return source.charAt(current - 1);
    }

    const match = (expected) => {
        if (isAtEnd()) return false;
        if (source.charAt(current) !== expected) return false;

        current++;
        return true;
    }

    const isAlpha = (ch) => {
        return (ch >= 'a' && ch <= 'z') ||
            (ch >= 'A' && ch <= 'Z') ||
            ch == '_';
    }

    const isAlphaNumeric = (ch) => {
        return isAlpha(ch) || isDigit(ch);
    }

    const isDigit = (ch) => {
        return ch >= '0' && ch <= '9';
    }

    const number = () => {
        while (isDigit(peek())) advance();

        // Look for a fractional part.                            
        if (peek() == '.' && isDigit(peekNext())) {
            // Consume the "."                                      
            advance();

            while (isDigit(peek())) advance();
        }

        addToken(Tokens.NUMBER, parseInt(source.substring(start, current)));
    }

    const string = () => {
        while (peek() != '"' && !isAtEnd()) {
            if (peek() == '\n') line++;
            advance();
        }

        // Unterminated string.                                 
        if (isAtEnd()) {
            error(line, "Unterminated string.");
            return;
        }

        // The closing ".                                       
        advance();

        // Trim the surrounding quotes.                         
        let value = source.substring(start + 1, current - 1);
        addToken(Tokens.STRING, value);
    }

    const identifier = () => {
        while (isAlphaNumeric(peek())) advance();

        // See if the identifier is a reserved word.   
        let text = source.substring(start, current);

        let type = keywords[text];
        if (type == null) type = Tokens.IDENTIFIER;
        addToken(type);
    }

    const openToken = () => {
        if (peek() === '!') {
            let value = source.substring(start, current + 1);
            addToken(Tokens.OPEN_DEFINITION, value)
            advance();
        }
        else if (peek() === '{') {
            let value = source.substring(start, current + 1);
            addToken(Tokens.OPEN_EXPRESSION, value)
            advance();
        }
    }

    const openComment = () => {
        if (peekNext(4) == '<!--') {
            let value = source.substring(start, current + 3);
            current += 3
            addToken(Tokens.OPEN_COMMENT, value);
        }
        else {
            addToken(match('=') ? Tokens.LESS_EQUAL : Tokens.LESS)
        }
    }

    const closeComment = () => {
        if (peekNext(3) == '-->') {
            let value = source.substring(start, current + 2);
            current += 2
            addToken(Tokens.CLOSE_COMMENT, value);
        }
        else {
            addToken(match('-') ? Tokens.DECREMENT : Tokens.MINUS)
        }
    }

    const scanToken = () => {
        let ch = advance();
        switch (ch) {
            case '(': addToken(Tokens.LEFT_PAREN); break;
            case ')': addToken(Tokens.RIGHT_PAREN); break;
            case '{': addToken(Tokens.LEFT_BRACE); break;
            case '}': addToken(Tokens.RIGHT_BRACE); break;
            case ',': addToken(Tokens.COMMA); break;
            case '.': addToken(Tokens.DOT); break;
            case ';': addToken(Tokens.SEMICOLON); break;
            case '*': addToken(Tokens.STAR); break;

            case '!': addToken(match('=') ? Tokens.BANG_EQUAL : Tokens.BANG); break;
            case '=': addToken(match('=') ? Tokens.EQUAL_EQUAL : Tokens.EQUAL); break;
            case '<': openComment(); break;
            case '>': addToken(match('=') ? Tokens.GREATER_EQUAL : Tokens.GREATER); break;
            case '+': addToken(match('+') ? Tokens.INCREMENT : Tokens.PLUS); break;
            case '@': openToken(); break;
            case '-': closeComment(); break;

            case '/':
                if (match('/')) {
                    // A comment goes until the end of the line.                
                    while (peek() != '\n' && !isAtEnd()) advance();
                } else {
                    addToken(Tokens.SLASH);
                }
                break;

            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.                      
                break;

            case '\n':
                line++;
                break;

            //handle identifiers
            case '"': string(); break;

            default:
                if (isDigit(ch)) {
                    number();
                } else if (isAlpha(ch)) {
                    identifier();
                } else {
                    error(line, "Unexpected character.");
                }
                break;
        }
    }

    this.scanTokens = () => {
        while (!isAtEnd()) {
            start = current;
            scanToken();
        }

        tokens.push(new Token(Tokens.EOF, "", null, line))
        return tokens;
    }

    const error = (line, message) => {
        report(line, ":", message)
    }

    const report = (line, where, message) => {
        console.log(`[line ${line}] Error ${where} : " ${message}`)
    }
}

const runScanner = (source) => {
    let scanner = new Scanner(source);
    let tokens = scanner.scanTokens();
    console.log(tokens);
}

runScanner(simple)
//runScanner(source)

module.exports = {
    Tokens, Scanner
}
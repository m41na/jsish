const { Tokens, Scanner } = require('./scanner');
const { MINUS, PLUS, BANG, BANG_EQUAL, EQUAL_EQUAL, GREATER, GREATER_EQUAL, LESS, LESS_EQUAL,
    SLASH, STAR, LEFT_PAREN, NUMBER, STRING, TRUE, FALSE, NIL, SEMICOLON, EOF } = Tokens;

/**
 *
expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;
addition       → multiplication ( ( "-" | "+" ) multiplication )* ;
multiplication → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "false" | "true" | "nil"
               | "(" expression ")" ;
 */

const Expr = {
    Binary: (left, op, right) => {
        this.left = left; //expression
        this.operator = op; //token
        this.right = right; //expression
    },

    Grouping: (expression) => {
        this.expression = expression;
    },

    Literal: (value) => {
        this.value = value;
    },

    Unary: (op, right) => {
        this.operator = op; //token
        this.right = right; //expression
    }
}

function AstPrinter() {

}

function Parser(input) {

    let tokens = input || [];
    let current = 0;

    this.parse = () => {
        try {
            return expression();
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    const expression = () => {
        return equality();
    }

    const equality = () => {
        let expr = comparison();

        while (match(BANG_EQUAL, EQUAL_EQUAL)) {
            let operator = previous();
            let right = comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    const comparison = () => {
        let expr = addition();

        while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
            let operator = previous();
            let right = addition();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    const unary = () => {
        if (match(BANG, MINUS)) {
            let operator = previous();
            let right = unary();
            return new Expr.Unary(operator, right);
        }

        return primary();
    }

    const addition = () => {
        let expr = multiplication();

        while (match(MINUS, PLUS)) {
            let operator = previous();
            let right = multiplication();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    const multiplication = () => {
        let expr = unary();

        while (match(SLASH, STAR)) {
            let operator = previous();
            let right = unary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    const primary = () => {
        if (match(FALSE)) return new Expr.Literal(false);
        if (match(TRUE)) return new Expr.Literal(true);
        if (match(NIL)) return new Expr.Literal(null);

        if (match(NUMBER, STRING)) {
            return new Expr.Literal(previous().literal);
        }

        if (match(LEFT_PAREN)) {
            let expr = expression();
            consume(RIGHT_PAREN, "Expect ')' after expression.");
            return new Expr.Grouping(expr);
        }
    }

    const match = () => {
        for (let i = 0; i < arguments.length; i++) {
            if (check(arguments[i])) {
                advance();
                return true;
            }
        }

        return false;
    }

    const check = (type) => {
        if (isAtEnd()) return false;
        return peek().type === type;
    }

    const advance = () => {
        if (!isAtEnd()) current++;
        return previous();
    }

    const isAtEnd = () => {
        return peek().type === EOF;
    }

    const peek = () => {
        return tokens[current];
    }

    const previous = () => {
        return tokens[current - 1];
    }

    const consume = (type, message) => {
        if (check(type)) return advance();

        throw error(peek(), message);
    }

    const error = (token, message) => {
        //Lox.error(token, message);                           
        return new Error(`Parse error: ${token} - ${message}`);
    }

    const synchronize = () => {
        advance();

        while (!isAtEnd()) {
            if (previous().type == SEMICOLON) return;

            switch (peek().type) {
                case CLASS:
                case FUN:
                case VAR:
                case FOR:
                case IF:
                case WHILE:
                case PRINT:
                case RETURN:
                    return;
            }

            advance();
        }
    }
}

const runParser = (source) => {
    let scanner = new Scanner(source);
    let tokens = scanner.scanTokens();

    let parser = new Parser(tokens);
    let expression = parser.parse();

    // Stop if there was a syntax error.                   
    //if (hadError) return;

    console.log(expression)
    //console.log(new AstPrinter().print(expression));
}

runParser("(5 - 3) - 1");

module.exports = {
    Parser
}
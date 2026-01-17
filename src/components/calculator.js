import React, { useState } from "react";
import "./calculator.css";

const Calculator = () => {
    const [input, setInput] = useState("");

    const clear = () => setInput("");

    const backspace = () => {
        if (input === "Error") {
            setInput("");
            return;
        }
        setInput(input.slice(0, -1));
    };

    const handleClick = (value) => {
        if (input === "Error") {
            setInput(value === "." ? "0." : value);
            return;
        }

        if ("+-*/".includes(value) && "+-*/".includes(input.slice(-1))) {
            return;
        }

        // Decimal handling
        if (value === ".") {
            const parts = input.split(/[+\-*/]/);
            const lastNumber = parts[parts.length - 1];

            // Prevent multiple decimals in one number
            if (lastNumber.includes(".")) return;

            // Start decimal properly
            if (lastNumber === "" || "+-*/".includes(input.slice(-1))) {
                setInput(input + "0.");
                return;
            }
        }

        setInput(input + value);
    };

    const safeEvaluate = (expr) => {
        const tokens = expr.match(/\d*\.?\d+|[+\-*/]/g);

        if (!tokens) return NaN;

        const values = [];
        const ops = [];
        const prec = { "+": 1, "-": 1, "*": 2, "/": 2 };

        const applyOp = () => {
            const b = values.pop();
            const a = values.pop();
            const op = ops.pop();
            if (op === "+") values.push(a + b);
            if (op === "-") values.push(a - b);
            if (op === "*") values.push(a * b);
            if (op === "/") values.push(b === 0 ? NaN : a / b);
        };

        tokens.forEach((t) => {
            if (!isNaN(t)) {
                values.push(Number(t));
            } else {
                while (ops.length && prec[ops[ops.length - 1]] >= prec[t]) {
                applyOp();
                }
                ops.push(t);
            }
        });

        while (ops.length) applyOp();
        return values[0];
    };

    const calculate = () => {
        if (!input || "+-*/".includes(input.slice(-1))) {
            setInput("Error");
            return;
        }
        const result = safeEvaluate(input);
        setInput(isNaN(result) ? "Error" : String(result));
    };

    return (
        <div className="calculator-wrapper">
            <div className="calculator">
            <div className={`display ${input === "Error" ? "error" : ""}`}> {input || "0"} </div>


            <div className="buttons">
                <button className="btn-clear" onClick={clear}>C</button>
                <button className="btn-backspace" onClick={backspace}>⌫</button>
                <button className="btn-operator" onClick={() => handleClick("/")}>÷</button>

                {[7,8,9].map(n => (
                <button key={n} className="btn-number" onClick={() => handleClick(String(n))}>{n}</button>
                ))}
                <button className="btn-operator" onClick={() => handleClick("*")}>×</button>

                {[4,5,6].map(n => (
                <button key={n} className="btn-number" onClick={() => handleClick(String(n))}>{n}</button>
                ))}
                <button className="btn-operator" onClick={() => handleClick("-")}>−</button>

                {[1,2,3].map(n => (
                <button key={n} className="btn-number" onClick={() => handleClick(String(n))}>{n}</button>
                ))}
                <button className="btn-operator" onClick={() => handleClick("+")}>+</button>

                <button className="btn-number" onClick={() => handleClick("0")}>0</button>
                <button className="btn-number" onClick={() => handleClick(".")}>.</button>
                <button className="btn-equals" onClick={calculate}>=</button>
            </div>
            </div>
        </div>
    );
};
export default Calculator;

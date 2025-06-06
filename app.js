/*
 * Copyright (c) 2025 barbute
 * 
 * This file is part of calculator and is licensed under the MIT License.
 * See the LICENSE file in the root of the project for more information.
 */

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return x / y;
}

const Operation = {
  ADD: "add",
  SUBTRACT: "subtract",
  MULTIPLY: "multiply",
  DIVIDE: "divide",
  NOOP: "noop"
}

let argumentOne = null;
let argumentTwo = null;
let operation = Operation.NOOP;

function operate(argOne, argTwo, op) {
  let result = 0.0;
  if (argOne != null && argTwo != null) {
    switch (op) {
      case Operation.ADD:
        result = add(argOne, argTwo);
        break;
      case Operation.SUBTRACT:
        result = subtract(argOne, argTwo);
        break;
      case Operation.MULTIPLY:
        result = multiply(argOne, argTwo);
        break;
      case Operation.DIVIDE:
        if (argTwo === 0) {
          result = 0.0;
          console.log("INVALID OPERATION");
        } else {
          result = divide(argOne, argTwo);
        }
        break;
      default:
        result = 0.0;
        console.log("INVALID OPERATION");
        break;
    }
  } else {
    result = 0.0;
    console.log("INVALID ARGUMENTS");
  }
  return roundToDecimal(result, 3);
}

function roundToDecimal(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

const historyArgOne = document.querySelector(".history #arg-one");
const historyOperator = document.querySelector(".history #operator");
const historyArgTwo = document.querySelector(".history #arg-two");

const editor = document.querySelector(".editor");

let buffer = [editor.textContent];

const container = document.querySelector(".container");
// Query all buttons that can be used as arguments
const argsButtons = document.querySelectorAll(".args");
// Query all buttons that can be used as an operator
const opsButtons = document.querySelectorAll(".ops");
// Query the equals button (button that solves an entry)
const equButton = document.querySelector(".equ");
// Query actions buttons that modify the number
const clearAllButton = document.querySelector("#all-clear");
const clearButton = document.querySelector("#clear");
const signFlipButton = document.querySelector("#sign-flip");

argsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addNumber(button.textContent);
    clearHistory();
    printBuffer();
  });
});

opsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Check if there is already an operator in the buffer
    if (getOperatorIndex(buffer) !== -1) {
      const lastDigit = parseFloat(buffer[buffer.length - 1]); 
      // Check if there is a valid number after the operator
      if (Number.isNaN(lastDigit)) {
        // If we have an operator already, but there is no number after, it then
        // replace the current operator
        buffer[getOperatorIndex(buffer)] = button.textContent;
        editor.textContent = buffer.join("");
        printBuffer();
        // Exit out since we've already set the operator
        return;
      } else {
        // If so, evaluate before setting the operator
        evaluate();
      }
    }
    setOperator(button.textContent);
    printBuffer();
  });
});

clearAllButton.addEventListener("click", () => {
  resetState();
  printBuffer();
})

clearButton.addEventListener("click", () => {
  clear();
  clearHistory();
  printBuffer();
});

signFlipButton.addEventListener("click", () => {
  signFlip();
  clearHistory();
  printBuffer();
});

equButton.addEventListener("click", () => {
  evaluate();
  printBuffer();
});

function resetState() {
  argumentOne = null;
  argumentTwo = null;
  operation = Operation.NOOP;

  historyArgOne.textContent = "";
  historyOperator.textContent = "";
  historyArgTwo.textContent = "";

  editor.textContent = "0";
  
  buffer = [editor.textContent];
}

function clearHistory() {
  historyArgOne.textContent = "";
  historyOperator.textContent = "";
  historyArgTwo.textContent = "";
}

function getOperatorIndex(arr) {
  let operatorIndex = arr.findIndex(function(value, index, array) {
    return value === "÷" || 
           value === "×" ||
           // The subtraction symbol has to be different from a minus since
           // we need to use the hyphen to indicate a negative number
           value === "–" ||
           value === "+"
  });
  return operatorIndex;
}

function addNumber(number) {  
  // Check if entry is valid
  if (number === ".") {
    let operatorIndex = getOperatorIndex(buffer);
    let startIndex = (operatorIndex !== -1) ? operatorIndex : 0;
    for (let i = startIndex; i < buffer.length; i++) {
      // If there's already decimal skip the addition
      if (buffer[i] === number) {
        console.log("INVALID ATTEMPT TO ADD NUMBER");
        return;
      }
    }
  }
  // If we are in the initial state, replace the default 0 with the first number
  if (buffer.length === 1 && buffer[0] === "0") {
    buffer = [number];
  } else {
    // Push to buffer if checks are valid
    buffer.push(number);
  }
  // Update display
  editor.textContent = buffer.join("");
}

function setOperator(operator) {
  buffer.push(operator);
  editor.textContent = buffer.join("");
}

function signFlip() {
  let number = 0.0;
  // Check if operator is present, if so then we are flipping the sign of the
  // second operand
  let opIndex = getOperatorIndex(buffer);
  if (opIndex === -1) {
    number = parseFloat(buffer.join(""));
    number *= -1.0;
    buffer = number.toString().split("");
  } else {
    // If there's nothing after operator, do nothing
    if (opIndex + 1 === buffer.length) {
      return;
    }
    // Extract and save first operand and operator, then negate
    let operandOne = buffer.splice(0, opIndex);
    let operator = buffer.splice(0, 1);
    number = parseFloat(buffer.join(""));
    number *= -1.0;
    // Reconstruct buffer with new number
    buffer = operandOne.concat(operator.concat(number.toString().split("")));
  }
  editor.textContent = buffer.join("");
}

function clear() {
  buffer.pop();
  // If we delete a digit and there's only a negative symbol left, delete that
  // too so it doesn't confuse the user or lead to an invalid operation
  if (buffer[buffer.length - 1] === "-") {
    buffer.pop();
  }
  // If clearing makes buffer empty, reset buffer to it's initial state
  if (buffer.length === 0) {
    buffer = ["0"];
  }
  editor.textContent = buffer.join("");
}

function evaluate() {
  if (!isCompleteExpression()) {
    console.log("EXPRESSION INVALID")
    return;
  }
  // Parse buffer
  const opIndex = getOperatorIndex(buffer);
  argumentOne = parseFloat(buffer.splice(0, opIndex).join(""));
  let operator = buffer.splice(0, 1).toString();
  operation = getOperationFromText(operator);
  argumentTwo = parseFloat(buffer.splice(0, buffer.length).join(""));

  // Run the operation
  let result = operate(argumentOne, argumentTwo, operation);

  // Update history
  historyArgOne.textContent = argumentOne;
  historyOperator.textContent = operator;
  historyArgTwo.textContent = argumentTwo;
  
  // Store result in buffer
  buffer = ["0"]; // Start but resetting the buffer to initial state
  buffer = result.toString().split("");
  editor.textContent = buffer.join("");
}

function isCompleteExpression() {
  const opIndex = getOperatorIndex(buffer);
  // False if operator doesn't exist
  if (opIndex === -1) {
    return false;
  }
  // False if there's nothing after operator 
  else if (opIndex + 1 === buffer.length) {
    return false;
  }
  // False if it's just the negative symbol after operator 
  else if (buffer[opIndex + 1] === "-" && (opIndex + 2) === buffer.length) {
    return false;
  }
  // True if passes above conditions
  else {
    return true;
  }
}

function getOperationFromText(operator) {
  switch (operator) {
    case "÷":
      return Operation.DIVIDE;
    case "×":
      return Operation.MULTIPLY;
    case "–":
      return Operation.SUBTRACT;
    case "+":
      return Operation.ADD;
    default:
      console.log("INVALID OPERATOR PARSED")
      return Operation.NOOP;
  }
}

function printBuffer() {
  console.log(buffer);
}
/*
 * Copyright (c) 2025 barbute
 * 
 * This file is part of etch_a_sketch and is licensed under the MIT License.
 * See the LICENSE file in the root of the project for more information.
 * 
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
    printBuffer();
  });
});

opsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setOperator(button.textContent);
    printBuffer();
  });
});

function resetState() {
  argumentOne = null;
  argumentTwo = null;
  operation = Operation.NOOP;

  historyArgOne.textContent = "";
  historyOperator.textContent = "";
  historyArgTwo.textContent = "";

  editor.textContent = "";
  
  buffer = [editor.textContent];
}

function getOperatorIndex(arr) {
  let operatorIndex = arr.findIndex(function(value, index, array) {
    return value === "÷" || 
           value === "×" ||
           value === "-" ||
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
  let opIndex = getOperatorIndex(buffer);
  // If the operator doesn't exist add it to buffer
  if (opIndex === -1) {  
    buffer.push(operator);
  // If it does, replace the current
  } else {
    buffer[opIndex] = operator;
  }
  editor.textContent = buffer.join("");
}

function printBuffer() {
  console.log(buffer);
}
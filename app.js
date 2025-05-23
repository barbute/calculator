/*
 * Copyright (c) 2025 barbute
 * 
 * This file is part of etch_a_sketch and is licensed under the MIT License.
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
        result = divide(argOne, argTwo);
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
  return result.toPrecision(3);
}

const editorArgOne = document.querySelector(".editor #arg-one");
const editorOperator = document.querySelector(".editor #operator");
const editorArgTwo = document.querySelector(".editor #arg-two");
const editorResult = document.querySelector(".editor #result");

let arguementBuffer = [];
let currentArgs = editorArgOne;

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
    let number = button.textContent;
    // Don't let user enter multiple decimals
    if (number === "." && arguementBuffer[arguementBuffer.length - 1] === ".") {
      console.log("INVALID ENTRY - NO EXTRA DECIMALS");
    } else {
      arguementBuffer.push(number);
      // Decimal doesn't appear on display until another number is entered, so just
      // display it until the next number is entered 
      if (number === ".") {
        currentArgs.textContent = Number.parseFloat(arguementBuffer.join("")) + ".";  
      } else {
        currentArgs.textContent = Number.parseFloat(arguementBuffer.join(""));
      }
    }
  });
});

opsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.id) {
      case "add":
        operation = Operation.ADD;
        break;
      case "subtract":
        operation = Operation.SUBTRACT;
        break;
      case "multiply":
        operation = Operation.MULTIPLY;
        break;
      case "divide":
        operation = Operation.DIVIDE;
        break;
      default:
        operation = Operation.NOOP;
        break;
    }
    // Check if current entry is valid before moving on
    if (currentArgs === editorArgOne && arguementBuffer.length > 0) {
      // Dispay operator symbol
      if (operation !== Operation.NOOP) {
        editorOperator.textContent = button.textContent;
      }
      // Set argument one to the current buffer content
      argumentOne = Number.parseFloat(arguementBuffer.join(""));
      // Clear buffer for next args
      arguementBuffer = [];
      // Set currently editing args to second slot
      currentArgs = editorArgTwo;
    }
  });
});

// Completely clears the state of the calculator to initial
clearAllButton.addEventListener("click", () => {
  argumentOne = null;
  argumentTwo = null;
  operation = Operation.NOOP;
  
  arguementBuffer = [];
  currentArgs = editorArgOne;

  editorArgOne.textContent = "";
  editorOperator.textContent = "";
  editorArgTwo.textContent = "";
  editorResult.textContent = "";
});

clearButton.addEventListener("click", () => {
  if (arguementBuffer.length > 0) {
    console.log(arguementBuffer.pop());
    console.log(arguementBuffer);
    if (arguementBuffer[arguementBuffer.length - 1] === ".") {
      currentArgs.textContent = Number.parseFloat(arguementBuffer.join("")) + ".";  
    } else {
      currentArgs.textContent = Number.parseFloat(arguementBuffer.join(""));
    }
  } else {
    if (editorOperator.textContent !== "") {
      operation = Operation.NOOP;
      editorOperator.textContent = "";
    }
  }
});
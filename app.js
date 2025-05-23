/*
 * Copyright (c) 2025 barbute
 * 
 * This file is part of etch_a_sketch and is licensed under the MIT License.
 * See the LICENSE file in the root of the project for more information.
 * 
 * NOTE Apologies for this monstronsity of a js file. This could be the most
 * cooked code I've written since I learned what a for-loop was
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
  return roundToDecimal(result, 3);
}

function roundToDecimal(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

const historyArgOne = document.querySelector(".history #arg-one");
const historyOperator = document.querySelector(".history #operator");
const historyArgTwo = document.querySelector(".history #arg-two");
const historyEquals = document.querySelector(".history #equals");

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
      // if (currentArgs !== editorArgTwo && operation === Operation.NOOP) {

      // }
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
    } else if (currentArgs === editorArgTwo && editorOperator.textContent === "") {
      // Dispay operator symbol
      if (operation !== Operation.NOOP) {
        editorOperator.textContent = button.textContent;
      }
    }
    // Just clear the history part of the display if an operater is selected
    historyArgOne.textContent = "";
    historyOperator.textContent = "";
    historyArgTwo.textContent = "";
    historyEquals.textContent = "";
  });
});

equButton.addEventListener("click", () => {
  if (currentArgs == editorArgTwo) {
    if (arguementBuffer.length > 0) {
      argumentTwo = Number.parseFloat(arguementBuffer.join(""));
    }
  }
  if (argumentOne !== null && argumentTwo !== null) {
    if (argumentTwo === 0 && operation === Operation.DIVIDE) {
      resetState();
      alert("if you divide by 0 again, jeffery will be upset");
      return;
    }
    let result = operate(argumentOne, argumentTwo, operation);
    argumentOne = result;
    currentArgs = editorArgTwo;

    historyArgOne.textContent = editorArgOne.textContent;
    historyOperator.textContent = editorOperator.textContent;
    historyArgTwo.textContent = editorArgTwo.textContent;
    historyEquals.textContent = "=";
    
    argumentTwo = null;
    operation = Operation.NOOP;

    arguementBuffer = [];

    editorArgOne.textContent = argumentOne;
    editorOperator.textContent = "";
    editorArgTwo.textContent = "";
    editorResult.textContent = "";
  }
})

function resetState() {
  argumentOne = null;
  argumentTwo = null;
  operation = Operation.NOOP;
  
  arguementBuffer = [];
  currentArgs = editorArgOne;
  
  editorArgOne.textContent = "";
  editorOperator.textContent = "";
  editorArgTwo.textContent = "";
  editorResult.textContent = "";

  historyArgOne.textContent = "";
  historyOperator.textContent = "";
  historyArgTwo.textContent = "";
  historyEquals.textContent = "";
}

// Completely clears the state of the calculator to initial
clearAllButton.addEventListener("click", () => {
  resetState();
});

// Cleanest rockstar code implementation:
clearButton.addEventListener("click", () => {
  // If there's a negative sign just clear the buffer
  if (arguementBuffer[arguementBuffer.length - 1] === "-") {
    arguementBuffer = [];
    currentArgs.textContent = "";
    return;
  } else if (arguementBuffer[arguementBuffer.length - 2] === "-") {
    arguementBuffer.pop();
    currentArgs.textContent = "-";
    return;
  }
  if (arguementBuffer.length > 0) {
    arguementBuffer.pop();
    if (arguementBuffer[arguementBuffer.length - 1] === ".") {
      currentArgs.textContent = Number.parseFloat(arguementBuffer.join("")) + ".";  
    } else if (arguementBuffer.length === 0) {
      currentArgs.textContent = "";
    } else {
      currentArgs.textContent = Number.parseFloat(arguementBuffer.join(""));
    }
  } else {
    if (editorOperator.textContent !== "") {
      operation = Operation.NOOP;
      editorOperator.textContent = "";
      // Since operator is cleared we move back to argument one
      currentArgs = editorArgOne;
      arguementBuffer = editorArgOne.textContent.split("");
    }
  }
});

signFlipButton.addEventListener("click", () => {
  if (arguementBuffer.length > 0) {
    arguementBuffer.unshift("-");
    if (arguementBuffer[arguementBuffer.length - 1] === ".") {
      currentArgs.textContent = (Number.parseFloat(arguementBuffer.join(""))) + ".";  
    } else {
      currentArgs.textContent = (Number.parseFloat(arguementBuffer.join("")))
    }
  }
});
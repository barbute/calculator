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

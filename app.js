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

let argumentOne = 0;
let argumentTwo = 0;
let operation = Operation.NOOP;

function operate(argOne, argTwo, op) {
  let result = 0.0;
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
  return result.toPrecision(3);
}
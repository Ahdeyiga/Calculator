 // script.js
 let display = document.getElementById("display");
      let currentInput = "0";
      let shouldResetDisplay = false;

      function updateDisplay() {
        display.textContent = currentInput;
      }

      function inputNumber(num) {
        if (shouldResetDisplay) {
          currentInput = "";
          shouldResetDisplay = false;
        }

        if (currentInput === "0" && num !== ".") {
          currentInput = num;
        } else if (num === "." && currentInput.includes(".")) {
          return; // Don't add multiple decimal points
        } else {
          currentInput += num;
        }

        updateDisplay();
      }

      function inputOperator(operator) {
        if (shouldResetDisplay) {
          shouldResetDisplay = false;
        }

        if (operator === "^") {
          currentInput += "**"; // JavaScript uses ** for exponentiation
        } else if (operator === "%") {
          try {
            let result = eval(currentInput) / 100;
            currentInput = result.toString();
            shouldResetDisplay = true;
          } catch (error) {
            currentInput = "Error";
            shouldResetDisplay = true;
          }
        } else {
          const lastChar = currentInput[currentInput.length - 1];
          if (["+", "-", "*", "/", "**"].includes(lastChar)) {
            currentInput = currentInput.slice(0, -1);
          }
          currentInput += operator;
        }

        updateDisplay();
      }

      function calculateResult() {
        try {
          // Replace ** back to ^ for display purposes, but eval understands **
          let result = eval(currentInput);

          // Handle division by zero and other edge cases
          if (!isFinite(result)) {
            currentInput = "Error";
          } else {
            // Round to avoid floating point precision issues
            result = Math.round(result * 100000000) / 100000000;
            currentInput = result.toString();
          }

          shouldResetDisplay = true;
        } catch (error) {
          currentInput = "Error";
          shouldResetDisplay = true;
        }

        updateDisplay();
      }

      function clearDisplay() {
        currentInput = "0";
        shouldResetDisplay = false;
        updateDisplay();
      }

      function backspace() {
        if (currentInput.length > 1) {
          currentInput = currentInput.slice(0, -1);
        } else {
          currentInput = "0";
        }
        updateDisplay();
      }

      // Keyboard support
      document.addEventListener("keydown", function (event) {
        const key = event.key;

        // Numbers and decimal point
        if (key >= "0" && key <= "9") {
          inputNumber(key);
        } else if (key === ".") {
          inputNumber(".");
        }
        // Operators
        else if (key === "+") {
          inputOperator("+");
        } else if (key === "-") {
          inputOperator("-");
        } else if (key === "*") {
          inputOperator("*");
        } else if (key === "/") {
          event.preventDefault(); // Prevent browser search
          inputOperator("/");
        } else if (key === "%") {
          inputOperator("%");
        } else if (key === "^") {
          inputOperator("^");
        }
        // Special keys
        else if (key === "Enter" || key === "=") {
          calculateResult();
        } else if (key === "Escape" || key.toLowerCase() === "c") {
          clearDisplay();
        } else if (key === "Backspace") {
          backspace();
        }
      });

      // Initialize display
      updateDisplay();

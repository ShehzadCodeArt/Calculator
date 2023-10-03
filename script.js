// Define a variable to store the history
const history = [];

// Maximum number of history entries to keep
const maxHistoryEntries = 2;

// Function to update the history
function updateHistory(operation, result) {
  history.push({ operation, result });
  // Limit the history to a certain number of entries (e.g., 10)
    // if (history.length > 2) {
    //     console.log(history);
    //     history.shift(); // Remove the oldest entry
    //     console.log(history);
    // }
    if (history.length > maxHistoryEntries) {
        history.splice(0, history.length - maxHistoryEntries); // Remove older entries
    }
    
    console.log(history);
    // Update the history list in the HTML
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear the history list

    // Re-populate the history list with the updated entries
  for (const entry of history) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${entry.operation} = ${entry.result}`;
    historyList.appendChild(listItem);
    }
    
    // const listItem = document.createElement('li');
    // listItem.innerHTML = `${operation} = ${result}`;
    // historyList.appendChild(listItem);
    // console.log(history);
}


class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    // Clear all the values and reset the calculator
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.clearError();
    }

    // Clear only the error message
    errorClear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    // Delete the last character from the current operand
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    // Append a number or a decimal point to the current operand
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    // Choose the operation to be performed
    chooseOperation(operation) {
        if (this.currentOperand === '') return

        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    // Perform the computation based on the chosen operation
    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return

        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '–':
                computation = prev - current
                break
            case '×':
                computation = prev * current
                break
            case '÷':
                if (current === 0) {
                    this.showError("Can't divide by zero");
                    this.errorClear()
                    return;
                }
                else {
                    computation = prev / current
                }
                break
            case '%':
                computation = (prev * current) / 100
                break
            default:
                return
        }
        // Update the history
        updateHistory(`${prev} ${this.operation} ${current}`, computation);

        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
        
    }

    // Format the number for display with commas and decimal points
    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    // Update the calculator display with current and previous operands
    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }

    // Display an error message
    showError(message) {
        errorMessageElement.style.display = 'block'; // Make the error message element visible
        errorMessageElement.innerText = message;
    }

    // Clear the error message
    clearError() {
        errorMessageElement.style.display = 'none'; // Hide the error message element
        errorMessageElement.innerText = '';
    }
    darkMode() {
        const toggleBtnIcon = document.querySelector('#darkModeToggle i')
        const body = document.querySelector('body');
        // toggleMode
        body.classList.toggle('dark-mode')
        const isOpen = body.classList.contains('dark-mode')
        // console.log(toggleBtnIcon)
        toggleBtnIcon.classList = isOpen
            ? 'bx bxs-sun'
            : 'bx bxs-moon'
    }
}

const toggleMode = document.querySelector('[data-toggle]');
const errorMessageElement = document.querySelector('[data-error-message]');
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

// Event listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

// Event listeners for operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

// Event listener for equals button
equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

// Event listener for clear button
allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

// Event listener for delete button
deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

toggleMode.addEventListener('click', button => {
    calculator.darkMode()
})



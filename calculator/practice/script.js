;(function () {
  'use strict'
  // 클래스를 이용해 구현하는 계산기
  // input을 element로 가져와 클래스 생성자의 인자로 주어서
  // element에 연산의 결과를 넣어주면 됨
  const get = (target) => {
    return document.querySelector(target)
  }

  const getAll = (target) => {
    return document.querySelectorAll(target)
  }

  class Calculator {
    constructor(element) {
      this.element = element
      this.currentValue = '' // 현재 버튼을 클릭했을 때 노출되는 밸류
      this.prevValue = '' // 연산자를 눌렀을 때 currentValue->prevValue로 값을 이동
      this.operation = null // 연산자
    }

    // 숫자를 눌렀을 때 두자리, 세자리 수가 되도록 입력받은 숫자를 append
    appendNumber(number) {
     // 소수점 한번만 입력되도록 처리 
      if(number === '.' && this.currentValue.includes('.')) return
      // 숫자를 붙여야 함(연산이 되면 안됨) -> string형으로 형변환해서 텍스트로 붙여줌
      this.currentValue = this.currentValue.toString() + number.toString()
      if(this.currentValue == '00') { this.clear() }
    }
    // 연산자를 눌렀을 때, this.operation에 연산자를 할당
    setOperation(operation) {
      this.resetOperation()
      this.operation = operation
      // operation이 클릭되면 currentValue -> prevValue가 되어야 함
      this.prevValue = this.currentValue
      this.currentValue = ''

      // 산술연산자 클릭 시 색이 변경되도록 함 
      const elements = Array.from(getAll('.operation')) // operation버튼을 다 가져옴
      const element = elements.filter((element) => 
        element.innerText.includes(operation) // 클릭 된 operation이 포함된 button element를 리턴
      )[0]
      element.classList.add('active')
    }
    // input에 값을 업데이트 하는 메서드
    updateDisplay() {
      if(this.currentValue) {
        this.element.value = this.currentValue
        return
      }
      if(this.prevValue) {
        this.element.value = this.prevValue
        return
      }
      this.element.value = 0
    }
    // 연산자를 초기화 하는 메서드 
    resetOperation() {
      this.operation = null
      const elements = Array.from(getAll('.operation'))
      elements.forEach((element) => {
        element.classList.remove('active')
      })
    }

    // 계산하는 메서드
    compute() {
      let computation // 결과값이 담기는 변수
      // 소수점연산이 가능하기 때문에 float으로 형변환
      const prev = parseFloat(this.prevValue) 
      const current = parseFloat(this.currentValue)
      if(isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
        case '+':
            computation = prev + current
          break;
          case '-':
            computation = prev - current
          break;
          case '*':
            computation = prev * current
          break;
          case '÷':
            computation = prev / current
          break;
        default:
          return;
      }

      this.currentValue = computation.toString()
      this.prevValue = ''
      this.resetOperation()
    }

    clear() {
      // 1. currenValue만 입력한 뒤 클리어 하는 경우
      // 2. currentValue를 입력한 뒤 연산자까지 입력하고 클리어 하는 경우
      // 3. currentValue + operation + prevValue를 모두 입력한 뒤 클리어하는 경우
      if(this.currentValue) {
        this.currentValue = ''
        return
      }
      if(this.operation) {
        this.resetOperation()
        this.currentValue = this.prevValue
        return
      }
      if(this.prevValue) {
        this.prevValue = ''
      }
    }

    clearAll() {
      this.resetOperation()
      this.prevValue = ''
      this.currentValue = ''
    }
  }  

  const numberButtons = getAll('.cell_button.number')
  const operations = getAll('.cell_button.operation')
  const display = get('.display')
  const compute = get('.cell_button.compute')
  const clear = get('.cell_button.clear')
  const allClear = get('.cell_button.all_clear')

  const calculator = new Calculator(display)

  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })

  operations.forEach((operation) => {
    operation.addEventListener('click', () => {
      calculator.setOperation(operation.innerText)
    })
  })
  
  compute.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
  })

  clear.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay()
  })

  allClear.addEventListener('click', () => {
    calculator.clearAll()
    calculator.updateDisplay()
  })

})()

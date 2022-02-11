;(function () {
  'use strict'
  /** 로직 분석 (클래스를 사용한 프로젝트) 
   * 1. start버튼을 누르면 setInterval을 이용해 스탑워치가 실행됨
   * 2. 스탑워치의 초기값 / 진행시간 / 현재시간을 저장함
   * 3. stop버튼을 누르면 clearInterval() -> 다시 start누르면 진행시간부터 다시 시작됨
   * 4. reset버튼을 누르면 모두 초기값으로 변경됨
  */
  const get = (target) => {
    return document.querySelector(target)
  }

  class Stopwatch {
    constructor(element){
      this.timer = element // 시간이 표시될 타이머부분
      this.interval = null // 인터벌
      this.defaultTime = `00:00.00` // 초기화된 시간
      this.startTime = 0 // 스톱 후 다시 시작할 때의 시간을 저장할 변수
      this.elapsedTime = 0 // 스타트 후 진행된 시간을 간직하고 있을 변수
    }

    addZero(number) {
      if(number < 10){
        number = '0'+ number
      }
      if(number > 99) {
        number = number.toString().slice(0, -1)
      }
      return number
    }

    timeToString(time) {
      // getUTC => 현재시간을 정확히 가져올 수 있음
      const date = new Date(time)
      const minute = date.getUTCMinutes()
      const seconds = date.getUTCSeconds()
      const miliseconds = date.getUTCMilliseconds()
      return `${this.addZero(minute)}:${this.addZero(seconds)}.${this.addZero(miliseconds)}`
    }

    print(text) {
      this.timer.innerHTML = text
    }

    startTimer() {
      this.elapsedTime = Date.now() - this.startTime
      const time = this.timeToString(this.elapsedTime)
      this.print(time)
    }

    start() {
      /** start함수 생성하기
       * 1. 현재 시간 - 진행 시간 => 시작 시간
       * 2. this객체가 global요소를 가져오지 않도록 함수를 만들어 바인딩
       * 3. startTimer()에서 진행시간을 간직할 수 있도록 변수에 저장
       * 4. timeToString()을 통해 시간을 계산해 가져옴
       * 5. 스탑워치의 00:00.00형식에 맞게 처리 (addZero)
       * 6. 가져온 값을 $timer에 표시 ( 10 밀리세컨드 마다 실행 )
       * 7. clearInterval로 start 버튼을 누를때마다 인터벌이 생기는 것을 방지 
       */
      clearInterval(this.interval)
      this.startTime = Date.now() - this.elapsedTime
      this.interval = setInterval(this.startTimer.bind(this), 10)
    }
    stop() {
      clearInterval(this.interval)
    }
    reset() {
      clearInterval(this.interval)
      this.elapsedTime = 0
      this.startTime = 0
      this.print(this.defaultTime)
    }
  }

  const $startButton = get('.timer_button.start')
  const $stopButton = get('.timer_button.stop')
  const $resetButton = get('.timer_button.reset')
  const $timer = get('.timer')
  const $stopwatch = new Stopwatch($timer)

  $startButton.addEventListener('click', () => {
    $stopwatch.start()
  })
  $stopButton.addEventListener('click', () => {
    $stopwatch.stop()
  })
  $resetButton.addEventListener('click', () => {
    $stopwatch.reset()
  })

})()

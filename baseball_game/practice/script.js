;(() => {
  'use strict'
  /** 로직 분석 :
   * 1. setPassword : Math.random()을 사용하여 야구게임의 임의의 네자릿수를 생성
   * 2. '도전' 버튼을 누르면 playGame()이 실행됨 
   * 3. playGame() 내부에서 숫자의 일치 여부, 시도 횟수등을 검사
   */

  const get = (target) => document.querySelector(target)

  const init = () => {
    get('form').addEventListener('submit', (event) => {
      playGame(event)
    })
    setPassword()
  }

  const baseball = {
    limit: 10,
    digit: 4,
    trial: 0,
    end: false,
    $question: get('.ball_question'),
    $answer: get('.ball_answer'),
    $input: get('.ball_input')
  }

  const { limit, digit, $question, $answer, $input} = baseball
  let { trial, end } = baseball

  const setPassword = () => {
    /* Password 지정  */
    const gameLimit = Array(limit).fill(false)
    let password = ''
    while (password.length < digit){
      const random = parseInt(Math.random() * 10, 10) 
      // parseInt는 10진수가 기본이 아니기떄문에 진수를 명시해줘야함
      if(gameLimit[random]){
        // gameLimit[random]이 true? => 해당 숫자가 이미 랜덤으로 추출되었음
        // 그러므로 해당 숫자는 건너뛰어줘야 중복되는 숫자 없이 난수가 발생됨 
        continue
      }
      password += random
      gameLimit[random] = true
    }
    baseball.password = password
  }

  const onPlayed = (number, hint) => {
    /* 시도를 했을 때 number: 내가 입력한 숫자, hint: 현재 어떤 상황? */
    return `<em>${trial}차 시도</em> : ${number}, ${hint}`
  }

  const isCorrect = (number, answer) => {
    /* 번호가 같은가? */
    return number === answer
  }

  const isDuplicated = (number) => {
    /* 중복 번호가 있는가? */
    return [...new Set(number.split(''))].length !== digit
    // new Set() : 새로운 배열을 중복없이 반환. 하나의 Set내 값은 한번만 나타낼 수 있음.
    // 즉, 어떤 값은 그 Set콜렉션 내에서 유일함
    // 입력받은 수를 하나씩 나눠서 중복된 숫자가 있는지 먼저 검사 한 뒤 digit의 자릿수를 갖지 않으면 true
    // 왜냐? -> number에 중복된 수가 있으면 하나만 나타나므로 number === digit이 될 수 없음
  }

  const getStrikes = (number, answer) => {
    /* 스트라이크 카운트는 몇개 */
    // 스트라이크 카운트 : 숫자의 자리가 난수의 자리와 같을 때

    let strike = 0 // 매 시도마다 스트라이크 카운트를 0으로 초기화
    const nums = number.split('')

    nums.map((digit, index) => {
      /* Array.map() : array에 대해 아래의 함수를 한번씩 다 실행해줌 */
      if(digit === answer[index]) {
        // 입력한 숫자와 난수의 자리를 비교
        strike++
        // 같은 것이 있으면 strike+1
      }
    })

    return strike
  }

  const getBalls = (number, answer) => {
    /* 볼 카운트는 몇개 */
    // 볼 카운트 : 자리는 틀리지만 숫자가 맞을 때 
    let ball = 0
    const nums = number.split('')
    const gameLimit = Array(limit).fill(false)

    answer.split('').map((num) => {
      // answer가 가지고 있는 숫자의 배열 인덱스를 true로
      // 숫자가 포함되어있는지 여부를 가리기 위한 배열
      gameLimit[num] = true
    })

    nums.map((num, index) => {
      // 입력받은 숫자(num) 의 자리가 일치하지 않고 (자리가 일치하면 스트라이크 카운트로)
      // gameLimit의 num번 인덱스가 true이면 볼 카운트 추가
      if(answer[index] !== num && !!gameLimit[num]) {
        ball++
      }
    })

    return ball

  }

  const getResult = (number, answer) => {
    /* 시도에 따른 결과는? */
    if(isCorrect(number, answer)) {
      // 만약 입력받은 숫자와 난수가 일치한다? 
      end = true // playGame() 에서 return되도록 함 
      $answer.innerHTML = baseball.password
      return '홈런!!!'
    }
    // 일치하지 않는다면 스트라이크와 볼 갯수를 확인해서 리턴해줌
    const strikes = getStrikes(number, answer)
    const balls = getBalls(number, answer)

    return 'STRIKE: ' + strikes + ', BALL: ' + balls
  }

  const playGame = (event) => {
    /* 게임 플레이~~ */

    event.preventDefault()
    if(!!end) {
      return
    }

    const inputNumber = $input.value // 입력받은 숫자값 가져오기
    const { password } = baseball

    if(inputNumber.length !== digit) { // 자릿수 모자랄 떄 
      alert(`${digit}자리 숫자를 입력해주세요.`)
    } else if(isDuplicated(inputNumber)) { // 중복되는 숫자가 있을 때 
      alert('중복된 숫자가 있습니다.')
    } else { // 위의 에러처리를 모두 통과한 경우
      trial++ // 시도 +1
      const result = onPlayed(inputNumber, getResult(inputNumber, password))
      // getResult(입력받은 숫자, 난수)를 이용해서 결과를 확인 후, onPlayed(입력받은 숫자, 결과)를 넘겨줌
      $question.innerHTML += `<span>${result}</span>`
      // <span><em>${trial}차 시도</em> : inputNumber, 'STRIKE: ' + strikes + ', BALL: ' + balls </span>
      if(limit <= trial && !isCorrect(inputNumber, password)) {
        // 시도가 10보다 작거나 같고, 숫자가 일치하지 않을 때
        alert('쓰리아웃')
        end = true // 끝났음을 알려줌
        $answer.innerHTML = password // 정답은? 부분에 난수를 표시
      }
    }
    $input.value = '' // 입력받은 숫자 초기화
    $input.focus() // 인풋에 포커싱 
  }

  init()
})()
;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  const $canvas = get('.canvas')
  const ctx = $canvas.getContext('2d')

  const $score = get('.score')
  const $highscore = get('.highscore')
  const $play = get('.js-play')

  const colorSet = {
    board: 'rgb(201, 202, 186)',
    snakeHead: 'rgb(235, 67, 210)',
    snakeBody: 'rgb(138, 93, 174)',
    food: 'rgb(255, 218, 3)'
  }
  
  let start = 0
  let option = {
    highscore: localStorage.getItem('.score') || 0,
    gameEnd: false,
    direction: 2,
    snake: [
      { x: 10, y: 10, direction: 2 },
      { x: 10, y: 20, direction: 2 },
      { x: 10, y: 30, direction: 2 },
    ],
    food: { x: 0, y: 0 },
    score: 0,
  }


  const init = () => {
    document.addEventListener('keydown', (event) => {
      if(!/Arrow/gi.test(event.key)) {
        return
      }
      event.preventDefault()
      const direction = getDirection(event.key)
      if(!isCorrectDirection(direction)) {
        return
      }
      option.direction = direction
    })
    $play.onclick = () => {
      if(option.gameEnd) {
        option = {
          highscore: localStorage.getItem('score') || 0,
          gameEnd: false,
          direction: 2,
          snake: [
            // 몸통 2개, 머리 하나를 배열사각형으로 지정 
            { x: 10, y: 10, direction:2 },
            { x: 10, y: 20, direction:2 },
            { x: 10, y: 30, direction:2 }
          ],
          food: { x:0 , y:0 },
          score: 0
        }
        $score.innerHTML = `점수 : 0점`
        $highscore.innerHTML = `최고점수 : ${option.highscore}점`
        randomFood()
      }
      window.requestAnimationFrame(play)
    }
   
  }
  
  const buildBoard = () => {
    ctx.fillStyle = colorSet.board
    ctx.fillRect(0, 0, 300, 300)
  }

  const buildSnake = (ctx, x, y, head = false) => {
    ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody
    ctx.fillRect(x, y, 10, 10)
  }

  const setSnake = () => {
    for (let i = option.snake.length - 1; i >= 0; --i) {
      buildSnake(ctx, option.snake[i].x, option.snake[i].y, i === 0)
    }
  }

  const buildFood = (ctx, x, y) => {
    ctx.beginPath()
    ctx.fillStyle = colorSet.food
    ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  const randomFood = () => {
    let x = Math.floor(Math.random() * 25) * 10
    let y = Math.floor(Math.random() * 25) * 10
    while (option.snake.some((part) => {part.x === x && part.y === y})) {
      x = Math.floor(Math.random() * 25) * 10
      y = Math.floor(Math.random() * 25) * 10
    }
    option.food = { x, y }
  }

  const setDirection = (number, value) => {
    if(value < 0) {
      value += number
    }
    return value % number
  }

  const playSnake = () => {
    let x = option.snake[0].x
    let y = option.snake[0].y

    switch (option.direction) {
      // down
      case 1:
        y = setDirection(300, y +10)
        break;
      // up
      case -1:
        y = setDirection(300, y -10)
        break;
      // left 
      case -2:
        x = setDirection(300, x -10)
        break;
      // right
      case 2:
        x = setDirection(300, x +10)
        break;
    }
    // 지렁이 머리의 방향이 바뀌면서 지렁이의 몸통을 새로 그리며 새로운 snake객체를 만들어냄 
    const snake = [{ x, y, direction: option.direction }]
    const snakeLength = option.snake.length
    for (let i = 1; i < snakeLength; ++i) {
      snake.push( {...option.snake[i -1]})
    }

    option.snake = snake
  }
  
  const getDirection = (key) => {
    let direction = 0
    switch (key) {
      case 'ArrowDown':
        direction = 1
        break;
      case 'ArrowUp':
        direction = -1
        break;
      case 'ArrowLeft':
        direction = -2
        break;
      case 'ArrowRight':
        direction = 2
        break;
    }
    return direction
  }

  const isCorrectDirection = (direction) => {
    return (
      option.direction === option.snake[0].direction 
      && option.direction !== - direction
    )
  }

  const setBody = () => {
    const tail = option.snake[option.snake.length -1]
    const direction = tail.direction
    let x = tail.x
    let y = tail.y

    switch (direction) {
      // down
      case 1:
        y = setDirection(300, y - 10)
        break;
      // up
      case -1:
        y = setDirection(300, y + 10)
        break;
      // left
      case -2:
        x = setDirection(300, x + 10)
        break;
      // right  
      case 2:
        x = setDirection(300, x - 10)
        break;
    }

    option.snake.push({x, y, direction})
  }

  const getFood = () => {
    const snakeX = option.snake[0].x
    const snakeY = option.snake[0].y
    const foodX = option.food.x
    const foodY = option.food.y

    if(snakeX === foodX && snakeY === foodY) {
      option.score++
      $score.innerHTML = `점수 : ${option.score}점`
      setBody()
      randomFood()
    }
  }

  const isGameOver = () => {
    const head = option.snake[0]
    return option.snake.some(
      (body, index) => index !== 0 && head.x === body.x && head.y === body.y
    )
  }

  const setHighscore = () => {
    const localScore = option.highscore * 1 || 0 
    const finalScore = $score.textContent.match(/(\d+)/)[0] * 1
    if(localScore < finalScore) {
      alert(`최고기록 : ${finalScore}점`)
      localStorage.setItem('score', finalScore)
    }
  }

  const play = (timestamp) => {
    start++
    if(option.gameEnd) {
      return
    }

    if(timestamp - start > 1000 / 10) {
      if(isGameOver()){
        option.gameEnd = true
        setHighscore()
        alert('Game Over!!!')
        return
      }
      playSnake()
      buildBoard()
      buildFood(ctx, option.food.x, option.food.y)
      setSnake()
      getFood()
      start = timestamp
    }
    window.requestAnimationFrame(play)
  }

  init()
})()


// canvas element 가져오기
// context가져오기 (canvas element를 이용해서)
// context를 이용해서 영역이나 먹이, 뱀등을 그림 
// Score, button등을 가져옴
// colorSet 옵션화 
// 		const colorSet = { 
// 			board: 배경색,
// 			snakeHead: 뱀 머리색,
// 			snakeBody: 뱀 몸통색,
// 			food: 먹이 색
// 		}
// highscore = loaclstorage이용.
// 브라우저를 닫더라도 계속 유지됨
// 브라우저 세션간 공유
// 만료가 되지 않기 때문에 직접 삭제하지 않는 한 계속 저장됨
// db가 없는 환경에서 사용할 수 있음

// 옵션에 필요한 변수 :
// Highscore
// gameEnd (게임 종료 여부)
// Direction (진행방향 - 동서남북을 1 -1 -2 2 로 표현)
// snake 
//    snake: [
//       // 몸통 2개, 머리 하나를 배열사각형으로 지정 
//       { x: 10, y: 10, direction:2 },
//       { x: 10, y: 20, direction:2 },
//       { x: 10, y: 30, direction:2 },
//     ],

// food (먹이는 생성 좌표를 먼저 초기화)
// Score 

// Init()생성
// init내부에서 방향키에만 이벤트를 걸어줌 (keydown / Arrow정규식 활용)
// 기본이벤트 방지 
// getDirection() : 진행방향을 가져옴
// isDirectionCorrect() : 진행방향 확인
// 방향이 맞으면 option.direction에 방향 할당
// buildBoard() 생성
// canvas context를 이용해서 생성
// Fillstyle + fillrect : fillstyle에 적용한 색을 이용해서 사각형을 그림
// ctx.fillRect(0, 0, 300, 300) : 캔버스의 (0.0)좌표에서부터 가로 300, 세로 300의 영역을 갖는 사각형을 그리도록 함
// buildSnake() 생성
// 파라미터로 컨텍스트 , 해당하는 지렁이의 부위의 x위치, y위치, 이 부위가 머리인지 여부 를 받음(기본값은 false)
// 머리와 몸통에 각각 colorSet을 설정해줌
// fillRect(x, y, 10, 10) : x, y 위치에 10픽셀*10픽셀의 사각형을 그리게 함
// setSnake() 생성
// for문을 사용 
// snake로 선언해둔 배열만큼 for문이 돌면서 뱀의 머리와 몸통을 그림
// For(let i = option.snake.length - 1; i >= 0; —i)
// 		i가 배열의 갯수만큼일 때, i가 0과 같거나 클때까지 먼저 i-1
// 		i === 0 이면, snake[0]을 가리키므로 snakeHead가 됨
// buildFood() 생성
// 파라미터로 x, y, context를 받음
// 먹이는 beginPath()를 이용해 생성함 (먹이는 사각형이 아닌 원이므로)
// fillstyle로 colorSet지정
// ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI)
// X, y를 각각 0으로 선택하게되면 원의 정 중앙이 (0.0)이 되어 화면에서 짤리게 됨
// 따라서 먹이에 할당하는 픽셀의 반 만큼의 범위를 +해주어 짤리지 않게 함
// Arc(x점, y점, 반지름, 시작앵글, 끝앵글)
// ctx.fill() 로 생성 
// Init() 에 $play.onclick 생성
// 옵션값을 변경 
// gameEnd ? localstorage에서 점수 가져와서 highscore에 넣어줌
// gameEnd = true
// 나머지값은 그대로 사용
// $score / $highscore에 각각의 값 입력
// randomFood() 생성
// Window.requestAnimationFrame(play) 로 play함수가 계속해서 반복되도록 함
// Play() 생성
// play함수는 파라미터로 timestamp를 받음
// 증가하는 timestamp값에서 play함수가 한번 실행될 때마다 1씩 증가하는 start변수를 통해
// 값을 빼주며 증가값을 상쇄시킴
// isGameOver() => gameEnd option값을 변경
// buildBoard(), buildFood(), setSnake() 선언

// 지렁이 게임 컨트롤 함수

// randomFood() 생성
// x 축과 y축을 랜덤으로 생성해줌 
// 	Math.floor(Math.random() * 25) * 10 
// 	=> 랜덤으로 생성되는 수 * 25한 값에서 소수점을 떼고 10을 곱함
// 	=> 25 * 10 : 캔버스의 250픽셀의 영역 안에서 랜덤으로 발생할 수 있도록 함
// 	(300 * 300 캔버스이므로 250이지만 숫자는 얼마든지 바뀔 수 있음)
// While (option.snake.some( (part) => {} )
// Some() : 배열 내에 일치하는 것이 하나라도 있으면 반환
// every()는 배열을 다 돈 뒤에 반환하지만, some은 일치하는것이 발견되는 즉시 반환
// part.x / y (지렁이의 좌표) === x / y (생성된 푸드의 좌표) = 다시 랜덤으로 푸드의 좌표를 재설정 (랜덤푸드가 놓이자마자 지렁이가 성장하는것을 막기 위해)
// Option.food 에 x, y 값을 할당
// getFood() 생성
// 뱀이 푸드를 먹었을 때의 상황을 나타내는 함수
// 뱀의 x, y포지션 / 푸드의 x, y포지션을 가져와서
// 뱀의 x, y포지션이 푸드의 x, y포지션과 일치하는 경우 => 뱀이 먹이를 먹은 상태 이므로, score++ / $score에도 점수를 반영
// setBody() 로 지렁이를 성장시킴
// randomFood() 다시 랜덤으로 먹이를 발생시킴
// setBody() 생성
// 지렁이의 몸을 1씩 증가시켜주는 함수
// 지렁이의 꼬리를가져옴 $tail
// $tail의 direction을 가져옴
// $tail의 x, y 포지션을 가져옴
// switch문을 이용해서 지렁이의 꼬리의 위치와 방향, 10픽셀짜리의 사각형을 그려주기 위한 setDirection() 을 실행시킴
// 위쪽으로 가는 도중에 먹이를 먹었다면 아래로 추가해줘야 하므로 y + 10
// 아래쪽으로 가는 도중에 먹이를 먹었다면 위로 추가해줘야하므로 y - 10
// …
// option.snake.push(x포지션, y포지션, 방향)
// setDirection() 생성
// 파라미터로 캔버스의 높이, 넓이를 받은 number
// x, y축의 위치를 받음
// Value < 0 => value += number
// value가 0보다작다? 캔버스 밖을 벗어나는 것이므로 +캔버스 너비 해줘서 영역밖을 벗어나지 않도록 함
// 그렇지 않으면? value값을 캔버스 너비로 나누어 캔버스 영역 안에서 놀도록 함 
// getDirection() 
// 파라미터로 이벤트 키를 받음
// Direction = 0 초기화
// Switch case문을 이용해 방향키에 따른 디렉션을 할당해줌
// Return direction
// isCorrectDirection() 생성
// 지렁이가 가고있는 방향에서 역방향으로는 진행할 수 없도록 체크
// Option.direction === option.snake[0].direction
// => 방향키가 뱀머리의 진행방향과 같고
// && option.direction !== -direction
// => 방금 누른 방향키가 반대방향이 아닌 경우 : 잘 가고있음
// playSnake() 생성
// 실제로 지렁이를 움직이게 하는 함수
// snake의 x, y포지션을 가져옴
// switch문 사용 (네가지 경우가 확실히 정해져있는 방향의 경우 스위치문이 경제적임)
// 방향전환에 따른 setDirection()
// snake객체 선언 [{x , y , direction}]
// sankeLength 선언
// for문을 이용해서 머리 방향이 바뀐 지렁이를 새로 그려줌
// 새로 생성한 snake 객체를 option.snake에 할당 
// isGameOver() 생성
// snake.head를 가져옴
// head가 지렁이의 몸에 닿으면 게임이 끝나도록 함
// Some()을 사용=> head와 body의 x, y좌표가 같으면 게임이 오버되게 함
// setHighscore() 생성
// Localscore : 현재 옵션에 있는 highscore를 가져옴
// Finalscore : $score에 존재하는 점수를 가져옴 (숫자만 가져오도록 정규표현식 사용)
// 만약 localscore < finalscore => 최고기록을 변경해줌 
// Localstorage.setItem(’score’, finalscore)


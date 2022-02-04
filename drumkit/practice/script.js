;(function () {
  'use strict'

  const get = function (target) {
    return document.querySelector(target)
  }

  const getAll = function (target) {
    return document.querySelectorAll(target)
  }

  const keys = Array.from(getAll('.key'))

  const soundsRoot = 'assets/sounds/'
  const drumSounds = [
    { key: 81, sound: 'clap.wav' },
    { key: 87, sound: 'crash.wav' },
    { key: 69, sound: 'hihat.wav' },
    { key: 65, sound: 'kick.wav' },
    { key: 83, sound: 'openhat.wav' },
    { key: 68, sound: 'ride.wav' },
    { key: 90, sound: 'shaker.wav' },
    { key: 88, sound: 'snare.wav' },
    { key: 67, sound: 'tom.wav' },
  ]

  const getAudioElement = (index) => {
    const audio = document.createElement('audio')
    audio.dataset.key = drumSounds[index].key
    audio.src = soundsRoot + drumSounds[index].sound
    return audio
  }

  const playSound = (keyCode) => {
    const $audio = get(`audio[data-key="${keyCode}"]`)
    const $key = get(`div[data-key="${keyCode}"]`)
    if($audio && $key){
      $key.classList.add('playing')
      $audio.currentTime = 0
      $audio.play()
    }
  }

  const onkeydown = (e) => {
    playSound(e.keyCode)
  }

  const onmousedown = (e) => {
    const keyCode = e.target.getAttribute('data-key')
    playSound(keyCode)
  }

  const ontransitionend = (e) => {
    if(e.propertyName === 'transform') {
      e.target.classList.remove('playing')
    }
  }

  const init = () => {
    window.addEventListener('keydown', onkeydown)
    keys.forEach((key, index) => {
      const audio = getAudioElement(index)
      key.appendChild(audio)
      key.dataset.key = drumSounds[index].key
      key.addEventListener('click', onmousedown)
      key.addEventListener('transitionend', ontransitionend)
    })

  }

  init()
})()


// ;(function () {
//   'use strict'

//   /** 로직 분석
//    * 1. getAll()을 이용해서 드럼의 각 소리를 낼 요소들을 가져옴 (.key)
//    * 2. 가져온 각 요소들을 배열로 변환해주고 각 key들과 audio를 맵핑해줌
//    */

//   const get = function (target) {
//     return document.querySelector(target)
//   }

//   const getAll = function (target) {
//     return document.querySelectorAll(target)
//   }

//   // const nKeys = getAll('.key') => 노드리스트로 반환됨 (유사배열객체)
//   // Array.from()을 통해 유사배열 객체를 배열로 변환시켜줌
//   const keys = Array.from(getAll('.key'))

//   const soundsRoot = 'assets/sounds/'
//   const drumSounds = [
//     { key: 81, sound: 'clap.wav' },
//     { key: 87, sound: 'crash.wav' },
//     { key: 69, sound: 'hihat.wav' },
//     { key: 65, sound: 'kick.wav' },
//     { key: 83, sound: 'openhat.wav' },
//     { key: 68, sound: 'ride.wav' },
//     { key: 90, sound: 'shaker.wav' },
//     { key: 88, sound: 'snare.wav' },
//     { key: 67, sound: 'tom.wav' },
//   ]

//   // 각각의 키값을 갖는 오디오태그를 생성하는 함수
//   const getAudioElement = (index) => {
//     const audio = document.createElement('audio') // <audio> 생성
//     audio.dataset.key = drumSounds[index].key // <audio>에 data-key 속성을 부여해줌 (drumSound의 key값)
//     audio.src = soundsRoot + drumSounds[index].sound // <audio>에 sound를 맵핑해줌 (경로+sound name)
//     return audio
//   }

//   const playSound = (keyCode) => { // 소리를 재생하는 함수
//     const $audio = get(`audio[data-key="${keyCode}"]`) // data-key = keyCode일 때 오디오를 가져옴
//     // 클릭했을 때 transform을 이용해서 클릭한 key에 효과주기
//     // 클릭된 key를 가져옴 => audio와 key값이 모두 있을 때, playing클래스를 추가해서
//     // transform: scale(1.1)속성을 부여 + audio재생
//     const $key = get(`div[data-key="${keyCode}"]`) 
//     if($audio && $key) {
//       $key.classList.add('playing')
//       $audio.currentTime = 0 // 재생시간 초기화
//       $audio.play()
//     }
//   }

//   const onkeydown = (e) => {
//     playSound(e.keyCode) // 이벤트로 keyCode를 가져와 소리를 내주는 메서드에 파라미터로 전달
//   }

//   // 키보드 눌러서 하는것이 아닌 마우스 클릭으로 소리 재생하도록 함
//   const onmousedown = (e) => {
//     const keyCode = e.target.getAttribute('data-key') 
//     // 클릭한 요소의 키코드는 data-key 속성값으로 가지고 있으므로 클릭한 target의 속성값을 가져옴
//     playSound(keyCode)
//   }

//   // transform: sacle(1.1)이 끝나면 playing 클래스를 없애 transform이 적용되지 않도록 함
//   const ontransitionend = (e) => {
//     if(e.propertyName === 'transform') {
//       e.target.classList.remove('playing')
//     }
//   }

//   const init = () => {
//     window.addEventListener('keydown', onkeydown) // 키보드 키를 눌렀을 때 실행
//     keys.forEach((key, index) => {
//       /** .key 안에 <audio>를 생성 후, 하위요소로 append */
//       const audio = getAudioElement(index)
//       key.appendChild(audio)
//       key.dataset.key = drumSounds[index].key // .key에 data-key 속성을 추가해줌(오디오의 key값)
//       key.addEventListener('click', onmousedown) // 클릭했을 때 이벤트
//       key.addEventListener('transitionend', ontransitionend) // transform 속성이 완료되었을 때 실행할 이벤트 
//     })
//   }

//   init()
// })()

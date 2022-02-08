;(function () {
  'use strict'


  // 꼭 두번 더 해볼 것 

  /** 로직 분석 
   * 1. 검색창에 검색어를 입력하면 검색어 걸리는 썸네일만 표시됨
   * 2. 썸네일에 마우스오버하면 jpg가 webp로 변경됨 (마우스아웃하면 webp -> jpg로 변경)
   * 3. 썸네일을 클릭하면 hash를 이용해 비디오재생페이지로 이동함
   *    $list에 hashchange() 실행해서 해시값 주고, 
   *    hashchange값 생기면 윈도우에 hashchange이벤트 걸어주기
   *    hashchange이벤트로 현재페이지 구분해서 list페이지 / view페이지 왔다갔다하기 
   * 4. 비디오페이지에서 각종 버튼 활성화 
   *    buttonChange : 토글로 상태가 표시되는 버튼들의 이름을 변경해줌 
   */

  const get = (target) => document.querySelector(target)
  const getAll = (target) => document.querySelectorAll(target)

  const $search = get('#search')
  const $searchButton = get('.btn_search')
  const $list = getAll('.contents.list figure')

  // video player의 여러 요소 가져오기
  const $player = get('.view video')
  const $progress = get('.js-progress')
  const $btnReplay = get('.js-replay')
  const $btnPlay = get('.js-play')
  const $btnStop = get('.js-stop')
  const $volume= get('.js-volume')
  const $btnMute = get('.js-mute')
  const $fullScreen = get('.js-fullScreen')

  const init = () => {
    $search.addEventListener('keyup', search)
    $searchButton.addEventListener('click', search)

    // 썸네일 개별마다 이벤트를 걸어줘야하므로 for문 돌리기
    for (let index = 0; index < $list.length; index++) {
      const $target = $list[index].querySelector('picture')
      $target.addEventListener('mouseover', onMouseOver)
      $target.addEventListener('mouseout', onMouseOut)
    }

    for (let index = 0; index < $list.length; index++) {
      $list[index].addEventListener('click', hashChange)
    }

    window.addEventListener('hashchange', () => {
      // hash를 이용함
      const isView = -1 < window.location.hash.indexOf('view')
      if(isView) {
        getViewPage()
      } else {
        getListView()
      }
    })
    // view page의 버튼이벤트를 다 init에 선언하면 init이 길어지고 보기힘듦
    viewPageEvent()
  }

  const search = () => {
    let searchText = $search.value.toLowerCase()
    for (let index = 0; index < $list.length; index++) {
      const $target = $list[index].querySelector('strong')
      const text = $target.textContent.toLowerCase()

      if(-1 < text.indexOf(searchText)) {
        $list[index].style.display = 'flex'
      } else {
        $list[index].style.display = 'none'
      }
    }
  }

  const onMouseOver = (e) => {
    // console.log(e.target) // <img src="./assets/sample.jpg" alt="sample">
   
    // console.log(e.target.parentNode)
    // <picture>
    //   <source srcset="./assets/sample.jpg" type="image/webp">
    //   <source srcset="./assets/sample.jpg" type="image/jpg">
    //   <img src="./assets/sample.jpg" alt="sample">
    // </picture>

    const webpPlay = e.target.parentNode.querySelector('source')
    // 첫번째 source를 가져와서 사용
    webpPlay.setAttribute('srcset', './assets/sample.webp')
  }

  const onMouseOut = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source')
    webpPlay.setAttribute('srcset', './assets/sample.jpg')
  }

  const hashChange = (e) => {
    e.preventDefault()
    const parentNode = e.target.closest('figure')
    const viewTitle = parentNode.querySelector('strong').textContent
    // textContent를 붙여야 텍스트로 뽑아짐
    window.location.hash = `view&${viewTitle}`
    getViewPage()
  }

  const getViewPage = () => {
    const viewTitle = get('.view strong')
    const urlTitle = decodeURI(window.location.hash.split('&')[1])
    viewTitle.innerText = urlTitle

    get('.list').style.display = 'none'
    get('.view').style.display = 'flex'
  }

  const getListView = () => {
    get('.list').style.display = 'flex'
    get('.view').style.display = 'none'
  }

  const buttonChange = (btn, value) => {
    btn.innerText = value
  }

  const viewPageEvent = () => {
    $volume.addEventListener('change', (e) => {
      $player.volume = e.target.value
    })

    // timeupdate, play ... => video tag에서 지원하는 이벤트 
    $player.addEventListener('timeupdate', setProgress) // time이 업데이트 되면 progress bar에도 영향이가도록 함
    $player.addEventListener('play', buttonChange($btnPlay, 'pause')) // 플레이버튼 눌렀을 때, 플레이버튼을 일시정지버튼으로 text변경
    $player.addEventListener('pause', buttonChange($btnPlay, 'play')) // 일시정지버튼 눌렀을 때, 일시정지버튼을 플레이버튼으로 text변경
    $player.addEventListener('volumeChange', () => {
      // 볼륨이 변경되었을 때, 플레이어의 볼륨이 뮤트되어었냐? 그러면 버튼텍스트를 unmute로 : 아니면 mute로 해라
      $player.muted ? buttonChange($btnMute, 'unmute') : buttonChange($btnMute, 'mute')
    })
    $player.addEventListener('ended', $player.pause())
    $progress.addEventListener('click', getCurrent) // progress bar가 클릭으로 변경되면 그 값을 가져옴 
    $btnPlay.addEventListener('click', playVideo) // 플레이버튼 눌렀을 때 비디오 실행
    $btnReplay.addEventListener('click', replayVideo) // 리플레이버튼 눌렀을 때 비디오 실행
    $btnStop.addEventListener('click', stopVideo) // 스탑버튼 눌렀을 때 비디오 정지
    $btnMute.addEventListener('click', mute) // 뮤트 버튼 눌렀을 떄 볼륨 뮤트
    $fullScreen.addEventListener('click', fullScreen) // 풀스크린 버튼 눌렀을 떄 풀스크린
  }

  const getCurrent = (e) => {
    let percent = e.offsetX / $progress.offsetWidth
    // progress의 전체 넓이에서 내가 클릭한 offsetX의 값으로 나눠주면 퍼센트값이 도출됨
    $player.currentTime = percent * $player.duration
    e.target.value = Math.floor(percent / 100)
  }

  const setProgress = () => {
    let percentage = Math.floor(100 / $player.duration) * $player.currentTime
    $progress.value = percentage
  }

  const playVideo = () => {
    if($player.paused || $player.ended) {
      buttonChange($btnPlay, 'pause')
      $player.play()
    } else {
      buttonChange($btnPlay, 'play')
      $player.pause()
    }
  }

  const stopVideo = () => {
    $player.pause()
    $progress.value = 0
    $player.currentTime = 0
    buttonChange($btnPlay, 'play')
  }

  const resetPlayer = () => {
    $player.pause()
    $player.currentTime = 0
    buttonChange($btnPlay, 'play')
  }

  const replayVideo = () => {
    resetPlayer()
    $player.play()
    buttonChange($btnPlay, 'pause')
  }

  const mute = () => {
    if($player.muted) {
      buttonChange($btnMute, 'mute')
      $player.muted = false
    } else {
      buttonChange($btnMute, 'unmute')
      $player.muted = true
    }
  }

  const fullScreen = () => {
    if($player.requestFullscreen) {
      if(document.fullscreenElement){
        document.cencelFullscreen()
      } else {
        $player.requestFullscreen()
      }
    } else if($player.msRequestFullscreen) {
      if(document.msRequestFullscreen) {
        document.msExitFullscreen()
      } else {
        $player.msRequestFullscreen()
      }
    } else {
      alert('Not Supported')
    }
  }

  init()
})()


// ;(function () {
//   'use strict'

//   const get = (target) => document.querySelector(target)
//   const getAll = (target) => document.querySelectorAll(target)

//   // targeting 하는 요소가 element의 node인 경우, $를 표시해 변수를 선언
//   const $search = get('#search') // input가져옴
//   const $list = getAll('.contents.list figure') // 썸네일아이템 가져옴
//   const $searchButton = get('.btn_search') // 검색버튼 가져옴

//   const $player = get('.view video')
//   const $btnPlay = get('.js-play')
//   const $btnReplay = get('.js-replay')
//   const $btnStop = get('.js-stop')
//   const $btnMute = get('.js-mute')
//   const $progress = get('.js-progress')
//   const $volume = get('.js-volume')
//   const $fullScreen = get('.js-fullScreen')
  

//   const init = () => {
//     $search.addEventListener('keyup', search); // input에 텍스트 들어오면 search실행
//     $searchButton.addEventListener('click', search); // 돋보기 클릭하면 search실행
    
//     for (let index = 0; index < $list.length; index++) {
//       // 리스트에 있는 picture태그마다 이벤트가 들어가야하므로 for문 사용
//       const $target = $list[index].querySelector('picture') // 썸네일을 가져옴
//       $target.addEventListener('mouseover', onMouseover) // 마우스오버시 썸네일이미지를 webp로 변경
//       $target.addEventListener('mouseout', onMouseout) // 마우스아웃시 webp를 jpg로 변경
//     }

//     for (let index = 0; index < $list.length; index++) {
//       $list[index].addEventListener('click', hashChange)
//       // hashChange()를 통해 해시값이 변경되도록 하면서 
//       // 그 해시값이 viewPage를 display="flex"로 변경되어 노출시키도록 해줌 
//     }

//     window.addEventListener('hashchange', () => {
//       // 만약 hash값이 변경되게 되면 해시값에 view가 포함되어있는지 여부를 확인 후,
//       // 해시값에 view가 포함되어있으면 getViewPage()로 viewPage를 가져옴
//       const isView = -1 < window.location.hash.indexOf('view')
//       if(isView) {
//         getViewPage()
//       } else {
//         getListView()
//       }
//     })

//     viewPageEvent()
//   }
//   // 검색기능
//   const search = () => {
//     let searchText = $search.value.toLowerCase() // input박스에 입력된 값을 소문자로 가져옴
//     for (let index = 0; index < $list.length; index++) {
//       // 썸네일 아이템의 제목을 가져와서 
//       const $target = $list[index].querySelector('strong')
//       // 제목 태그에 입력된 값을 모두 소문자로 변경
//       const text = $target.textContent.toLowerCase()

//       if(-1 < text.indexOf(searchText)) {
//         // searchText가 가진 값에 text가 포함되어 있는지
//         // 포함되어있으면 인덱스를 반환하고 포함되어 있지 않으면 -1을 반환하므로
//         // -1보다 큰 경우 display="flex" / 아닌경우 display="none"
//         $list[index].style.display = 'flex'
//       } else {
//         $list[index].style.display = 'none'
//       }
//     }
//   }

//   const onMouseover = (e) => {
//     const webpPlay = e.target.parentNode.querySelector('source')
//     webpPlay.setAttribute('srcset', './assets/sample.webp')
//   }
  
//   const onMouseout = (e) => {
//     const webpPlay = e.target.parentNode.querySelector('source')
//     webpPlay.setAttribute('srcset', './assets/sample.jpg')
//   }

//   const hashChange = (e) => {
//     // hashChange는 클릭 이벤트로 발생되기 때문에 이전에 a태그에 있는 이벤트들을 먼저 막아준 뒤,
//     // 원하는 이벤트만 실행할 수 있도록 preventDefault()를 사용
//     e.preventDefault()
//     const parentNode = e.target.closest('figure') // 클릭한 요소의 썸네일아이템을 가져옴
//     const viewTitle = parentNode.querySelector('strong').textContent // 썸네일 아이템이 가진 제목을 가져옴
//     window.location.hash = `view&${viewTitle}`
//     // 해시값을 바꾸는 이유? 뷰를 탐색하고 있는 hashChange()가 바뀌게되면 자동으로 이벤트가 발생하며
//     // 이 페이지가 isView페이지인지 자동으로 확인할 수 있게 해줌 (해시를 바꿈으로써 자동으로 이벤트가 발생됨이 포인트)
//     getViewPage()
//   }

//   const getViewPage = () => {
//     const viewTitle = get('.view strong')
//     const urlTitle = decodeURI(window.location.hash.split('&')[1])
//     viewTitle.innerText = urlTitle 
//     // 인코딩된 문자열을 입력하면 제대로 나타나지 않는 경우가 있어 디코딩한 문자열을 넣어줌
//     // view page가 아닌경우, view page를 띄우도록 
//     get('.list').style.display = 'none'
//     get('.view').style.display = 'flex'
//   }

//   const getListView = () => { // view page인 경우, list를 띄우도록 함 
//     get('.list').style.display = 'flex'
//     get('.view').style.display = 'none'
//   }

//   const buttonChange = (btn, value) => {
//     btn.innerHTML = value
//   }

//   const viewPageEvent = () => {
//     $volume.addEventListener('change', (e) => {
//       $player.volume = e.target.value 
//     })

//     $player.addEventListener('timeupdate', setProgress)
//     $player.addEventListener('play', buttonChange($btnPlay, 'pause'))
//     $player.addEventListener('pause', buttonChange($btnPlay, 'play'))
//     $player.addEventListener('volumeChange', () => {
//       $player.muted ? buttonChange($btnMute, 'unmute') : buttonChange($btnMute, 'munte')
//     })
//     $player.addEventListener('ended', $player.pause())
//     $progress.addEventListener('click', getCurrent)
//     $btnPlay.addEventListener('click', playVideo)
//     $btnStop.addEventListener('click', stopVideo)
//     $btnReplay.addEventListener('click', replayVideo)
//     $btnMute.addEventListener('click', mute)
//     $fullScreen.addEventListener('click', fullScreen)
//   }

//   const getCurrent = (e) => {
//     let percent = e.offsetX / $progress.offsetWidth
//     $player.currentTime = percent *$player.duration
//     e.target.value = Math.floor(percent / 100)
//   }

//   const setProgress = (e) => {
//     let percentage = Math.floor((100 / $player.duration) * $player.currentTime)
//     $progress.value = percentage
//   }

//   const playVideo = () => {
//     if($player.paused || $player.ended) {
//       buttonChange($btnPlay, 'pause')
//       $player.play()
//     } else {
//       buttonChange($btnPlay, 'play')
//       $player.pause()
//     }
//   }

//   const stopVideo = () => {
//     $player.pause()
//     $progress.value = 0
//     $player.currentTime = 0
//     buttonChange($btnPlay, 'play')
//   }

//   const resetPlayer = () => {
//     $player.pause()
//     $player.currentTime = 0
//     buttonChange($btnPlay, 'play')
//   }

//   const replayVideo = () => {
//     resetPlayer()
//     $player.play()
//     buttonChange($btnPlay, 'pause')
//   }

//   const mute = () => {
//     if($player.muted) {
//       buttonChange($btnMute, 'mute')
//       $player.muted = false
//     } else {
//       buttonChange($btnMute, 'unmute')
//       $player.muted = true
//     }
//   }

//   const fullScreen = () => {
//     if($player.requestFullscreen) {
//       if(document.fullScreenElement) {
//         document.cancelFullScreen()
//       } else (
//         $player.requestFullscreen()
//       )
//     } else if($player.msRequestFullscreen) {
//       // 구형 브라우저 대응을 위한 풀스크린 메서드 
//       if(document.msRequestFullscreen) {
//         document.msExitFullscreen()
//       } else {
//         $player.msRequestFullscreen()
//       }
//     } else {
//       alert('Not Supported')
//     }
//   }

//   init()
// })()

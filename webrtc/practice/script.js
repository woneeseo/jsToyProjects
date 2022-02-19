;(() => {
  'use strict'
  const get = (target) => document.querySelector(target)
  const allowUser = {
    audio: true,
    video: true,
  }

  class WebRtc {
    constructor() {
      this.media = new MediaSource()
      this.recorder
      this.blobs
      this.playedVideo = get('video.played')
      this.recordVideo = get('video.record')
      this.btnPlay = get('.btn_play')
      this.btnRecord = get('.btn_record')
      this.btnDownload = get('.btn_download')
      this.container = get('.webrtc')

      this.events() // 녹화, 다운로드, 재생등을 컨트롤

      navigator.mediaDevices.getUserMedia(allowUser).then((videoAudio) => {
        this.success(videoAudio)
      })
    }

    events() {
      this.btnRecord.addEventListener('click', this.toggleRecord.bind(this))
      this.btnPlay.addEventListener('click', this.play.bind(this))
      this.btnDownload.addEventListener('click', this.download.bind(this))
    }

    success(audioVideo) {
      this.btnRecord.removeAttribute('disabled')
      window.stream = audioVideo
      if(window.URI) {
        this.playedVideo.setAttribute('src', window.URL.createObjectURL(audioVideo))
      } else {
        this.playedVideo.setAttribute('src', audioVideo)
      }
    }

    pushBlobData(event) {
      if(!event.data || event.data < 1) return
      this.blobs.push(event.data) 
    }

    toggleRecord() {
      if('녹화' === this.btnRecord.textContent){
        this.startRecord()
      } else {
        this.btnPlay.removeAttribute('disabled')
        this.btnDownload.removeAttribute('disabled')
        this.btnRecord.textContent = `녹화`
        this.stopRecord()
      }
    }

    startRecord() {
      let type = { mimeType: 'video/webm;codecs=vp9' }
      this.blobs = []
      if(!MediaRecorder.isTypeSupported(type.mimeType)) {
        type = { mimeType: 'video/webm' }
      }

      this.recorder = new MediaRecorder(window.stream, type)
      this.btnRecord.textContent = `중지`
      this.btnPlay.setAttribute('disabled', true)
      this.btnDownload.setAttribute('disabled', true)
      this.recorder.ondataavailable = this.pushBlobData.bind(this)
      this.recorder.start(20)
    }

    stopRecord() {
      this.recorder.stop()
      this.recordVideo.setAttribute('controls', true)
    }

    play() {
      this.recordVideo.src = window.URL.createObjectURL(
        new Blob(this.blobs, {type: 'video/webm'})
      )
    }

    download() {
      const videoFile = new Blob(this.blobs, {type: 'video/webm'})
      const url = window.URL.createObjectURL(videoFile)
      const downloader = document.createElement('a')
      downloader.style.display = 'none'
      downloader.setAttribute('href', url)
      downloader.setAttribute('download', 'test_video.webm')
      this.container.appendChild(downloader)
      downloader.click()

      setTimeout(() => {
        this.container.removeAttribute(downloader)
        window.URL.revokeObjectURL(url)
      }, 100)
    }

  }

  new WebRtc()
})()


// ;(() => {
//   'use strict'
//   const get = (target) => document.querySelector(target)
//   const allowUser = { 
//     // mediastream객체를 사용하기 위해 사용자에게 사용권한을 요청해서 true값을 받아야 함
//     audio: true,
//     vidio: true,
//   }

//   class WebRTC {
//     constructor() {
//       this.media = new MediaSource()
//       this.recorder 
//       this.blobs // 파일 다운로드를 위한 blob
//       this.playVideo = get('video.played')
//       this.recordVideo = get('video.record')
//       this.downloadVideo = get('video.download')
//       this.btnRecord = get('.btn_record')
//       this.btnPlay = get('.btn_play')
//       this.btnDownload = get('.btn_download')
//       this.container = get('.webrtc')
//       this.events()
//       // 객체 생성과 동시에 allowUser라는 오디오/비디오 권한 허용을 받아오는것을 성공하면? -> success실행
//       navigator.mediaDevices.getUserMedia(allowUser).then((videoAudio) => {
//         this.success(videoAudio)
//       })
//     }
//     // 4.
//     events() {
//       this.btnRecord.addEventListener('click', this.toggleRecord.bind(this))
//       this.btnPlay.addEventListener('click', this.play.bind(this))
//       this.btnDownload.addEventListener('click', this.download.bind(this))
//     }
//     // 3.
//     success(audioVideo) {
//       this.btnRecord.removeAttribute('disabled')
//       window.stream = audioVideo
//       if(window.URL){
//         // window.URL을 통해 소켓통신에 성공하게 되면 createObjectURL을 이용
//         this.playVideo.setAttribute('src', window.URL.createObjectURL(audioVideo))
//       } else {
//         // 그렇지 않으면 html의 video태그 안에서 재생할 수 있도록 함 
//         this.playVideo.setAttribute('src', audioVideo)
//       }
//     }
//     // 5.
//     toggleRecord() {
//       if('녹화' === this.btnRecord.textContent) {
//         this.startRecord()
//       } else {
//         this.btnPlay.removeAttribute('disabled')
//         this.btnDownload.removeAttribute('disabled')
//         this.btnRecord.textContent = '녹화'
//         this.stopRecord()
//       }
//     }
//     // 8. 
//     pushBlobData(event) {
//       if(!event.data || event.data.size < 1) return // 데이터가 없을 경우 return
//       this.blobs.push(event.data) // 데이터가 있으면 blobs에 push
//     }
//     // 6.
//     startRecord() {
//       let type = { mimeType: 'video/webm;codecs=vp9' }
//       this.blobs = []
//       if(!MediaRecorder.isTypeSupported(type.mimeType)) {
//         // 윈도우 객체에서 이 타입을 지원하는지 여부를 체크하고, 지원하지 않으면 mimeType을 일반타입으로 변경
//         type = { mimeType: 'video/webm'}
//       }

//       this.recorder = new MediaRecorder(window.stream, type)
//       this.btnRecord.textContent = `중지`
//       this.btnPlay.setAttribute('disabled', true)
//       this.btnDownload.setAttribute('disabled', true)
//       this.recorder.ondataavailable = this.pushBlobData.bind(this) 
//       // 녹화한 데이터를 다운로드 할 수 있게 함
//       // 녹화 버튼을 눌러서 녹화가 시작되면 ondataavailable 프로퍼티가 활성화 되고
//       // ondataavailable가 활성화 되면 이 데이터를 blob 데이터로 인식하게 되어
//       // blobs에 데이터를 추가할 수 있게 됨 -> 다운로드가 가능해짐 
//       this.recorder.start(20) // 20초정도 녹화 
//     }
//     // 7.
//     stopRecord() {
//       this.recorder.stop()
//       this.recordVideo.setAttribute('controls', true)
//     }
//     // 9.
//     play() {
//       this.recordVideo.src = window.URL.createObjectURL(
//         new Blob(this.blobs, { type: 'video/webm' })
//       )
//     }
//     // 10.
//     download() {
//       const videoFile = new Blob(this.blobs, { type: 'video/webm' }) // Blobs로 생성된 파일
//       const url = window.URL.createObjectURL(videoFile) // 파일을 url로 변경
//       const downloader= document.createElement('a') // 다운로드를 위한 링크를 생성하기 위한 태그
//       downloader.style.display = 'none' // 안보이게
//       downloader.setAttribute('href', url) // url 링크 걸어주고
//       downloader.setAttribute('download', 'test_video.webm') // 다운로드 할 때 파일 명을 설정
//       this.container.appendChild(downloader) // 섹션 안에 보이지 않은 a링크가 추가되게 됨 
//       downloader.click() // 바로 클릭되도록 

//       setTimeout(() => {  
//         this.container.removeChild(downloader) // 다운로드 후 데이터가 남아있지 않도록 a링크 없애주고
//         window.URL.revokeObjectURL(url) // 다운로드를 위한 url도 취소 시켜줌 
//       }, 100)
//     }
//   }

//   new WebRTC()
// })()


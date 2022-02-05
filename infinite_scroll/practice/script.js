;(function () {
  'use strict'

  /** 로직 분석 
   * 1. 처음 화면을 띄우면 10개의 컨텐츠가 로드되어 보여진다 (fetch API를 사용해 가져온다)
   * 2. 스크롤을 하면 추가로 컨텐츠가 10개씩 로드 된다
   * 3. 모든 컨텐츠가 로드되면 스크롤 이벤트를 없애준다.
   * 4. 무한스크롤은 페이지네이션을 응용해 구현할 수 있다
   */

  const get = (target) => {
    return document.querySelector(target)
  }

  const $posts = get('.posts')
  const limit = 10
  const end = 100
  let page = 1
  let total = 10
  const $loader = get('.loader')

  const getPost = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    const response = await fetch(API_URL)
    if(!response.ok){
      throw new Error('에러가 발생하였습니다.')
    }
    return await response.json()
  }

  const showPosts = (posts) => {
    posts.forEach(post => {
      const $post = document.createElement('div')
      $post.classList.add('post')
      $post.innerHTML = `
        <div class="header">
          <div class="id">${post.id}</div>
          <div class="title">${post.title}</div>
        </div>
        <div class="body">${post.body}</div>
      `
      $posts.appendChild($post)
    });
  }

  const showLoader = () => {
    $loader.classList.add('show')
  }

  const hideLoader = () => {
    $loader.classList.remove('show')
  }

  const loadPost = async () => {
    showLoader()
    try {
      const response = await getPost()
      showPosts(response)
    } catch(e){
      console.error(e)
    } finally {
      hideLoader()
    }
  }

  const onscroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if( scrollTop + clientHeight >= scrollHeight - 5 ) {
      if( total === end ) {
        window.removeEventListener('scroll', onscroll)
        return
      }
      
      page++
      total += 10
      loadPost()
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadPost() // 모든 DOM문서의 로드가 완료되면 loadPost()를 실행해 컨텐츠를 가져온다.
    window.addEventListener('scroll', onscroll)
  })
  
})()



// ;(function () {
//   'use strict'

//   /** 로직 분석 
//    * 1. 처음 화면을 띄우면 10개의 컨텐츠가 로드되어 보여진다
//    * 2. 스크롤을 하면 추가로 컨텐츠가 10개씩 로드 된다
//    * 3. 모든 컨텐츠가 로드되면 스크롤 이벤트를 없애준다.
//    * 4. 무한스크롤은 페이지네이션을 응용해 구현할 수 있다
//    */

//   const get = (target) => {
//     return document.querySelector(target)
//   }
//   let page = 1 // 로드 할 때 마다 변경될 페이지 변수
//   const limit = 10
//   const $posts = get('.posts')
//   const end = 100 // 데이터의 총 갯수
//   let total = 10 // 현재까지 불러온 데이터의 총 갯수

//   const $loader = get('.loader')

//   const getPost = async () => {
//     const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
//     const response = await fetch(API_URL)
//     if(!response.ok) {
//       throw new Error('에러가 발생하였습니다.')
//     }
//     return await response.json()
//   }

//   const showPosts = (posts) => {
//     posts.forEach(post => {
//       const $post = document.createElement('div')
//       $post.classList.add('post')
//       $post.innerHTML = `
//         <div class="header">
//           <div class="id">${post.id}</div>
//           <div class="title">${post.title}</div>
//         </div>
//         <div class="body">${post.body}</div>
//       `
//       $posts.appendChild($post)
//     });
//   }
  
//   const showLoader = () => {
//     $loader.classList.add('show')
//   }

//   const hideLoader = () => {
//     $loader.classList.remove('show')
//   }

//   const loadPost = async () => {
//     showLoader()
//     // loading element를 보여줌 (페이지 로드할 때 ... 으로 보여짐)
//     try {
//       const response = await getPost() // patch API를 사용해서 내용을 가져옴
//       showPosts(response)
//       } catch(e) { 
//         console.error(e) 
//       } finally {
//         // loading element를 사라지게 함
//         hideLoader()
//       }
//   }

//   const onscroll = () => {
//     const { scrollTop, scrollHeight, clientHeight } = document.documentElement
//     if(scrollTop + clientHeight >= scrollHeight - 5) {
//       // 스크롤 위치 + 현재 보여지는 영역의 길이가 전체 컨텐츠 길이보다 크거나 같으면 데이터를 불러옴
//       // -5는 왜? bottom에서 5픽셀정도 떨어졌을 때 컨텐츠를 불러오도록 (-100은 bottom에서 100픽셀 위에서 컨텐츠를 불러오게 함)
//       // 무한스크롤과 함께 볼 것 
//       if(total === end) {
//         // 전체 컨텐츠가 모두 로드되었으면 스크롤 이벤트를 없애고 onscroll()을 빠져나가게 함
//         window.removeEventListener('scroll', onscroll)
//         return
//       }
//       // 스크롤 할 때 마다 페이지를 +1 새로운 페이지와 컨텐츠를 불러옴 => 현재까지 로드 된 컨텐츠 수 +10
//       page++
//       total += 10
//       loadPost()
//     }
//   }

//   window.addEventListener('DOMContentLoaded', () => {
//     loadPost()
//     window.addEventListener('scroll', onscroll)
//   })
// })()


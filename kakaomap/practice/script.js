;(function () {
  'use strict'
  // kakao map API를 사용한 지도 구현

  const shops = [
    {
      id: 1292273001,
      name: '매콤돈가스&칡불냉면 판교점',
      lat: 37.40189834738935,
      lng: 127.10624455094185,
    },
    {
      id: 1151112822,
      name: '탄탄면공방 판교테크노밸리점',
      lat: 37.40193038525563,
      lng: 127.11060980539878,
    },
    {
      id: 15775065,
      name: '파리바게뜨 판교테크노점',
      lat: 37.40133360873933,
      lng: 127.10801128231743,
    },
  ]

  const defaultPos = {
    lat: 37.4020589,
    lng: 127.1064401,
  }

  const get = (target) => {
    return document.querySelector(target)
  }

  const $mapContainer = get('#map')
  const $geolocationButton = get('.geolocation_button')
  const map = new kakao.maps.Map($mapContainer, {
    center: new kakao.maps.LatLng(defaultPos.lat, defaultPos.lng),
    level: 3
  }) // defaultPos의 좌표를 이용해 지도 로드

  const createMarketImage = () => {
    const markerImageSrc = `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png`
    const imageSize = new kakao.maps.Size(30, 46)
    return new kakao.maps.MarkerImage(markerImageSrc, imageSize)
  }

  const createMarker = (lat, lng) => {
    const marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(lat, lng),
      image: createMarketImage()
    })
    return marker
  }

  const createShopMarker = () => {
    shops.map((shop) => {
      const { lat, lng } = shop
      const marker = createMarker(lat, lng)
      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 2px;">
                  <a href="https://place.map.kakao.com/${shop.id}" target="_blank">${shop.name}</a>
                  </div>`,
      })
      infoWindow.open(map, marker)
    })
  }

  const successGeolocation = (position) => {
    const { lat, lng } = position.coords
    map.setCenter(new kakao.maps.LatLng(lat, lng))
    const marker = createMarker(lat, lng)
    marker.setMap(map)
  }

  const errorGeolocation = (error) => {
    if(error.code === 1) {
      alert('접근 권한을 허용해주세요.')
    } else if(error.code === 2) {
      alert('사용할 수 없는 위치입니다.')
    } else if(error.code === 3) {
      alert('타임아웃이 발생헀습니다.')
    } else {
      alert('오류가 발생했습니다.')
    }
  }

  const getLocation = () => {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        successGeolocation,
        errorGeolocation
      )
    }
  }  

 
  const init = () => {
    $geolocationButton.addEventListener('click', () => {
      getLocation()
    })
    createShopMarker()
  }
  init()


  // const $map = get('#map') // map을 담을 영역 가져옴
  // const $geolocationButton = get('.geolocation_button') // 현위치 조회하기 버튼 
  // const mapContainer = new kakao.maps.Map($map, {
  //   center: new kakao.maps.LatLng(defaultPos.lat, defaultPos.lng), // 지도의 가운데가 될 좌표
  //   level: 3 // 지도의 확대/축소 기본값:3
  // }) // api를 이용해서 맵 가져오기 
  //   // new kakao.maps.Map(맵 영역, 옵션값)


  // // 마커 이미지 생성
  // const createMarkerImage = () => {
  //   const markerImageSrc = `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png`
  //   const imageSize = new kakao.maps.Size(30, 46)
  //   return new kakao.maps.MarkerImage(markerImageSrc, imageSize)
  // }

  // // 마커 생성 
  // const createMarker = (lat, lng) => {
  //   const marker = new kakao.maps.Marker({
  //     map: mapContainer,
  //     position: new kakao.maps.LatLng(lat, lng),
  //     image: createMarkerImage(),
  //   })

  //   return marker
  // }

  // const createShopElement = () => {
  //   // shops 에 있는 좌표 받아와서 해당하는 좌표 위에 마커 추가
  //   shops.map((shop) => {
  //     const { lat, lng } = shop
  //     const marker = createMarker(lat, lng)
  //     // 마커에 인포윈도우 추가하기
  //     const infoWindow = new kakao.maps.InfoWindow({
  //       content: `<div style="width:150px;text-align:center;padding:6px 2px;">
  //                 <a href="https://place.map.kakao.com/${shop.id}" target="_blank">${shop.name}</a>
  //                 </div>`,
  //     })
  //     infoWindow.open(mapContainer, marker)
  //   })
  // }

  // // 현재 좌표 가져오기 성공했을 때
  // const successGeolocation = (position) => {
  //   const { latitude, longitude } = position.coords
  //   mapContainer.setCenter(new kakao.maps.LatLng(latitude, longitude)) // 현재 좌표를 센터로 변경
  //   const marker = createMarker(latitude, longitude) // 현재 좌표에 마커 생성
  //   marker.setMap(mapContainer) // 마커 붙이기 
  // }

  // // 현재 좌표 가져오기 실패했을 때 (Geolocation 문서에 있는 에러코드를 사용)
  // const errorGeolocation = (error) => {
  //   if(error.code === 1) {
  //     alert('위치 정보를 허용해주세요.')
  //   } else if(error.code === 2) {
  //     alert('사용할 수 없는 위치입니다')
  //   } else if(error.code === 3) {
  //     alert('타임아웃이 발생했습니다.')
  //   } else {
  //     alert('오류가 발생했습니다.')
  //   }
  // }
  // // 현재 위치 가져오기 (Geolocation api사용)
  // const getLocation = () => {
  //   if('geolocation' in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //         successGeolocation, // 현재 좌표 가져오기를 성공
  //         errorGeolocation // 현재 좌표 가져오기 실패 
  //       )
  //   } else {
  //     alert('지도 API 사용 불가')
  //   }
  // }

})()

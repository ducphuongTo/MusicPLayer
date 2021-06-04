
const wrapper = document.querySelector(".wrapper"),

musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn= wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close")




let musicIndex = Math.floor((Math.random() * allMusic.length) + 1)

window.addEventListener("load",()=>{
    loadMusic(musicIndex) // gọi hàm load music khi mở window
    playingNow()    
})
//load music function

function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb-1].name
    musicArtist.innerText = allMusic[indexNumb-1].artist
    musicImg.src = `assets/image/${allMusic[indexNumb-1].img}.jpg`
    mainAudio.src = `assets/songs/${allMusic[indexNumb-1].src}.mp3`
}


// play music function
function playMusic(){
    wrapper.classList.add("paused")
    playPauseBtn.querySelector("i").innerText = "pause"
    mainAudio.play()
}
// pause music
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow"
    mainAudio.pause();
}

// chuyển bài

function nextMusic(){
    // tăng increment of index lên 1
    musicIndex++
    // nếu musicIndex lớn hơn độ dài của array thì musicindex bằng 1 là quay lại bài đầu  tiên
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
}

// bài trước đó
function prevMusic(){
    // giảm increment of index lên 1
    musicIndex--
    // nếu musicIndex nhỏ hơn 1 thì musicIndex sẽ la độ dài của songs và nhảy tới bài cuối cùng
    musicIndex < 1 ? musicIndex = allMusic.length:musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow
}

//play or music button event
playPauseBtn.addEventListener("click",()=>{
    const isMusicPlay = wrapper.classList.contains("paused")
    // nếu đúng thì gọi pauseMusic kh thif gọi playMusic
    isMusicPlay ? pauseMusic() : playMusic();
    playingNow()
})

// next music btn event
nextBtn.addEventListener("click",()=>{
    nextMusic() // gọi hàm sang bài tiếp theo
})

//prev music btn evnt

prevBtn.addEventListener("click",()=>{
    prevMusic() // gọi hàm sang bài tiếp theo
})

// thanh progress bar chạy 
// phải bắt dc currenTime và duration
mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime // lấy giá trị hiện tại đang chạy trên thanh progress
    const duration = e.target.duration // thời lượng bài
    let progressWidth = (currentTime/duration)*100

    progressBar.style.width = `${progressWidth}%`
    let musicCurrentTime =  wrapper.querySelector(".current-time"),
        musicDuration =  wrapper.querySelector(".max-duration")
    mainAudio.addEventListener("loadeddata",()=>{
        



         //update song total duration
        
         let audioDuration  = mainAudio.duration
         let totalMin = Math.floor(audioDuration/60)
         let totalSec = Math.floor(audioDuration%60)
         if(totalSec < 10) // adding 0 if sec is lessthan 10
         {
             totalSec = `0${totalSec}`
         }
         musicDuration.innerText = `${totalMin}:${totalSec}`

         
         // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //if sec is less than 10 then add 0 before it
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;


    })
})  

progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth //gettiing width of progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration // getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic()
})

// repeat after click pause

const repeatBtn = wrapper.querySelector('#repeat-plist')
repeatBtn.addEventListener("click",()=>{
    //get innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText //getting innertext of icon
    switch(getText){
        case"repeat":
            repeatBtn.innerText = "repeat_one"
            repeatBtn.setAttribute("title","Song looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle"
            repeatBtn.setAttribute("title","Playback shuffle")
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute("title","Playlist looped")
            break;
    }
})

mainAudio.addEventListener("ended",()=>{
    let getText = repeatBtn.innerText
    switch(getText){
        case"repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0
            loadMusic(musicIndex)
            playMusic()
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random()*allMusic.length)+1)
            do{
                randIndex = Math.floor((Math.random()*allMusic.length)+1)
            }while(musicIndex == randIndex)
            musicIndex = randIndex
            loadMusic(musicIndex)
            playMusic()
            playingNow()
            break;
    }
})

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show")
})

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click()
})

const ulTag = wrapper.querySelector("ul")

//tạo danh sách bài hát

for(let i = 0 ;i<allMusic.length;i++){
    //pass songs details
    let liTag = `<li li-index="${i+1}">
                <div class="row">
                    <span>
                        ${allMusic[i].name}
                    </span>
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio  class="${allMusic[i].src}"  src="assets/songs/${allMusic[i].src}.mp3"></audio>
                <span id="${allMusic[i].src}" class="audio-duration"></span>
    
    </li>`
    ulTag.insertAdjacentHTML("beforeend",liTag)

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`) //select span tag which show audio total duration
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`) //select audio tag which have audio source

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration  = liAudioTag.duration
        let totalMin = Math.floor(audioDuration/60)
        let totalSec = Math.floor(audioDuration%60)
        if(totalSec < 10) // adding 0 if sec is lessthan 10
        {
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`
        //adding t duration atrribute which we'll use in playlist
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`)
    })
}

// play bài hát mà mình chọn


const allLiTag = ulTag.querySelectorAll("li")
function playingNow(){
    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");
        
        if(allLiTag[j].classList.contains("playing")){
          allLiTag[j].classList.remove("playing");
          let adDuration = audioTag.getAttribute("t-duration");
          audioTag.innerText = adDuration;
        }
        //if the li tag index is equal to the musicIndex then add playing class in it
        if(allLiTag[j].getAttribute("li-index") == musicIndex){
          allLiTag[j].classList.add("playing");
          audioTag.innerText = "Playing";
        }
        allLiTag[j].setAttribute("onclick", "clicked(this)");
      }
}

//play song on click
function clicked(element){
    let getLiIndex = element.getAttribute("li-index") //get index of particular click

    musicIndex = getLiIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()

}
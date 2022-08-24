const wrapper = document.querySelector(".wrapper"),
musicImg = document.querySelector(".img-area img"),
musicName = document.querySelector(".song-details .name"),
musicArtist = document.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

//load random music on page refersh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex); //calling loadMusic function once window is loaded
    playingNow();
});

function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb-1].name;
    musicArtist.innerText = allMusic[indexNumb-1].artist;
    musicImg.src = `images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb-1].src}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//play or pause music by spacebar
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        if(wrapper.classList.contains("paused")){
            pauseMusic();
        }
        else{
            playMusic();
        }
    }
}

//next music function
function nextMusic(){
    //here we'll just increment the index by 1
    musicIndex++;
    //if musicIndex > array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//previous music function
function prevMusic(){
    //here we'll just decrement the index by 1
    musicIndex--;
    //if musicIndex < 1 then musicIndex will be array length so the previous song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//next or previous song by arrow keys
document.body.onkeydown = function(e){
    if((e.keyCode == 37) && (mainAudio.currentTime > 05)){
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
    }
    else if((e.keyCode == 37) && (mainAudio.currentTime <= 05)){
        prevMusic();
    }
    else if((e.keyCode == 39)){
        nextMusic();
    }
}

//play or pause music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
});

prevBtn.addEventListener("click", () => {
    if((mainAudio.currentTime > 05)){
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
    }
    else{
        prevMusic();
    }
});

//update progress bar width according to the music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
    
    mainAudio.addEventListener("loadeddata", () => {
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//seeking song 
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth; //getting width of progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting total song duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText; //getting innerText of icon

    switch(getText){
        case "repeat": //if icon is repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.title = "song on repeat";
            break;
        case "repeat_one": //if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.title = "playlist on shuffle";
            break;
        case "shuffle": //if icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.title = "playlist on repeat";
            break;
    }
});

//above we just changed the icons, now let's work on what to do after the song ends

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText; //getting innerText of icon
    
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one": //if icon is repeat_one then change the current playing song current time to 0 so song will play from beginning
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": //if icon is shuffle then change it to repeat
            //generate random index between max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }
            while(musicIndex == randIndex); //this loop runs until the next random number won't be the same of current music index
            musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }    
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//create li according to the array length
for(let i = 0; i < allMusic.length; i++)
{
    //pass the song name, artist from array to li
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <sapn>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }

        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //adding t-duration attribute which we'll use below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//playing particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //remove playing class from all other li except the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            //let's get that audio duration value and pass to .audio-duration innerText
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        //if there is an li tag whose li-index = musicIndex
        //then this music will play and we'll style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerHTML = "<p style='color: #ff74a4;'>Playing</p>";
        }

        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

//play song on li click
function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing that liIndex to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
    showMoreBtn.click();
}
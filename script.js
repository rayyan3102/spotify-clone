console.log("lets write some script")
let currentSong = new Audio()
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    // track is now the full path: songs/<folder>/<filename>
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track.split('/').pop());
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function GetSongs(playlist) {
    currFolder = playlist.folder;
    songs = playlist.songs.map(song => `songs/${playlist.folder}/${song.file}`);
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of playlist.songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">${song.title}</div>
            <div>Rayyan</div>
            <div class="playnow flex">
                <span>Play now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div></li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, i) => {
        e.addEventListener("click", () => {
            playMusic(`songs/${playlist.folder}/${playlist.songs[i].file}`);
        });
    });
    return songs;
}

async function displayAlbums() {
    let a = await fetch("playlists.json");
    let data = await a.json();
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
    data.playlists.forEach((playlist, idx) => {
        cardContainer.innerHTML += `<div data-idx="${idx}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60">
                    <circle cx="12" cy="12" r="10" fill="#1fdf64" />
                    <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
                </svg>
            </div>
            <img src="${playlist.cover}" alt="">
            <h1>${playlist.title}</h1>
            <p>${playlist.description}</p>
        </div>`;
    });
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let idx = parseInt(item.currentTarget.dataset.idx);
            let playlist = data.playlists[idx];
            await GetSongs(playlist);
            playMusic(playlist.songs[0].file);
        });
    });
}

async function main() {
    let a = await fetch("playlists.json");
    let data = await a.json();
    await GetSongs(data.playlists[0]);
    playMusic(data.playlists[0].songs[0].file, true);
    displayAlbums()

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
     let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 
     document.querySelector(".circle").style.left = percent + "%"
     currentSong.currentTime = (currentSong.duration) * percent/100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
        
    })

    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
        
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        
        currentSong.volume = parseInt(e.target.value)/100
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        }
    })




}

main()

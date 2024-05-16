
let currenSong = new Audio();//global variable
let songs;
let timer; // Variable to store the timer ID
let currentFolder;


async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        <img src="./assets/images/music.svg" alt="Music">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Haider</div>
        </div>
        <div class="playNow">
        <span>Play Now</span>
            <img src="./assets/images/play.svg" alt="Play">
        </div>
    </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            //trim() is used to remove spaces form the song name their 
        });

    })

    return songs;
}//getSongs

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/assets/songs/" + track)
    currenSong.src = `/${currentFolder}/` + track;
    if (!pause) {
        currenSong.play();
        play.src = "./assets/images/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = track.replaceAll("%20", " ")
    document.querySelector(".songTime").innerHTML = "00 : 00 / 00 : 00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/assets/songs/`);
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(response);
    
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors)     
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0];
            let cardContainer = document.querySelector(".cardContainer")
            console.log(folder);
            let a = await fetch(`http://127.0.0.1:5500/assets/songs/${folder}/info.json`);
            let response = await a.json()
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="circle-container">
                <!-- Replace this with your SVG code -->
                <svg class="play" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7z" />
                </svg>

            </div>
            <img src = "assets/songs/${folder}/cover.jpeg" alt="Cover">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`;
            
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`assets/songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })

    
}


function convertSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Round down to ensure integer value
    
    // Add leading zeros if necessary
    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds with a colon
    const formattedTime = `${minutesString}:${secondsString}`;

    return formattedTime;
}









function hideSeekbar() {
    timer = setTimeout(() => {
        document.querySelector(".range").style.opacity = '0'; // Hide seek bar
    }, 3000); // 5 seconds timeout
}



async function main() {
    displayAlbums();   
    await getSongs("assets/songs/aur");
    playMusic(songs[0], true)
    

    //Id id directly accessed
    play.addEventListener("click", () => {
        if (currenSong.paused) {
            currenSong.play();
            play.src = "./assets/images/pause.svg"
        }
        else {
            currenSong.pause();
            play.src = "./assets/images/play1.svg"
        }
    })

    currenSong.addEventListener("timeupdate", () => {
        let timeT = convertSecondsToMinutesAndSeconds(currenSong.currentTime);
        let durationT = convertSecondsToMinutesAndSeconds(currenSong.duration);
        document.querySelector(".songTime").innerHTML = `${timeT} / ${durationT}`
        document.querySelector(".circle").style.left = ((currenSong.currentTime) / (currenSong.duration)) * 100 + "%"
        // Attach event listeners for seek bar interaction
        
    });
    //-------------------------------------------------------------------------------------------------------- 
   
    
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;     
        document.querySelector(".circle").style.left = percent + "%";
        currenSong.currentTime = (currenSong.duration * percent) / 100

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    previous.addEventListener("click", () => {
        console.log("Play Previoius");
        let index = songs.indexOf(currenSong.src.split("/").slice(-1)[0]);
        if (index - 1 > 0) {
            playMusic(songs[index - 1]);
        }
    })
    next.addEventListener("click", () => {
        console.log("Play Next");
        let index = songs.indexOf(currenSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    // document.querySelector(".volume_bar").addEventListener("click", () => {
    //     document.querySelector(".range").style.opacity = 1;

    // })




    const volumeBtn = document.querySelector(".volume_bar");
    const seekbar = document.querySelector('.range');

    // Function to hide the seek bar after 5 seconds of inactivity


    // Event listener for the volume button click
    volumeBtn.addEventListener('click', () => {
        seekbar.style.opacity = '1'; // Show seek bar when volume button is clicked
        clearTimeout(timer); // Clear any existing timer
        hideSeekbar(); // Start the timer
    });

    // Event listener to reset the timer when the seek bar is interacted with
    seekbar.addEventListener('input', () => {
        clearTimeout(timer); // Clear any existing timer
        hideSeekbar(); // Start the timer again
    });

    // Initially hide the seek bar
    hideSeekbar();

    //Event listener to chnage range of volume

    document.querySelector(".range").addEventListener("change", (e) => {
        console.log("Setting Volume to : ", e.target.value);
        currenSong.volume = parseInt(e.target.value) / 100;
    })

    























}//main



main();


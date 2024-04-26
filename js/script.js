// a global variable for current songs 
console.log('Lets write JavaScript');
let songs;
let currfolder;
let currentsong = new Audio();





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

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    console.log(a)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(response)
    let as = div.getElementsByTagName("a");
    // console.log(as)
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
        // console.log(songs)
    }
    // for adding songs into playlist tag

    let songUrl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUrl.innerHTML = "";
    console.log(songUrl)
    for (const song of songs) {
        songUrl.innerHTML = songUrl.innerHTML + `<li>
        <img src="images/music.svg" class="invert">
       <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
           <div>Ridham</div>
       </div>
       <div class="playnow">
           <span>Play Now</span>
           <img src="images/play.svg" alt="" class="invert">
       </div></li>`;
    }

    // attach a eventlistenr to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector('.info').firstElementChild.innerHTML);
            playmusic(e.querySelector('.info').firstElementChild.innerHTML.trim())

        })
    })

}

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play();
    }
    play.src = "images/play.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/ 00:00"
}

async function displayAlbums() {
    console.log("displaying alubums")
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".card-container");
    // let folders  = []
    // console.log(anchors);
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
// for computer
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            // get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card margin-1 ">
            <div class="playbtn">
                <img id="playsongbtn" src="images/playsong.svg" alt="">
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2 class="h2">${response.title}</h2>
            <p class="p">${response.description}</p>
        </div>`
        }
    }
    // for website
    //         if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
    //         let folder = e.href.split("/songs/").slice(-1)[0]
    //         console.log(e.href)
    //          console.log(folder)
    //         // get the metadata of the folder
    //         let a = await fetch(`/songs/${folder}/info.json`)
    //         let response = await a.json();
    //         console.log(a)
    //         console.log(response)
    //         cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card margin-1 ">
    //         <div class="playbtn">
    //             <img id="playsongbtn" src="images/playsong.svg" alt="">
    //         </div>
            
    //         <img src="/songs/${folder}/cover.jpeg" alt="">
    //         <h2 class="h2">${response.title}</h2>
    //         <p class="p">${response.description}</p>
    //     </div>`
    //     }

    //  }
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
           await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        

        })
    })

}



async function main() {

    // get the list of all songs
    await getsongs("songs/ncs");
    playmusic(songs[0], true);


    // display all the albums!

    await displayAlbums()
    // attach a eventlistenr to play,next,previous


    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "images/pause.svg";
        }
        else {
            currentsong.pause()
            play.src = "images/play.svg"
        }
    })


    // listen for timeupdate event
    currentsong.addEventListener('timeupdate', () => {
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // add an eventlistner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // /add an event to hamuburg
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // add an eventlistener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let idx = songs.indexOf(currentsong.src.split(`${currfolder}/`).slice(-1)[0])
        if ((idx - 1) >= 0) {
            playmusic(songs[idx - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")
        let idx = songs.indexOf(currentsong.src.split(`${currfolder}/`).slice(-1)[0]);
        if ((idx + 1) < songs.length) {
            playmusic(songs[idx + 1])
        }
        console.log(idx)
    })

    // ADD AN EVENT TO VOLUME
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100");
        currentsong.volume = parseInt(e.target.value) / 100;
    });




    // add event listner to mute 
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        console.log("chaging",e.target.src)
        if(e.target.src.includes( "volume.svg"))
        {
            e.target.src = e.target.src.replace("images/volume.svg","images/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value =  0;
        }
        else{
            e.target.src = e.target.src.replace("images/mute.svg","images/volume.svg")
            currentsong.volume = .20;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })



}




main()
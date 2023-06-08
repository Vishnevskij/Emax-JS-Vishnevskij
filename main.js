window.onload = function () {

}

class App {
  static API_KEY = "c5219520c6msh261d7f2b846450bp1bfa2ajsn6d49425d6756";
  static SEARCH_URL = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";

  static DEFAULT_HEADERS = {
    "X-RapidAPI-Key": App.API_KEY,
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
  };

  static searchButton = document.querySelector("#search-button");
  static input = document.querySelector("input");
  static output = document.querySelector("#search-section");

  static playListSwitcher = document.querySelector("#play-list-button");
  static outputPlayList = document.querySelector("#playList-section");
  static scrollBtn = document.querySelector(".scroll-btn");
  static sortButton = document.querySelector("#sortButton");

  static SECTIONS = {
    main: "main",
    PlayList: "PlayList",
  };

  constructor(data = {}, playList = []) {
    this.data = data;
    this.playList = playList;
    this.currentSection = App.SECTIONS.main;
    
    
    App.searchButton.onclick = () => this.onButtonClick();

    App.playListSwitcher.onclick = () => this.currentSection === App.SECTIONS.main ? this.renderPlayList() : this.renderMainView();
    App.sortButton.onclick = () => this.sortByRating();     
    
    App.scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    
    
  }

  onButtonClick() {
    // combine searching value and DataBase answer
    console.log(App.input.value);
    
    this.getDataBySearch(App.input.value.toLowerCase()).then(() => {
      App.input.value = "";

      const dataToRender = this.data;
      console.log("Data", dataToRender);
      

      this.renderData(dataToRender, App.output);
      
    });
  }



  async getDataBySearch(artist = "") {
    // fetch
    try {
      const response = await fetch(App.SEARCH_URL + artist, {
        headers: App.DEFAULT_HEADERS,
      });
      const data = await response.json();
      this.data = data ? data : [];
    } catch (e) {
      console.log(e, "error");
      alert("Query is invalid");
    }
  }

  

  sortByRating() {             // sorting tracks by rank up and down adding a flag "+" or "-"
    if (this.currentSection === App.SECTIONS.main) {
      if (!this.data.sortedByRating || this.data.sortedByRating === "+") {
        
        let sortedData = this.data.data.sort((a, b) => a.rank - b.rank);
        this.data.sortedByRating = "-";
        this.renderData({ data: sortedData }, App.output);
      } else {
        
        let sortedData = this.data.data.sort((a, b) => b.rank - a.rank);
        this.data.sortedByRating = "+";
        this.renderData({ data: sortedData }, App.output);
      }
    }
  
    if (this.currentSection === App.SECTIONS.PlayList) {
      if (!this.data.sortedByRating || this.data.sortedByRating === "+") {
        
        let sortedPlaylist = this.getPlayListData().sort((a, b) => a.rank - b.rank);
        this.data.sortedByRating = "-";
        this.renderData({ data: sortedPlaylist }, App.outputPlayList, true);
      } else {
        
        let sortedPlaylist = this.getPlayListData().sort((a, b) => b.rank - a.rank);
        this.data.sortedByRating = "+";
        this.renderData({ data: sortedPlaylist }, App.outputPlayList, true);
      }
    }
  }

  renderData(dataToRender, outputElement = App.output, isInPlayList = false) {     // renderData on the page

    outputElement.innerHTML = "";

    const songs = dataToRender.data || this.getPlayListData();

    songs.forEach((song, i) => {
      function convertTime(seconds) {         // convert duration of the track to normal view

        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        return minutes + ":" + remainingSeconds;
      }

      let newRank = Math.floor(song.rank / 1000) / 100;
      let seconds = song.duration;
      let result = convertTime(seconds);

      const isTrackAddedToPlayList = this.checkIfPlaylistContainsTrack(song.id);
      
// drawing a SongCard
      
      outputElement.innerHTML += `<div id="${song.id}" class="track-elem ${newRank}">        
    <img src ="${song.album.cover_medium}" class = "image"></img>
    <span id="click-to-play">Click To Play</span>
    <span id="artist">${song.artist.name}</span>
    <span id="title">${song.title}</span>
    <span id="duration">Duration: ${result}</span>

    <span id="rank">Rank is: <b>${newRank} &#11088;</b></span>

    <button id="btn-${song.id}" class="playList-button">${
      isTrackAddedToPlayList ? "DeleteFromPlayList" : "AddToPlayList"
    }</button>
    <audio src="${song.preview}" controls" class="audio-element"></audio>
    
   
    </div>`;


    const imagesOfTracks = [...document.querySelectorAll(".image")];
    
    const audioElements = [...document.querySelectorAll(".audio-element")];

      let currentTrackIndex = -1;

      imagesOfTracks.forEach((element, index) => {             // onClick on any SongCard image the song would play
        element.addEventListener("click", () => {

          if (currentTrackIndex !== -1) {
            audioElements[currentTrackIndex].pause();
          }

          if (currentTrackIndex !== index) {                       // code, which prevents playing few tracks at the same moment
            audioElements[index].play();
            currentTrackIndex = index;
          } else {
            currentTrackIndex = -1;
          }
        });
      });
    });

    const playListButtons = this.currentSection === App.SECTIONS.main
    ? App.output.querySelectorAll(".playList-button")
    : App.outputPlayList.querySelectorAll(".playList-button");
    
    
   
    [...playListButtons].forEach((button, index) => {
      button.onclick = () => {
        
        const currentTrack = songs[index];
        

        if (this.checkIfPlaylistContainsTrack(currentTrack.id))
        {
          this.removePlayListData(currentTrack.id);
      

        isInPlayList &&
        this.renderData(this.getPlayListData, App.outputPlayList, true);

        button.textContent = "Add to PlayList";

        const buttonFromMain = App.output.querySelector(`#btn-${btn.id}`);
          const buttonFromWatchList = App.watchListOutput.querySelector(
            `#btn-${btn.id}`);

            if (buttonFromMain) buttonFromMain.textContent = "Add to PlayList";
            if (buttonFromWatchList) buttonFromWatchList.textContent = "Add to PlayList";

          } else {
            this.addPlayListData(currentTrack);
            button.textContent = "Delete from PlayList";

            const buttonFromMain = App.output.querySelector(`#btn-${btn.id}`);
          const buttonFromWatchList = App.watchListOutput.querySelector(
            `#btn-${btn.id}`);

            if (buttonFromMain) buttonFromMain.textContent = "Delete from PlayList";
            if (buttonFromWatchList) buttonFromWatchList.textContent = "Delete from PlayList to PlayList";


          }
      };
    });

    App.scrollBtn.style.visibility = "visible";   // scrollToTop button appears only if SongCards are rendered
   
    };
  

  getPlayListData() {
    
    return JSON.parse(localStorage.getItem("PlayList") || "[]");
    
  }

  addPlayListData(track) {
    const oldPlayList = this.getPlayListData();
    localStorage.setItem("PlayList", JSON.stringify([...oldPlayList, track]));
  }

  removePlayListData(id) {
    let LocalStoragePlayList = this.getPlayListData();
    console.log(LocalStoragePlayList, "playlist");
    localStorage.setItem(
      "PlayList",
      JSON.stringify([...LocalStoragePlayList].filter((song) => song.id !== id))
    );
  }

  checkIfPlaylistContainsTrack(id) {
    return this.getPlayListData().find((song) => song.id === id)
      ? true
      : false;
  }

  renderPlayList() {
    App.output.style.display = "none";
    App.outputPlayList.style.display = "flex";
    App.playListSwitcher.textContent = "Go to main page";

    this.currentSection = App.SECTIONS.PlayList;

    const playListData = this.getPlayListData();

    this.renderData(playListData, App.outputPlayList, true);
  }

  renderMainView() {
    App.output.style.display = "flex";
    App.outputPlayList.style.display = "none";
    

    App.playListSwitcher.textContent = "Go to Play List";

    this.currentSection = App.SECTIONS.main;
  }


}

new App();

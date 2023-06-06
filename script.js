const start = document.getElementById("start");
const displayResult = document.getElementById("displayResult");

const form = document.getElementById("form");
const music = document.getElementById("music");

const musicNav = document.getElementById("musicNav");
const formNav = document.getElementById("formNav");

const total = document.getElementById("total");
const result = document.getElementById("result");

const pageMusic = document.getElementById("pageMusic");

const nofound = document.getElementById("nofound");

const lyrics = document.getElementById("lyrics");
const contentLyrics = document.getElementById("contentLyrics");
const displaydetail = document.getElementById("displaydetail");

const linkToTop = document.getElementById("linkToTop");
const effect = document.getElementById("effect");

const Nav = document.getElementById("Nav");

document.addEventListener("scroll", searchNav);

let valueforfind;
let valueforfindNav;
let TIME;

function searchNav() {
  const scrollvalue = window.pageYOffset;
  const searchON = start.offsetHeight;
  if (scrollvalue > searchON) {
    Nav.classList.remove("fade");
  } else {
    Nav.classList.add("fade");
  }
}

function caltime() {
  effect.classList.add("none");
  clearInterval(TIME);
}

function nodata() {
  nofound.classList.remove("none");
}

async function loadMusic() {
  valueforfindNav = false;
  valueforfind = music.value;
  music.value = "";
  let data = await fetch(`https://api.lyrics.ovh/suggest/${valueforfind}`);
  forJson(data);
}

function displayFindorNav(data) {
  if (valueforfind) {
    total.innerHTML = `The search results for the term ${valueforfind} yield a total of ${data.total} items.`;
  } else {
    total.innerHTML = `The search results for the term ${valueforfindNav} yield a total of ${data.total} items.`;
  }
}

function displayMusic(data) {
  displaydetail.classList.add("none");
  if (data.total) {
    formNav.classList.remove("none");
    nofound.classList.add("none");
    start.style.height = "60vh";
    displayResult.classList.remove("none");
    displayFindorNav(data);
    result.innerHTML = "";
    data.data.forEach((element) => {
      const preview = element.preview;
      const album = element.album.title;
      const img = element.album.cover;
      Name = element.title;
      artist = element.artist.name;
      result.innerHTML += `<li><h2>${Name} - ${artist}</h2><button onclick='readlyrics("${Name}","${artist}"
    ,"${preview}","${album}","${img}")'><h2>Further details</h2></botton></li>`;
    });
    page(data);
  } else {
    displayResult.classList.add("none");
    start.style.height = "100vh";
    nodata();
  }
}

function readlyrics(songName, Artist, preview, album, img) {
  formNav.classList.add("none");
  contentLyrics.innerHTML = `
  <div class="BOX">
  <button onclick="BACK()" id="Back">
      <img id="back" src="no.png" alt="">
  </button>
  </div>`;
  displayResult.classList.add("none");
  // let data = await fetch(`https://api.lyrics.ovh/v1/${Artist}/${songName}`);
  // data = await data.json();
  start.style.height = "60vh";
  if (img) {
    lyrics.style.backgroundImage = `url('${img}')`;
    contentLyrics.innerHTML += `<div><img src="${img}"></div>`;
  }
  contentLyrics.innerHTML += `
  <video src="${preview}" controls class='none' autoplay loop></video>
  <div class='detail'>
    <div><strong>${songName}</strong> - ${Artist}</div>
  </div>
  <div class='album'>${album}</div>
  <div class='error'>
  I apologize, but we do not have the lyrics for that particular song. I apologize for any inconvenience.
  </div>`;
  // if (data.error) {
  //   contentLyrics.innerHTML += `<div class='error'>I apologize, but we do not have the lyrics for that particular song. I apologize for any inconvenience.</div>`;
  // } else {
  //   lyrics.classList.remove("none");
  //   data = data.lyrics.trim().replace(/(\n|\r\n|\r|\n\r|\t)/g, "<br>");
  //   contentLyrics.innerHTML += `<div class='error'>${data}</div>`;}
  displaydetail.classList.remove("none");
}

function page(data) {
  result.innerHTML += `<li>
    ${
      data.prev
        ? `<button onclick='openpage("${data.prev}")' class='left'><h2><= The previous page</h2></button>`
        : `<button disabled class='notwork'><h2><= The previous page</h2></button>`
    }
    ${
      data.next
        ? `<button onclick='openpage("${data.next}")' class='right'><h2>The next page =></h2></button>`
        : `<button disabled class='notwork'><h2>The next page =></h2></button>`
    }</li>`;
}

async function openpage(linkpage) {
  let data = await fetch(`https://cors-anywhere.herokuapp.com/${linkpage}`);
  forJson(data);
}

async function forJson(data) {
  data = await data.json();
  displayMusic(data);
}

async function BACK(data) {
  if (valueforfind) {
    let data = await fetch(`https://api.lyrics.ovh/suggest/${valueforfind}`);
    forJson(data);
  } else {
    let data = await fetch(`https://api.lyrics.ovh/suggest/${valueforfindNav}`);
    forJson(data);
  }
}

async function loadMusicNav() {
  valueforfind = false;
  valueforfindNav = musicNav.value;
  musicNav.value = "";
  let data = await fetch(`https://api.lyrics.ovh/suggest/${valueforfindNav}`);
  forJson(data);
}

music.focus();

function pagewait() {
  start.style.height = "100vh";
  displayResult.classList.add("none");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  pagewait();
  loadMusic();
});

formNav.addEventListener("submit", (e) => {
  e.preventDefault();
  pagewait();
  loadMusicNav();
});

linkToTop.addEventListener("click", () => {
  effect.classList.remove("none");
  TIME = setInterval(caltime, "2000");
});

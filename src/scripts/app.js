let fun = require('fun');

$(document).ready(() => {
  let singerEl = $('.js-singer');
  let songEl = $('.js-song');
  let oldSong;
  let oldSinger;
  let newSongData = (e) => {
    let data = e.query.results.json;
    if (oldSinger !== data.artist) {
      singerEl.html(data.artist);
      oldSinger = data.artist;
    }
    if (oldSong !== data.title) {
      songEl.html(data.title);
      oldSong = data.title;
    }
  };
  let getArtistAndSong = () => {
    $.getJSON('http://query.yahooapis.com/v1/public/yql', {
      q: 'select * from json where url="http://mjoy.ua/radio/station/urban-space-radio/playlist.json"',
      format: 'json'
    }).done(newSongData);
  };
  getArtistAndSong();
  setInterval(getArtistAndSong, 5000);


  let stream = {
    title: 'ABC Jazz',
    mp3: 'http://stream.mjoy.ua:8000/urban-space-radio',
    m4a: 'http://stream.mjoy.ua:8000/urban-space-radio-aac'
  };
  let ready = false;
  let isMobile = typeof window.orientation !== 'undefined';

  let stopTimer;
  $('#jquery_jplayer_1').jPlayer({
    ready() {
      ready = true;
      $(this).jPlayer('setMedia', stream).jPlayer('play');
    },
    play() {
      stopTimer && clearTimeout(stopTimer);
      $(this).jPlayer('play');
    },
    pause() {
      if (isMobile) {
        $(this).jPlayer('clearMedia');
      } else {
        $(this).jPlayer('pause');
        stopTimer = setTimeout(() => {
          $(this).jPlayer('clearMedia');
        }, 3000);
      }
    },
    error(event) {
      if (ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
        // Setup the media stream again and play it.
        $(this).jPlayer('setMedia', stream).jPlayer('play');
      }
    },
    swfPath: 'http://jplayer.org/latest/dist/jplayer',
    //        if desctop then play m4a and on mobile mp3
    supplied: isMobile ? 'mp3,m4a' : 'm4a,mp3',
    solution: 'html',
    preload: 'none',
    wmode: 'window',
    useStateClassSkin: true,
    autoBlur: false,
    keyEnabled: true
  });

  FastClick.attach(document.body);
  fun();
});

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
    mp3: 'http://stream.mjoy.ua:8000/urban-space-radio',
    m4a: 'http://stream.mjoy.ua:8000/urban-space-radio-aac'
  };
  let ready = false;

  let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  let isMobile = typeof window.orientation !== 'undefined';
  let isDesctopChrome = isChrome && !isMobile;

  $('#jquery_jplayer_1').jPlayer({
    ready() {
      ready = true;
      $(this).jPlayer('setMedia', stream).jPlayer('play');
    },

    pause() {
      $(this).jPlayer('clearMedia');
    },
    error(event) {
      if (ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
        // Setup the media stream again and play it.
        $(this).jPlayer('setMedia', stream).jPlayer('play');
      }
    },
    swfPath: 'http://jplayer.org/latest/dist/jplayer',
    // desctop chrome fast start plays m4a, but mp3 need some long preload.
    // but urban-space-radio-aac stream is not playable on other platforms
    supplied: isDesctopChrome ? 'm4a,mp3' : 'mp3',
    solution: 'html',
    preload: 'none',
    wmode: 'window',
    useStateClassSkin: true,
    autoBlur: false,
    keyEnabled: true
  });

  FastClick.attach(document.body);
  // fun();
});

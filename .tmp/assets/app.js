(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ross/Projects/urban-radio/src/scripts/app.js":[function(require,module,exports){
'use strict';

function dumentReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState !== 'loading') {
        fn();
      }
    });
  }
}

function addEventListener(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, function () {
      handler.call(el);
    });
  }
}

function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

// main
function initPlayer() {
  var player = document.getElementsByClassName('js-player')[0];
  var playBtn = document.getElementsByClassName('js-play-btn')[0];
  var singerEl = document.getElementsByClassName('js-singer')[0];
  var songEl = document.getElementsByClassName('js-song')[0];
  var oldSong = undefined;
  var oldSinger = undefined;

  window.newSongData = function newSongData(data) {
    if (oldSinger !== data[0].artist) {
      singerEl.innerHTML = data[0].artist;
      oldSinger = data[0].artist;
    }

    if (oldSong !== data[0].title) {
      songEl.innerHTML = data[0].title;
      oldSong = data[0].title;
    }
  };

  function createJsTag() {
    var old = window.document.getElementById('js-data-tag');
    old && document.body.removeChild(old);
    var script = document.createElement('script');
    script.src = 'https://jsonp.afeld.me/?callback=newSongData&url=http://mjoy.ua/radio/station/urban-space-radio/playlist.json';
    script.id = 'js-data-tag';
    document.body.appendChild(script);
  }
  createJsTag();
  setInterval(createJsTag, 5000);

  addEventListener(playBtn, 'click', function () {
    if (player.paused) {
      player.play();
      addClass(playBtn, 'state-paying');
    } else {
      player.pause();
      removeClass(playBtn, 'state-paying');
    }
  });
}

dumentReady(initPlayer);

},{}]},{},["/Users/ross/Projects/urban-radio/src/scripts/app.js"]);

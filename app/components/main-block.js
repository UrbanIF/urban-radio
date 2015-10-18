import Ember from 'ember';

export default Ember.Component.extend({

  videoIds: ['mcWH-fanZIM', 'KLI8EESsU2A', 'id2kQ_cATMA'],
  videoIndex: 0,

  didInsertElement() {
    // var $iframe = this.$('.header-video');

    // $iframe[0].mute();
    // iframe.getElementById('vid-player').mute();
    // console.log(iframe.getElementById('vid-player'));

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      event.target.mute();
    }

    window.onYouTubePlayerAPIReady = function() {
      this.player = new YT.Player('header-video', {
        width: 1280,
        height: 720,
        playerVars: {
          'autoplay': 1,
          'controls': 1,
          'autohide': 1,
          'rel': 0,
          'showinfo': 0,
          'wmode': 'opaque'},
        videoId: this.get('videoIds')[this.get('videoIndex')],
        events: {
          'onReady': onPlayerReady}
      });
    }.bind(this);

    // player.loadVideoById(videoId)
  },

  actions: {
    openPlayer() {
      window.open('#/player', 'UrbanRadio', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=550,height=243');
    },
    nextVideo() {
      this.set('videoIndex', (this.get('videoIndex') + 1) % this.get('videoIds').length);
      let id =   this.get('videoIds')[this.get('videoIndex')];
      this.player.loadVideoById(id);
    },
    prevVideo() {
      this.set('videoIndex', (this.get('videoIndex') - 1 + this.get('videoIds').length) % this.get('videoIds').length);
      let id =   this.get('videoIds')[this.get('videoIndex')];
      this.player.loadVideoById(id);
    }
  }

});

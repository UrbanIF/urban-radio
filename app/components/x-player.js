import Ember from 'ember';


export default Ember.Component.extend({
  classNames: ['x-player'],
  classNameBindings: ['isPlaying', 'isMuted'],

  isPlaying: true,
  isMuted: false,

  soundLevelObserver: Ember.observer('soundLevel', function() {
    this.get('audio').volume = this.get('soundLevel');
  }),


  play() {
    this.get('audio').play();
  },
  pause() {
    this.get('audio').pause();
  },
  mute() {
    this.set('cachedVolume', this.get('audio').volume);
    this.set('soundLevel', 0);
    // this.get('audio').volume = 0;
  },
  unmute() {
    this.set('soundLevel', this.get('cachedVolume'));
    // this.get('audio').volume = this.get('cachedVolume');
  },

  didInsertElement() {
    this.set('audio', Ember.$('.audio-el')[0]);
    if (this.get('isPlaying')) {
      this.play();
      this.get('audio').volume = this.get('soundLevel');
    }
  },

  actions: {
    playPause() {
      if (this.get('isPlaying')) {
        this.set('isPlaying', false);
        this.pause();
      } else {
        this.set('isPlaying', true);
        this.play();
      }
    },

    muteUnmute() {
      if (this.get('isMuted')) {
        this.set('isMuted', false);
        this.unmute();
      } else {
        this.set('isMuted', true);
        this.mute();
      }
    }
  }
});

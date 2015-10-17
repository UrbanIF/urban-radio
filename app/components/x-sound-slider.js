import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['x-payer__sound-bar'],

  isDragging: false,

  style: Ember.computed('value', function() {
    let width = 'width: ' + this.get('value') * 100 + '%;';
    return new Ember.Handlebars.SafeString(width);
  }),

  mouseDown(event) {
    let bar = this.$()[0];
    let val = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2));
    this.set('value', val);
    // this.set('style', 'width: ' + val * 100 + '%;');
    this.set('isDragging', true);
    // console.log('down', val);
  },

  mouseMove(event) {
    if (this.get('isDragging')) {
      let bar = this.$()[0];
      let val = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2));
      this.set('value', val);
      // this.set('style', 'width: ' + val * 100 + '%;');
      // console.log('move', val);
    }
  },

  mouseLeave() {
    this.set('isDragging', false);
  },

  mouseUp() {
    this.set('isDragging', false);
  }
});

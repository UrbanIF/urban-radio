import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['announcments', 'clearfix'],

  announcements: [],

  loadAnnouncmentss() {
    this.set('announcements', this.store.find('announcement', {
      limitToLast: 3
    }));
  },

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, 'loadAnnouncmentss');
  }

});

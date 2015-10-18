import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['schedule'],

  calendarEvents: [],

  loadCalendarEvents() {
    this.set('calendarEvents', this.store.find('calendarEvent', {
      limitToLast: 3
    }));
  },

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, 'loadCalendarEvents');
  }

});

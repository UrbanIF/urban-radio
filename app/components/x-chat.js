import Ember from 'ember';

export default Ember.Component.extend({

  messageBody: '',
  messages: '',

  loadMessages() {
    this.set('messages', this.store.find('message', {
      limitToLast: 3
    }));
  },

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, 'loadMessages');
  },

  actions: {
    sendMessage() {
      let message = this.store.createRecord('message', {
        body: this.get('messageBody')
      });
      message.save();

      this.set('messageBody', '');
    }
  }

});

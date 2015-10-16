import Ember from 'ember';

export default Ember.Component.extend({

  messageBody: '',
  messages: '',

  loadMessages() {
    this.set('messages', this.store.findAll('message'));
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

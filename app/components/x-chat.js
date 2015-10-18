import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['x-chat'],

  messageBody: '',
  messages: '',

  loadMessages() {
    this.set('messages', this.store.find('message', {
      limitToLast: 10
    }));
  },

  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', this, 'loadMessages');
  },

  actions: {
    sendMessage() {
      let message = this.store.createRecord('message', {
        userIcon: 'assets/x-chat-user-icon.png',
        userName: 'Іван',
        body: this.get('messageBody')
      });
      message.save();

      this.set('messageBody', '');
    }
  }

});

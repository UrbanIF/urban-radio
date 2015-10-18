import DS from 'ember-data';

export default DS.Model.extend({
  category: DS.attr('string'),
  name: DS.attr('string'),
  date: DS.attr('date'),
  image: DS.attr('string'),

  bgStyle: Ember.computed('image', function() {
    return new Ember.Handlebars.SafeString("background-image: url('" + this.get('image') + "');");
  }),

  formattedDate: Ember.computed('image', function() {
    return moment(this.get('date')).format('D MMMM о h:mm');
  })

});

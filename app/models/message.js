import DS from 'ember-data';

export default DS.Model.extend({
  userIcon: DS.attr('string'),
  userName: DS.attr('string'),
  body: DS.attr('string')
});

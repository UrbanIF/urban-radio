import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('player', {});
  this.route('announcement', {path: '/announcement/:announcement_id'});
});

export default Router;

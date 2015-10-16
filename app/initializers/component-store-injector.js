export function initialize(container, application) {
  application.inject('component', 'store', 'service:store');
}

export default {
  name: 'component-store-injector',
  initialize: initialize
};

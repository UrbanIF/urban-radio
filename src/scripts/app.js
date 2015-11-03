var documentReady = require('lib/document_ready');
var initSocialLogin = require('lib/hello_init');
var DS = require('lib/data_store');
var PopupsManagerVM = require('components/popups_manager/vm');


DS.init();
initSocialLogin();
PopupsManagerVM.initEscListener();
FastClick.attach(document.body);

function initMithril() {
  // m.route.mode = "pathname";

  m.route(document.body, '/', {
    '/': require('pages/index/module'),
    '/popup/:ptype/:pid': require('pages/index/module'),

    '/trips': require('pages/trips/module'),
    '/trips/popup/:ptype/:pid': require('pages/trips/module'),
    '/trips/:filter': require('pages/trips/module'),
    '/trips/:filter/popup/:ptype/:pid': require('pages/trips/module'),

    '/items': require('pages/items/module'),
    '/items/popup/:ptype/:pid': require('pages/items/module'),

    '/user/trips': require('pages/user_trips/module'),
    '/user/trips/popup/:ptype/:pid': require('pages/user_trips/module'),
    '/user/trips/:id': require('pages/user_trip/module'),
    '/user/trips/:id/popup/:ptype/:pid': require('pages/user_trip/module'),
    '/user/profile': require('pages/user_profile/module'),
    '/user/profile/popup/:ptype/:pid': require('pages/user_profile/module')
  });

  PopupsManagerVM.maybeOpenPopup();
}
documentReady(initMithril);

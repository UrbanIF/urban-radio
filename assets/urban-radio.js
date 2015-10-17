"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('urban-radio/adapters/application', ['exports', 'ember', 'emberfire/adapters/firebase'], function (exports, Ember, FirebaseAdapter) {

  'use strict';

  var inject = Ember['default'].inject;

  exports['default'] = FirebaseAdapter['default'].extend({
    firebase: inject.service()
  });

});
define('urban-radio/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'urban-radio/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('urban-radio/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'urban-radio/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('urban-radio/components/main-block', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    videoIds: ['mcWH-fanZIM', 'KLI8EESsU2A', 'id2kQ_cATMA'],
    videoIndex: 0,

    didInsertElement: function didInsertElement() {
      // var $iframe = this.$('.header-video');

      // $iframe[0].mute();
      // iframe.getElementById('vid-player').mute();
      // console.log(iframe.getElementById('vid-player'));

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.mute();
      }

      window.onYouTubePlayerAPIReady = (function () {
        this.player = new YT.Player('header-video', {
          width: 1280,
          height: 720,
          playerVars: {
            'autoplay': 1,
            'controls': 0,
            'autohide': 1,
            'rel': 0,
            'showinfo': 0,
            'wmode': 'opaque' },
          videoId: this.get('videoIds')[this.get('videoIndex')],
          events: {
            'onReady': onPlayerReady }
        });
      }).bind(this);

      // player.loadVideoById(videoId)
    },

    actions: {
      openPlayer: function openPlayer() {
        window.open('/player', 'UrbanRadio', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=550,height=243');
      },
      nextVideo: function nextVideo() {
        this.set('videoIndex', (this.get('videoIndex') + 1) % this.get('videoIds').length);
        var id = this.get('videoIds')[this.get('videoIndex')];
        this.player.loadVideoById(id);
      },
      prevVideo: function prevVideo() {
        this.set('videoIndex', (this.get('videoIndex') - 1 + this.get('videoIds').length) % this.get('videoIds').length);
        var id = this.get('videoIds')[this.get('videoIndex')];
        this.player.loadVideoById(id);
      }
    }

  });

});
define('urban-radio/components/x-chat', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    messageBody: '',
    messages: '',

    loadMessages: function loadMessages() {
      this.set('messages', this.store.find('message', {
        limitToLast: 3
      }));
    },

    didInsertElement: function didInsertElement() {
      Ember['default'].run.scheduleOnce('afterRender', this, 'loadMessages');
    },

    actions: {
      sendMessage: function sendMessage() {
        var message = this.store.createRecord('message', {
          body: this.get('messageBody')
        });
        message.save();

        this.set('messageBody', '');
      }
    }

  });

});
define('urban-radio/components/x-player', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['x-player'],
    classNameBindings: ['isPlaying', 'isMuted'],

    isPlaying: true,
    isMuted: false,

    soundLevelObserver: Ember['default'].observer('soundLevel', function () {
      this.get('audio').volume = this.get('soundLevel');
    }),

    play: function play() {
      this.get('audio').play();
    },
    pause: function pause() {
      this.get('audio').pause();
    },
    mute: function mute() {
      this.set('cachedVolume', this.get('audio').volume);
      this.set('soundLevel', 0);
      // this.get('audio').volume = 0;
    },
    unmute: function unmute() {
      this.set('soundLevel', this.get('cachedVolume'));
      // this.get('audio').volume = this.get('cachedVolume');
    },

    didInsertElement: function didInsertElement() {
      this.set('audio', Ember['default'].$('.audio-el')[0]);
      if (this.get('isPlaying')) {
        this.play();
        this.get('audio').volume = this.get('soundLevel');
      }
    },

    actions: {
      playPause: function playPause() {
        if (this.get('isPlaying')) {
          this.set('isPlaying', false);
          this.pause();
        } else {
          this.set('isPlaying', true);
          this.play();
        }
      },

      muteUnmute: function muteUnmute() {
        if (this.get('isMuted')) {
          this.set('isMuted', false);
          this.unmute();
        } else {
          this.set('isMuted', true);
          this.mute();
        }
      }
    }
  });

});
define('urban-radio/components/x-sound-slider', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['x-payer__sound-bar'],

    isDragging: false,

    style: Ember['default'].computed('value', function () {
      var width = 'width: ' + this.get('value') * 100 + '%;';
      return new Ember['default'].Handlebars.SafeString(width);
    }),

    mouseDown: function mouseDown(event) {
      var bar = this.$()[0];
      var val = ((event.clientX - bar.offsetLeft) / bar.offsetWidth).toFixed(2);
      this.set('value', val);
      // this.set('style', 'width: ' + val * 100 + '%;');
      this.set('isDragging', true);
      // console.log('down', val);
    },

    mouseMove: function mouseMove(event) {
      if (this.get('isDragging')) {
        var bar = this.$()[0];
        var val = ((event.clientX - bar.offsetLeft) / bar.offsetWidth).toFixed(2);
        this.set('value', val);
        // this.set('style', 'width: ' + val * 100 + '%;');
        // console.log('move', val);
      }
    },

    mouseLeave: function mouseLeave() {
      this.set('isDragging', false);
    },

    mouseUp: function mouseUp() {
      this.set('isDragging', false);
    }
  });

});
define('urban-radio/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('urban-radio/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('urban-radio/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'urban-radio/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('urban-radio/initializers/component-store-injector', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject('component', 'store', 'service:store');
  }

  exports['default'] = {
    name: 'component-store-injector',
    initialize: initialize
  };

});
define('urban-radio/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, EmberFireInitializer) {

	'use strict';

	exports['default'] = EmberFireInitializer['default'];

});
define('urban-radio/initializers/export-application-global', ['exports', 'ember', 'urban-radio/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('urban-radio/models/message', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    body: DS['default'].attr('string')
  });

});
define('urban-radio/router', ['exports', 'ember', 'urban-radio/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('home', { path: '/' });
    this.route('player', {});
  });

  exports['default'] = Router;

});
define('urban-radio/routes/home', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    // beforeModel: function() {
    //   // return this.get('session').fetch().catch(function() {});
    // },

    actions: {
      //   signIn: function(provider) {
      //     this.get('session').open('firebase', { provider: provider}).then(function(data) {
      //       console.log(data.currentUser);
      //     });
      //   },

      //   signOut: function() {
      //     this.get('session').close();
      //   }
    }
  });

  // var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
  // var authData = ref.getAuth();
  // if (authData) {
  //   console.log("User " + authData.uid + " is logged in with " + authData.provider);
  // } else {
  //   console.log("User is logged out");
  // }

  // // Create a callback to handle the result of the authentication
  // function authHandler(error, authData) {
  //   if (error) {
  //     console.log("Login Failed!", error);
  //   } else {
  //     console.log("Authenticated successfully with payload:", authData);
  //   }
  // }

  // // Or via popular OAuth providers ("facebook", "github", "google", or "twitter")
  // ref.authWithOAuthPopup("<provider>", authHandler);

});
define('urban-radio/routes/player', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('urban-radio/services/firebase', ['exports', 'emberfire/services/firebase', 'urban-radio/config/environment'], function (exports, Firebase, config) {

	'use strict';

	Firebase['default'].config = config['default'];

	exports['default'] = Firebase['default'];

});
define('urban-radio/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "urban-radio/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,0],[1,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('urban-radio/templates/components/main-block', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 36,
            "column": 0
          }
        },
        "moduleName": "urban-radio/templates/components/main-block.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","main-block");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"class","main-block__header");
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","header-video");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","listeners");
        var el4 = dom.createTextNode("\n      Онлайн слухачів\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","listeners__counter");
        var el5 = dom.createTextNode("223");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","main-logo");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","main-radio");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"class","main-radio__button-play");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","main-radio__now-title");
        var el4 = dom.createTextNode("Зараз в ефірі");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","main-radio__now");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","main-radio__now-singer");
        var el5 = dom.createTextNode("Onuka");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","main-radio__now-song");
        var el5 = dom.createTextNode("— When I met you");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","main-radio__next");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","main-radio__next-title");
        var el5 = dom.createTextNode("Далі");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","main-radio__next-song");
        var el5 = dom.createTextNode("Океан Ельзи — Життя починається знов");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","main-video-control");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","main-video-control-icon");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","main-video-control-prev");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","main-video-control-next");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [9]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(element2, [5]);
        var morphs = new Array(3);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createElementMorph(element3);
        morphs[2] = dom.createElementMorph(element4);
        return morphs;
      },
      statements: [
        ["element","action",["openPlayer"],[],["loc",[null,[17,44],[17,67]]]],
        ["element","action",["prevVideo"],[],["loc",[null,[31,46],[31,68]]]],
        ["element","action",["nextVideo"],[],["loc",[null,[32,46],[32,68]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('urban-radio/templates/components/x-chat', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "urban-radio/templates/components/x-chat.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  Logged in as ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Sign out");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createElementMorph(element1);
          morphs[2] = dom.createMorphAt(fragment,5,5,contextualElement);
          return morphs;
        },
        statements: [
          ["content","session.currentUser.displayName",["loc",[null,[4,15],[4,50]]]],
          ["element","action",["signOut"],[],["loc",[null,[5,10],[5,30]]]],
          ["content","outlet",["loc",[null,[6,2],[6,12]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 0
            }
          },
          "moduleName": "urban-radio/templates/components/x-chat.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("Sign in with Facebook");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [
          ["element","action",["signIn","facebook"],[],["loc",[null,[8,10],[8,40]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 0
            },
            "end": {
              "line": 16,
              "column": 0
            }
          },
          "moduleName": "urban-radio/templates/components/x-chat.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n    message: ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]),0,0);
          return morphs;
        },
        statements: [
          ["content","message.body",["loc",[null,[14,19],[14,35]]]]
        ],
        locals: ["message"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "urban-radio/templates/components/x-chat.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("chat\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("button");
        var el2 = dom.createTextNode("send");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [7]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,3,3,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,5,5,contextualElement);
        morphs[3] = dom.createElementMorph(element2);
        return morphs;
      },
      statements: [
        ["block","if",[["get","session.isAuthenticated",["loc",[null,[3,6],[3,29]]]]],[],0,1,["loc",[null,[3,0],[9,7]]]],
        ["block","each",[["get","messages",["loc",[null,[12,8],[12,16]]]]],[],2,null,["loc",[null,[12,0],[16,9]]]],
        ["inline","input",[],["value",["subexpr","@mut",[["get","messageBody",["loc",[null,[19,14],[19,25]]]]],[],[]],"class","form-control","placeholder","enter message","type","text"],["loc",[null,[19,0],[19,88]]]],
        ["element","action",["sendMessage"],[],["loc",[null,[20,8],[20,32]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('urban-radio/templates/components/x-player', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "urban-radio/templates/components/x-player.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"class","x-payer__header");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","x-payer__header-wrap");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","x-payer__logo");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","x-payer__now-title");
        var el4 = dom.createTextNode("Ви слухаєте");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","x-payer__now-song");
        var el4 = dom.createTextNode("Onuka – When I met you");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__central");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","x-payer__play-btn");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","x-payer__sound-btn");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","x-payer__timer");
        var el3 = dom.createTextNode("02 : 42   -   00 : 32");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("footer");
        dom.setAttribute(el1,"class","x-payer__footer");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","x-payer__next-title");
        var el3 = dom.createTextNode("Далі в ефірі");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","x-payer__next-song");
        var el3 = dom.createTextNode("Океан Ельзи — Життя починається знов");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("video");
        dom.setAttribute(el1,"class","audio-el");
        dom.setAttribute(el1,"controls","");
        dom.setAttribute(el1,"autoplay","");
        dom.setAttribute(el1,"name","media");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("source");
        dom.setAttribute(el2,"src","/assets/onuka.mp3");
        dom.setAttribute(el2,"type","audio/mpeg");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(3);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createElementMorph(element2);
        morphs[2] = dom.createMorphAt(element0,5,5);
        return morphs;
      },
      statements: [
        ["element","action",["playPause"],[],["loc",[null,[10,36],[10,58]]]],
        ["element","action",["muteUnmute"],[],["loc",[null,[12,37],[12,60]]]],
        ["inline","x-sound-slider",[],["value",["subexpr","@mut",[["get","soundLevel",["loc",[null,[14,25],[14,35]]]]],[],[]]],["loc",[null,[14,2],[14,38]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('urban-radio/templates/components/x-sound-slider', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "urban-radio/templates/components/x-sound-slider.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-progress");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r1");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r2");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r3");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r4");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r5");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r6");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r7");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","x-payer__sound-bar-row r8");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(1);
        morphs[0] = dom.createAttrMorph(element0, 'style');
        return morphs;
      },
      statements: [
        ["attribute","style",["get","style",["loc",[null,[1,49],[1,54]]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('urban-radio/templates/home', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 41,
            "column": 0
          }
        },
        "moduleName": "urban-radio/templates/home.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","announcments clearfix");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"class","announcment");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","announcment-inner");
        dom.setAttribute(el4,"style","background-image: url('/assets/announce-bg.jpg');");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","ann__subtitle");
        var el6 = dom.createTextNode("Анонс");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        dom.setAttribute(el5,"class","ann__title");
        var el6 = dom.createTextNode("Зустріч з архітектором");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("date");
        dom.setAttribute(el5,"class","ann__time");
        var el6 = dom.createTextNode("18 жовтня о 12:00");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"class","announcment");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","announcment-inner");
        dom.setAttribute(el4,"style","background-image: url('/assets/announce-bg.jpg');");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","ann__subtitle");
        var el6 = dom.createTextNode("Програма");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        dom.setAttribute(el5,"class","ann__title");
        var el6 = dom.createTextNode("Розповідь про себе");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("date");
        dom.setAttribute(el5,"class","ann__time");
        var el6 = dom.createTextNode("18 жовтня о 16:00");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"class","announcment");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","announcment-inner");
        dom.setAttribute(el4,"style","background-image: url('/assets/announce-bg.jpg');");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","ann__subtitle");
        var el6 = dom.createTextNode("Інтерв’ю");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        dom.setAttribute(el5,"class","ann__title");
        var el6 = dom.createTextNode("Віктор Зотов");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("date");
        dom.setAttribute(el5,"class","ann__time");
        var el6 = dom.createTextNode("18 жовтня о 18:00");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,4,4,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,6,6,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","main-block",["loc",[null,[1,0],[1,14]]]],
        ["content","x-chat",["loc",[null,[35,0],[35,10]]]],
        ["content","outlet",["loc",[null,[40,0],[40,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('urban-radio/templates/player', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "urban-radio/templates/player.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","x-player",[],["soundLevel",0.5],["loc",[null,[1,0],[1,27]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('urban-radio/tests/adapters/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('urban-radio/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('urban-radio/tests/components/main-block.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/main-block.js should pass jshint', function(assert) { 
    assert.ok(false, 'components/main-block.js should pass jshint.\ncomponents/main-block.js: line 21, col 25, \'YT\' is not defined.\n\n1 error'); 
  });

});
define('urban-radio/tests/components/x-chat.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/x-chat.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/x-chat.js should pass jshint.'); 
  });

});
define('urban-radio/tests/components/x-player.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/x-player.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/x-player.js should pass jshint.'); 
  });

});
define('urban-radio/tests/components/x-sound-slider.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/x-sound-slider.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/x-sound-slider.js should pass jshint.'); 
  });

});
define('urban-radio/tests/helpers/resolver', ['exports', 'ember/resolver', 'urban-radio/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('urban-radio/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('urban-radio/tests/helpers/start-app', ['exports', 'ember', 'urban-radio/app', 'urban-radio/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('urban-radio/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('urban-radio/tests/initializers/component-store-injector.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/component-store-injector.js should pass jshint', function(assert) { 
    assert.ok(true, 'initializers/component-store-injector.js should pass jshint.'); 
  });

});
define('urban-radio/tests/integration/components/main-block-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('main-block', 'Integration | Component | main block', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 14
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'main-block', ['loc', [null, [1, 0], [1, 14]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'main-block', [], [], 0, null, ['loc', [null, [2, 4], [4, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('urban-radio/tests/integration/components/main-block-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/main-block-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/main-block-test.js should pass jshint.'); 
  });

});
define('urban-radio/tests/integration/components/x-chat-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('x-chat', 'Integration | Component | x chat', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 10
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'x-chat', ['loc', [null, [1, 0], [1, 10]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'x-chat', [], [], 0, null, ['loc', [null, [2, 4], [4, 15]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('urban-radio/tests/integration/components/x-chat-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/x-chat-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/x-chat-test.js should pass jshint.'); 
  });

});
define('urban-radio/tests/integration/components/x-player-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('x-player', 'Integration | Component | x player', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 12
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'x-player', ['loc', [null, [1, 0], [1, 12]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'x-player', [], [], 0, null, ['loc', [null, [2, 4], [4, 17]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('urban-radio/tests/integration/components/x-player-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/x-player-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/x-player-test.js should pass jshint.'); 
  });

});
define('urban-radio/tests/integration/components/x-sound-slider-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('x-sound-slider', 'Integration | Component | x sound slider', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 18
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'x-sound-slider', ['loc', [null, [1, 0], [1, 18]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'x-sound-slider', [], [], 0, null, ['loc', [null, [2, 4], [4, 23]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('urban-radio/tests/integration/components/x-sound-slider-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/x-sound-slider-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/x-sound-slider-test.js should pass jshint.'); 
  });

});
define('urban-radio/tests/models/message.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/message.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/message.js should pass jshint.'); 
  });

});
define('urban-radio/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('urban-radio/tests/routes/home.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/home.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/home.js should pass jshint.'); 
  });

});
define('urban-radio/tests/routes/player.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/player.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/player.js should pass jshint.'); 
  });

});
define('urban-radio/tests/test-helper', ['urban-radio/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('urban-radio/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('urban-radio/tests/unit/initializers/component-store-injector-test', ['ember', 'urban-radio/initializers/component-store-injector', 'qunit'], function (Ember, component_store_injector, qunit) {

  'use strict';

  var registry, application;

  qunit.module('Unit | Initializer | component store injector', {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    component_store_injector.initialize(registry, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('urban-radio/tests/unit/initializers/component-store-injector-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/initializers');
  QUnit.test('unit/initializers/component-store-injector-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/initializers/component-store-injector-test.js should pass jshint.'); 
  });

});
define('urban-radio/tests/unit/models/message-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('message', 'Unit | Model | message', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('urban-radio/tests/unit/models/message-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/message-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/message-test.js should pass jshint.'); 
  });

});
define('urban-radio/tests/unit/routes/home-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:home', 'Unit | Route | home', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('urban-radio/tests/unit/routes/home-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/home-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/home-test.js should pass jshint.'); 
  });

});
define('urban-radio/tests/unit/routes/player-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:player', 'Unit | Route | player', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('urban-radio/tests/unit/routes/player-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/player-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/player-test.js should pass jshint.'); 
  });

});
define('urban-radio/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, FirebaseProvider) {

	'use strict';

	exports['default'] = FirebaseProvider['default'];

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('urban-radio/config/environment', ['ember'], function(Ember) {
  var prefix = 'urban-radio';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("urban-radio/tests/test-helper");
} else {
  require("urban-radio/app")["default"].create({"name":"urban-radio","version":"0.0.0+e747051d"});
}

/* jshint ignore:end */
//# sourceMappingURL=urban-radio.map
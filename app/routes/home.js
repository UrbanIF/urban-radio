import Ember from 'ember';

export default Ember.Route.extend({
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

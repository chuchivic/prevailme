var assert = require('assert');
var expect = require("chai").expect;

var FirebaseServer = require('firebase-server');

var firebase = require('firebase');

new FirebaseServer(5000, 'test.firebaseio.localhost', {
    states: {
        CA: 'California',
        AL: 'Alabama',
        KY: 'Kentucky'
    }
});

firebase.initializeApp({
  apiKey: '<your-api-key>',
  databaseURL: 'ws://test.firebaseio.localhost:5000',
});

var firebaseref = require('firebase');
var myFirebaseRef = firebaseref.database();

function storeSomeData(){
  var tags = JSON.parse('{"uno":true,"dos":true}');
  var link = myFirebaseRef.ref('links').push({
        user: {
          id: "sdcsdc",
          name: "jesus"

        },
        url: "url",
        tags,
        date: new Date().toISOString()
      });

      tags = JSON.parse('{"dos":true,"tres":true}');
      link = myFirebaseRef.ref('links').push({
            user: {
              id: "csdcsdc",
              name: "Mariano"

            },
            url: "url2",
            tags,
            date: new Date().toISOString()
          });


}


storeSomeData();


describe('Firebase recover urls from tag', function() {
  var tagAsked = "uno";

    it('shoud return only one link, the corresponding with the tag', function() {

      function callback(result){
        console.log(result.val());
        //console.log(result.val().url == "url");
        expect(result.val().url).to.equal("url");


      }
      myFirebaseRef.ref('links').orderByChild('tags').equalTo('true',tagAsked).once('value').then(callback,function(link){
        //expect(link.val().tags).to.equal(tagAsked);
        console.log("devolviendo un dato:");
        console.log(link.val());
        callback(link);
      });

    });

});

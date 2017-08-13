var assert = require('assert');
var expect = require("chai").expect;
var utils = require('util');
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

  var tagsRef = myFirebaseRef.ref('tags').push({
    tag:"buscador"
  });
  var tagId = tagsRef.getKey();

  tagsRef = myFirebaseRef.ref('tags').push({
        tag:"web"
      });
  var tagId2 = tagsRef.getKey();


  var tags = JSON.parse('{"' + tagId + '":true,"' + tagId2 + '":true}');
  var linkData = {
        user: {
          id: "sdcsdc",
          name: "jesus"

        },
        url: "https://www.google.com",
        tags,
        date: new Date().toISOString()
      };
  var linkKey = myFirebaseRef.ref('links').push().getKey();
console.log(utils.inspect(linkKey,false,null));

var links = JSON.parse('{"' + linkKey + '":true}');
  var updates = {};
  updates['/links/' + linkKey] = linkData;
  updates['/tags/' + tagId] = {links,
        tag:"buscador",
      };
  updates['/tags/' + tagId2] = {links,
            tag:"web",
          };

  myFirebaseRef.ref().update(updates);


}

function storeSomeData2(){

  var tagsRef = myFirebaseRef.ref('tags').push({
    tag:"buscador"
  });
  var tagId = tagsRef.getKey();

  tagsRef = myFirebaseRef.ref('tags').push({
        tag:"cacahuete"
      });
  var tagId2 = tagsRef.getKey();


  var tags = JSON.parse('{"' + tagId + '":true,"' + tagId2 + '":true}');
  var linkData = {
        user: {
          id: "sdcsdc",
          name: "jesus"

        },
        url: "http://www.yahoo.com",
        tags,
        date: new Date().toISOString()
      };
  var linkKey = myFirebaseRef.ref('links').push().getKey();

console.log(utils.inspect(linkKey,false,null));

var links = JSON.parse('{"' + linkKey + '":true}');
  var updates = {};
  updates['/links/' + linkKey] = linkData;
  updates['/tags/' + tagId] = {links,
        tag:"buscador",
      };
  updates['/tags/' + tagId2] = {links,
            tag:"cacahuete",
          };

  myFirebaseRef.ref().update(updates);


}

storeSomeData();
storeSomeData2();


describe('Firebase recover urls from tag', function() {
  var tagAsked = "buscador";
  var firebaseRefLinks = myFirebaseRef.ref('links');
  var firebaseRefTags = myFirebaseRef.ref('tags');
  var values;
  var value = 0;



    it('should return two links',function(done){
      function callback(result){
          function callback2(result2){
            console.log("CACA");
            value++;
            console.log(result2.val().url);

            assert(values == value);
            done();


          }
          var json = result.val();
          console.log(json);
          var keys = Object.keys(json);
          console.log(keys);
          values = keys.length;
          for(var i = 0; i < keys.length; i++) {
            console.log('/links/' + String(Object.keys(json[keys[i]].links)[0]));
            firebaseRefLinks
            .child(String(Object.keys(json[keys[i]].links)[0]))
            .once('value')
            .then(callback2,function(link){
              callback2(link);
            });


          }

      }
      firebaseRefTags.orderByChild('tag').equalTo(tagAsked).once('value').then(callback,function(tag){
        firebaseRefLinks.child(tag.child("links")).once('value').then(callback,function(link){
          //console.log(link.val());
          callback(link);
        });
      });
    });


});

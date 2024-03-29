// Rdio Utils 0.0.1
// Copyright 2013, Rdio, Inc.
// https://github.com/rdio/jsapi-examples/tree/master/utils
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

(function(R) {

  var verbose = false;

  // ----------
  var log = function() {
    /*globals console */
    if (verbose && window.console && console.log) {
      console.log.apply(console, arguments);
    }
  };

  // ----------
  var assert = function(condition, message) {
    /*globals console */
    if (!window.console) {
      return;
    }

    if (console.assert) {
      console.assert(condition, message);
    } else if (condition && console.error) {
      console.error('Rdio Utils assert failed: ' + message);
    }
  };

  // ----------
  var bind = function(element, eventName, handler) {
    if(element.addEventListener)
      element.addEventListener(eventName, handler, true);
    else
      element.attachEvent("on" + eventName, handler);
  };
  
  // ----------
  var unbind = function(element, eventName, handler) {
    if(element.removeEventListener)
      element.removeEventListener(eventName, handler, true);
    else
      element.detachEvent("on" + eventName, handler);
  };

  // ----------
  function dialog(message) {
    var body = document.getElementsByTagName('body')[0];
    var el = document.createElement('div');
    el.className = "rdio-utils-dialog";
    el.innerHTML = '<div>'
      + message
      + '</div><br><button>OK</button>';

    var button = el.getElementsByTagName('button')[0];
    bind(button, 'click', function() {
      body.removeChild(el);
    });

    body.appendChild(el);
  }

  // ----------
  window.rdioUtils = {
    // ----------
    startupChecks: function() {
      var self = this;
      
      if (!R) {
        dialog('Unable to contact Rdio API. Please try again later.');
        return false;
      }

      R.on('flashError', function() {
        dialog('The Rdio API requires Flash in this browser. Please install (or unblock) the Flash plug-in.');
      });

      R.on('cookieError', function() {
        dialog('The Rdio API won\'t work while cookies are blocked. Please unblock cookies for rdio.com.');
      });

      return true;
    },

    // ----------
    addToTopOfQueue: function(sourceKey) {
      var handler = function(model, collection, info) {
        if (model.get('key') == sourceKey) {    
          R.player.queue.off('add', handler);
          R.player.queue.move(info.index, 0);
        }
      };

      R.player.queue.on('add', handler);
      R.player.queue.add(sourceKey);
    },

    // ----------
    collectionAlbums: function(config) {
      return new CollectionTracker(config);
    },

    // ----------
    authWidget: function(el) {
      if (el.jquery) {
        el = el[0];
      }

      var showAuthenticated = function() {
        el.innerHTML = R.currentUser.get('firstName') + ' ' + R.currentUser.get('lastName');
      };
      
      R.ready(function() {
        if (R.authenticated()) {
          showAuthenticated();
        } else {
          el.innerHTML = '<button>Sign In With Rdio</button>';
          bind(el, 'click', function() {
            R.authenticate(function(authenticated) {
              if (authenticated) {
                showAuthenticated();
              }
            });
          });
        }
      });
    }
  };

  // ----------
  var CollectionTracker = function(config) {
    var self = this;
    this._config = {
      onLoadComplete: config.onLoadComplete,
      onAlbumsLoaded: config.onAlbumsLoaded,
      onError: config.onError,
      onAdded: config.onAdded,
      onRemoved: config.onRemoved
    };

    if (config.localStorage && window.JSON) {
      // Determine if localStorage is available.
      // See: https://gist.github.com/paulirish/5558557
      try {
        var testKey = '__rdioUtilsTestKey';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        this._config.localStorage = true;
      } catch(e) {
      }      
    }

    this._start = 0;
    this._loading = null;
    this._albums = [];
    this._albumsByKey = {};
    this._newAlbums = [];
    this._newAlbumsByKey = {};
    this._firstTime = true;
    
    this._bigExtras = '-*,releaseDate,duration,isClean,canStream,icon,'
      + 'canSample,name,isExplicit,artist,url,length,trackKeys,artistUrl';

    var whenAuthenticated = function() {
      if (self._config.localStorage) {
        var data = localStorage.__rdioUtilsCollectionAlbums;
        if (data) {
          var albums = JSON.parse(data);
          if (albums instanceof Array && albums.length) {
            var album;
            for (var i = 0; i < albums.length; i++) {
              album = albums[i];
              self._albumsByKey[album.key] = album;
            }

            self._albums = albums;
            self.length = self._albums.length;
            self._firstTime = false;

            if (self._config.onAlbumsLoaded) {
              self._config.onAlbumsLoaded(albums);
            }

            if (self._config.onLoadComplete) {
              self._config.onLoadComplete();
            }

            var libraryVersion = localStorage.__rdioUtilsCollectionVersion;
            if (libraryVersion != R.currentUser.get('libraryVersion')) {
              self._startLoad();
            }
          }
        }
      }

      if (self._firstTime) {
        self._startLoad();
      }

      R.currentUser.on('change:libraryVersion', function(value) {
        log('change:libraryVersion: ' + value);
        if (self._loading) {
          self._loading.loadAgain = true;

          if (!self._firstTime) {
            assert(self._loading.request, '_loading.request must exist');
            self._loading.request.abort();
          }
        } else {
          self._startLoad();
        }
      });
    };

    R.ready(function() {
      if (R.authenticated()) {
        whenAuthenticated();
      } else {
        var handler = function(authenticated) {
          if (authenticated) {
            R.off('change:authenticated', handler);
            whenAuthenticated();    
          }
        };

        R.on('change:authenticated', handler);
      }
    });
  };

  // ----------
  CollectionTracker.prototype = {
    // ----------
    at: function(index) {
      return this._albums[index];
    },

    // ----------
    _startLoad: function() {
      log('_startLoad');
      this._start = 0;
      this._newAlbums = [];
      this._newAlbumsByKey = {};
      this._loading = {};

      if (this._firstTime) {
        this._count = 100;
        this._extras = this._bigExtras + ',albumKey,rawArtistKey';
      } else {
        this._count = 1000;
        this._extras = '-*,albumKey';
      }

      this._load();
    },

    // ----------
    _load: function() {
      log('_load');      
      var self = this;
      assert(this._loading, '_loading must exist');
      assert(!this._loading.request, '_loading.request must not exist');
        
      this._loading.request = R.request({
        method: "getAlbumsInCollection", 
        content: {
          user: R.currentUser.get("key"), 
          start: this._start,
          count: this._count,
          extras: this._extras,
          sort: 'playCount'
        },
        success: function(data) {
          self._loading.request = null;

          if (data.result.length) {
            var album;
            for (var i = 0; i < data.result.length; i++) {
              album = data.result[i];

              album.key = album.albumKey;
              delete album.albumKey;

              album.artistKey = album.rawArtistKey;
              delete album.rawArtistKey;

              self._newAlbums.push(album);
              self._newAlbumsByKey[album.key] = album;
            }

            if (self._firstTime && self._config.onAlbumsLoaded) {
              self._config.onAlbumsLoaded(data.result);
            }
          }
          
          if (data.result.length == self._count) {
            self._start += self._count;
            self._load();
          } else {
            var addedKeys = [];
            var removedKeys = [];

            if (self._firstTime) {
              self._albums = self._newAlbums;
              self._albumsByKey = self._newAlbumsByKey;
            } else {
              var key;

              // Added
              for (key in self._newAlbumsByKey) {
                if (!self._albumsByKey[key]) {
                  addedKeys.push(key);
                }
              }

              // Removed
              for (key in self._albumsByKey) {
                if (!self._newAlbumsByKey[key]) {
                  removedKeys.push(key);
                }
              }

              // Grab full data for added albums
              if (addedKeys.length) {
                self._getAlbums(addedKeys, function(addedAlbums) {
                  self._finishLoad(addedAlbums, removedKeys);
                });

                return;
              }
            }

            self._finishLoad([], removedKeys);
          }
        },
        error: function(data) {
          log('_load error: ' + data.status);
          self._loading.request = null;
          if (data.status != 'abort' && self._config.onError) {
            self._config.onError(data.message);
          }

          self._loadingDone();
        }
      });      
    },

    // ----------
    _getAlbums: function(keys, callback) {
      log('_getAlbums');
      var self = this;
      assert(this._loading, '_loading must exist');
      assert(!this._loading.request, '_loading.request must not exist');

      var chunkSize = 200;
      var keysChunk = keys.slice(0, chunkSize);
      var keysRemainder = keys.slice(chunkSize);

      this._loading.request = R.request({
        method: "get", 
        content: {
          keys: keysChunk.join(','),
          extras: this._bigExtras + ',key,artistKey'
        },
        success: function(data) {
          self._loading.request = null;
          var addedAlbums = [];
          var album;
          for (var key in data.result) {
            album = data.result[key];
            addedAlbums.push(album);
          }

          if (keysRemainder.length) {
            self._getAlbums(keysRemainder, function(moreAddedAlbums) {
              callback(addedAlbums.concat(moreAddedAlbums));
            });
          } else {
            callback(addedAlbums);
          }
        },
        error: function(data) {
          log('_getAlbums error: ' + data.status);
          self._loading.request = null;
          if (data.status != 'abort' && self._config.onError) {
            self._config.onError(data.message);
          }

          self._loadingDone();
        }
      });
    },

    // ----------
    _finishLoad: function(addedAlbums, removedKeys) {
      var i;

      // Actually remove
      var removedAlbums = [];
      var key;
      for (i = 0; i < removedKeys.length; i++) {
        key = removedKeys[i];
        removedAlbums.push(this._albumsByKey[key]);
        delete this._albumsByKey[key];
        for (var j = 0; j < this._albums.length; j++) {
          if (this._albums[j].key == key) {
            this._albums.splice(j, 1);
            break;
          }
        }
      }

      // Actually add
      var album;
      for (i = 0; i < addedAlbums.length; i++) {
        album = addedAlbums[i];
        this._albums.push(album);
        this._albumsByKey[album.key] = album;
      }

      // Finish up
      var wasFirstTime = this._firstTime;

      this._newAlbums = [];
      this._newAlbumsByKey = {};
      this.length = this._albums.length;
      this._firstTime = false;
      this._save();

      // Send events
      if (wasFirstTime && this._config.onLoadComplete) {
        this._config.onLoadComplete();
      }

      if (addedAlbums.length && this._config.onAdded) {
        this._config.onAdded(addedAlbums);
      }

      if (removedAlbums.length && this._config.onRemoved) {
        this._config.onRemoved(removedAlbums);
      }

      // Final cleanup
      this._loadingDone();
    },

    // ----------
    _loadingDone: function() {
      assert(this._loading, '_loading must exist');
      assert(!this._loading.request, '_loading.request must not exist');

      var loadAgain = this._loading.loadAgain;
      
      this._loading = null;
      
      if (loadAgain) {
        this._startLoad();
      }
    },
    
    // ----------
    _save: function() {
      if (!this._config.localStorage) {
        return;
      }

      var data = JSON.stringify(this._albums);
      localStorage.__rdioUtilsCollectionAlbums = data;
      localStorage.__rdioUtilsCollectionVersion = R.currentUser.get('libraryVersion');
    }
  };

})(window.__rdio);
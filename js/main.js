var DEBUG = false;
var app;

window.onload = function() {
  
  // Setup service worker for caching files
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service_worker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  } else {
    console.log('ServiceWorker not found in navigator');
  }
  
  // Setup Paper.js
  paper.install(window);
  paper.setup('canvas-spiderweb');
  
  app = new Spiderweb_Manager(window, view);
  resizeApp();
  
  // Setup fullscreen-mode handlers
  var fullscreenButton = document.getElementById('fullscreen-button');
  
  htmlCanvas = document.getElementById('canvas-spiderweb');
  fullscreenButton.addEventListener('click', function(e) {
    e.preventDefault();
    requestFullscreen(document.documentElement);
  });
  fullscreenButton.addEventListener('touchstart', function(e) {
    e.preventDefault();
    requestFullscreen(document.documentElement);
  });
  
  window.addEventListener('resize', function(e) {
    e.preventDefault();
    resizeApp();
  });
};

var requestFullscreen = function(ele) {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  } else {
    console.log('Fullscreen API is not supported.');
  }
  // Call this here in case fullscreen mode is not activated
  resizeApp();
};

var resizeApp = function() {
  setTimeout(function(){
    app.init(view.viewSize.width, view.viewSize.height);
  }, 100);
};

/*
 * Log a message to console
 *
 * Requires global variable DEBUG to be set to true
 */
log = function(title, data) {
  // DEBUG refers to global variable set in main.js
  if (DEBUG) {
    console.log(title + (data ? ': ' : ''));

    if (data)
      console.log(data);
  }
};

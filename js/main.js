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
  
  // Setup fullscreen-mode handlers
  var fullscreenButton = document.getElementById('fullscreen-button');
  // var fsExitDocButton = document.getElementById('fs-exit-doc-button');
  
  fullscreenButton.addEventListener('click', function(e) {
    e.preventDefault();
    fullscreenButton.style.display = 'none';
    requestFullscreen(document.documentElement);
  });
  
  // fsExitDocButton.addEventListener('click', function(e) {
    // e.preventDefault();
    // fullscreenButton.style.display = 'default';
    // exitFullscreen();
  // });
  
  // Setup Paper.js
  paper.install(window);
  paper.setup('canvas-spiderweb');
  
  app = new Spiderweb_Manager(window, view);
  app.init();
};

window.onresize = function() {
  // TODO: resize web to fit screen?
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
};

var exitFullscreen = function() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else {
    console.log('Fullscreen API is not supported.');
  }
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

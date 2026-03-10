/* =============================================
   Auto-scroll W2K Premium
   Scroll automatique intelligent multi-pages
   W2K-Digital 2025
   ============================================= */

var W2KAutoScroll = {

  config: {
    speed: 'slow',
    pixelsPerStep: 1,
    stepInterval: 20,
    pauseDuration: 12000,
    inactivityDelay: 45000,
    startDelay: 3000,
    showIndicator: true
  },

  state: {
    active: false,
    paused: false,
    timer: null,
    inactivityTimer: null,
    scrollInterval: null,
    userInteracted: false
  },

  init: function (customConfig) {
    if (customConfig) {
      for (var key in customConfig) {
        if (customConfig.hasOwnProperty(key)) {
          this.config[key] = customConfig[key];
        }
      }
    }
    this.setupEventListeners();
    var self = this;
    setTimeout(function () {
      self.start();
    }, self.config.startDelay);
    if (this.config.showIndicator) {
      this.createIndicator();
    }
  },

  start: function () {
    this.state.active = true;
    this.state.paused = false;
    this.scroll();
    this.updateIndicator(true);
  },

  pause: function () {
    this.state.paused = true;
    this.state.userInteracted = true;
    clearInterval(this.state.scrollInterval);
    this.updateIndicator(false);
    clearTimeout(this.state.inactivityTimer);
    var self = this;
    this.state.inactivityTimer = setTimeout(function () {
      self.resume();
    }, self.config.inactivityDelay);
  },

  resume: function () {
    if (!this.state.active) return;
    this.state.paused = false;
    this.scroll();
    this.updateIndicator(true);
  },

  scroll: function () {
    clearInterval(this.state.scrollInterval);
    var self = this;
    this.state.scrollInterval = setInterval(function () {
      var maxScroll = document.body.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 5) {
        clearInterval(self.state.scrollInterval);
        self.goToNextPage();
        return;
      }
      window.scrollBy(0, self.config.pixelsPerStep);
    }, this.config.stepInterval);
  },

  goToNextPage: function () {
    var nextPage = document.body.getAttribute('data-next-page');
    if (!nextPage) return;
    var self = this;
    setTimeout(function () {
      window.location.href = nextPage;
    }, 3000);
  },

  setupEventListeners: function () {
    var self = this;
    var events = ['click', 'touchstart', 'keydown', 'wheel'];
    events.forEach(function (evt) {
      window.addEventListener(evt, function () {
        if (self.state.active && !self.state.paused) {
          self.pause();
        }
      }, { passive: true });
    });
  },

  createIndicator: function () {
    var dot = document.createElement('div');
    dot.id = 'w2k-scroll-indicator';
    dot.innerHTML = '<span></span>';
    document.body.appendChild(dot);
  },

  updateIndicator: function (isActive) {
    var dot = document.getElementById('w2k-scroll-indicator');
    if (!dot) return;
    if (isActive) {
      dot.classList.remove('paused');
    } else {
      dot.classList.add('paused');
    }
  }
};

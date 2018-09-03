var timeUnit = 24;
// This only works because it is not in between months
var startingDate = 20180514;
var endingDate = 20180520;

var dayUnit = 7;

var timeRange = Array(timeUnit).fill().map((f,idx) => idx);
var dayRange = Array(dayUnit).fill().map((f,idx) => { return (startingDate + idx)});

var totalTimeRange = Array(timeUnit * dayUnit)
                    .fill()
                    .map((f,idx) => {
                      var dayIndex = Math.floor(idx/timeUnit);
                      var timeIndex = Math.floor(idx%timeUnit)
                      var timeString = timeRange[timeIndex].toString();
                      if(timeString.length < 2) timeString = '0' + timeString;
                      return dayRange[dayIndex].toString() + timeString;
                    });

var dayWords = '월화수목금토일';


function addDataToTangram () {
  var currentDataSources = Object.keys(tangramLayer.scene.sources);
}

var SliderControl = L.Control.extend({
  initialize: function(opts) {
    this.options = L.Util.setOptions(this, opts);
    this.tangramLayer = opts.tangramLayer,
    this.slidingSpeed = 0.1;
    this.currentSlideValue = 0;
    this.currentTimeIndex = 0;
    this.currentDayIndex = 0;
    this.currentDayTime = totalTimeRange[0];
  },

  onAdd: function(map) {
    var containerDiv = L.DomUtil.create('div', 'container');
    var titleH = L.DomUtil.create('h3');
    titleH.textContent = '서울생활인구 Populations by time in Seoul';
    var timeH = L.DomUtil.create('h3');
    timeH.id = 'timeLabel';
    timeH.classList.add('f-left')
    timeH.textContent = this.getDisplayText(totalTimeRange[0]);

    var timeSliderDiv = L.DomUtil.create('div', 'slider-wrapper');
    var dateLabel = L.DomUtil.create('label');
    dateLabel.textContent = '시간';
    timeSliderDiv.id = 'tileSlider';

    var daySliderDiv = L.DomUtil.create('div', 'slider-wrapper');
    var dayLabel = L.DomUtil.create('label');
    dayLabel.textContent = '일';
    daySliderDiv.id = 'daySlider';

    noUiSlider.create(timeSliderDiv, {
      start: 0,
      connect: true,
      step: 1,
      tooltips: false,
      range: {
        'min': 0,
        'max': 23
      },
      format: {
        to: function (value) {
          return value;
        },
        from: function (value) {
          return value;
        }
      },
      pips: { // Show a scale with the slider
        mode: 'positions',
        stepped: true,
        density: 20,
        values: [0,25,50,75,100]
      }
    });


    noUiSlider.create(daySliderDiv, {
      start: 0,
      connect: true,
      step: 1,
      tooltips: false,
      range: {
        'min': 0,
        'max': 6
      },
      format: {
        to: function (value) {
          return value;
        },
        from: function (value) {
          return value;
        }
      },
      pips: { // Show a scale with the slider
        mode: 'positions',
        stepped: true,
        density: 100/7,
        values: [0,100]
      }
    });


    var playButton = L.DomUtil.create('button');
    playButton.id = 'play';
    playButton.classList.add('f-left');
    playButton.textContent = 'play';

    var pauseButton = L.DomUtil.create('button');
    pauseButton.id = 'pause';
    pauseButton.classList.add('f-left');
    pauseButton.textContent = 'pause';


    var self = this;
    playButton.onclick = function (ev) {
      L.DomEvent.stopPropagation(ev);
      self.setAnimation(timeSliderDiv, daySliderDiv, timeH);
    }

    pauseButton.onclick = function (ev) {
      L.DomEvent.stopPropagation(ev);
      if(window.intervalID) {
        clearInterval(window.intervalID);
        window.intervalID = null;
      }
    }

    timeSliderDiv.noUiSlider.on('change', function ( values, handle ) {
      //TO DO: change the currentslidervalue
      let idx = Math.round(values[handle]);
      self.currentTimeIndex = idx;
      self.currentSlideValue = getTimeIndex(self.currentDayIndex, self.currentTimeIndex);
      self.currentDayTime = totalTimeRange[getTimeIndex(self.currentDayIndex, self.currentTimeIndex)];
      console.log(self.currentDayTime);
      self.updateTangram(totalTimeRange.indexOf(self.currentDayTime));
      timeH.textContent = self.getDisplayText(self.currentDayTime);
    });

    daySliderDiv.noUiSlider.on('change', function ( values, handle ) {
      //TO DO: change the currentslidervalue
      let idx = Math.floor(values[handle]);
      self.currentDayIndex = idx;
      self.currentDayTime = totalTimeRange[getTimeIndex(self.currentDayIndex, self.currentTimeIndex)];

      self.updateTangram(totalTimeRange.indexOf(self.currentDayTime));
      timeH.textContent = self.getDisplayText(self.currentDayTime);
    });

    L.DomEvent.disableClickPropagation(containerDiv);

    containerDiv.appendChild(titleH);

    containerDiv.appendChild(dateLabel);
    containerDiv.appendChild(timeSliderDiv);

    containerDiv.appendChild(dayLabel);
    containerDiv.appendChild(daySliderDiv);

    containerDiv.appendChild(playButton);
    containerDiv.appendChild(pauseButton);
    containerDiv.appendChild(timeH);

    return containerDiv;
  },

  animate: function (timeSlider, daySlider, timeH) {
      if (this.currentSlideValue < totalTimeRange.length) {
        this.currentSlideValue+=this.slidingSpeed; //speed
      } else {
        this.currentSlideValue = 0;
      }
      console.log(this.currentSlideValue);
      this.updateTangram(this.currentSlideValue);
      this.currentDayTime = totalTimeRange[Math.floor(this.currentSlideValue)];

      timeH.textContent = this.getDisplayText(this.currentDayTime);

      var integerSlidingVal = Math.round(this.currentSlideValue);

      if (Math.abs(this.currentSlideValue - integerSlidingVal) < 0.00001 ) {
        timeSlider.noUiSlider.set(integerSlidingVal%timeUnit);
        daySlider.noUiSlider.set(Math.floor(integerSlidingVal/timeUnit));
        this.currentDayIndex = Math.floor(integerSlidingVal/timeUnit);
        this.currentTimeIndex = integerSlidingVal%timeUnit;
        this.currentDayTime = totalTimeRange[getTimeIndex(self.currentDayIndex, self.currentTimeIndex)];

      }
  },

  getNow: function () {
    return this.currentDayTime;
  },

  setAnimation: function(timeSlider, daySlider, timeH) {
    var self = this;
    if(!window.intervalID) {
      this.currentSlideValue = totalTimeRange.indexOf(self.currentDayTime);
      this.updateTangram(this.currentSlideValue);
      window.intervalID = setInterval(function() {
        self.animate(timeSlider, daySlider, timeH)
      }, 10);
    }
  },

  updateTangram: function(idx) {
    this.tangramLayer.scene.styles.dongStyle.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.femaleStyle.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.maleStyle.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.age0Style.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.age1Style.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.age2Style.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.age3Style.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.age4Style.shaders.uniforms.u_offset = idx;
    this.tangramLayer.scene.styles.age5Style.shaders.uniforms.u_offset = idx;
  },

  getDisplayText: function(s) {
     return s[0]+s[1]+s[2]+s[3]+'/ '+s[4]+s[5] + '/ ' + s[6] +s[7] + '  '+ s[8]+s[9]+'시'+ ' ' + dayWords[this.currentDayIndex]+'요일';
   }
});


function getDisplayTextWODay(s) {
    return s[0]+s[1]+s[2]+s[3]+'/ '+s[4]+s[5] + '/ ' + s[6] +s[7] + '  '+ s[8]+s[9]+'시';
}

function getTimeIndex(d, t) {
  return (d*24 + t);
}

function getCurrentSlideValue(timeIndex, dayIndex) {
  return timeIndex
}

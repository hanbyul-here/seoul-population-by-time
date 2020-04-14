import lang from './lang'
var timeUnit = 24;
// This only works because it is not in between months
var startingDate = 20180827;
var endingDate = 20180902;
var dayUnit = 7;

var timeRange = Array(timeUnit).fill().map((f,idx) => idx);
// var dayRange = Array(dayUnit).fill().map((f,idx) => { return (startingDate + idx)});
// var dayRange = [20190304, 20190305, 20190306, 20190307, 20190308, 20190309,20190310]
var dayRange = [20200309, 20200310, 20200311, 20200312, 20200313, 20200314,20200315]

var totalTimeRange = Array(timeUnit * dayUnit)
                    .fill()
                    .map((f,idx) => {
                      var dayIndex = Math.floor(idx/timeUnit);
                      var timeIndex = Math.floor(idx%timeUnit)
                      var timeString = timeRange[timeIndex].toString();
                      if(timeString.length < 2) timeString = '0' + timeString;
                      return dayRange[dayIndex].toString() + timeString;
                    });


// function addDataToTangram () {
//   var currentDataSources = Object.keys(tangramLayer.scene.sources);
// }

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
    var containerDiv = L.DomUtil.create('div', 'whole-container');
    var titleH = L.DomUtil.create('h1');
    titleH.textContent = lang.title[globalConfig.lang];

    var linkToGithub = L.DomUtil.create('a', 'github-link f-right')
    linkToGithub.href = "https://github.com/hanbyul-here/seoul-population-by-time"
    linkToGithub.title = lang.github[globalConfig.lang]
    var githubLogo = L.DomUtil.create('img')
    githubLogo.src = "/github-mark.png"
    linkToGithub.appendChild(githubLogo)

    var timeH = L.DomUtil.create('h3','time-h');
    timeH.id = 'timeLabel';
    timeH.classList.add('f-left')
    timeH.textContent = this.getDisplayText(totalTimeRange[0]);

    var sliderContainer = L.DomUtil.create('div', 'slider-container');

    var timeSliderDiv = L.DomUtil.create('div', 'slider-wrapper');
    var dateLabel = L.DomUtil.create('label');
    dateLabel.textContent = lang.hour[globalConfig.lang];
    timeSliderDiv.id = 'tileSlider';
    var daySliderDiv = L.DomUtil.create('div', 'slider-wrapper');
    var dayLabel = L.DomUtil.create('label');
    dayLabel.textContent = lang.day[globalConfig.lang];
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

    var buttonWrapper = L.DomUtil.create('div');
    buttonWrapper.classList.add('f-right')
    var playButton = L.DomUtil.create('button');
    playButton.id = 'play';
    playButton.classList.add('f-left');
    playButton.textContent = 'play';

    var pauseButton = L.DomUtil.create('button');
    pauseButton.id = 'pause';
    pauseButton.classList.add('f-left');
    pauseButton.textContent = 'pause';

    buttonWrapper.appendChild(playButton)
    buttonWrapper.appendChild(pauseButton)

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
      let idx = Math.floor(values[handle]);
      self.currentTimeIndex = idx;
      self.currentSlideValue = getTimeIndex(self.currentDayIndex, self.currentTimeIndex);
      self.currentDayTime = totalTimeRange[getTimeIndex(self.currentDayIndex, self.currentTimeIndex)];
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
    containerDiv.appendChild(linkToGithub)

    sliderContainer.appendChild(dateLabel);
    sliderContainer.appendChild(timeSliderDiv);

    sliderContainer.appendChild(dayLabel);
    sliderContainer.appendChild(daySliderDiv);



    sliderContainer.appendChild(timeH);
    sliderContainer.appendChild(buttonWrapper);

    containerDiv.appendChild(sliderContainer);
    return containerDiv;
  },

  animate: function (timeSlider, daySlider, timeH) {
      if (this.currentSlideValue < totalTimeRange.length) {
        var newval = (this.currentSlideValue+this.slidingSpeed).toFixed(1); //speed
        this.currentSlideValue = parseFloat(newval);

      } else {
        this.currentSlideValue = 0;
      }
      this.updateTangram(this.currentSlideValue);

      var integerSlidingVal = Math.floor(this.currentSlideValue);

      if (Math.abs(this.currentSlideValue - integerSlidingVal) < 0.00001) {
        timeSlider.noUiSlider.set(integerSlidingVal%timeUnit);
        daySlider.noUiSlider.set(Math.floor(integerSlidingVal/timeUnit));
        this.currentDayIndex = Math.floor(integerSlidingVal/timeUnit)%7;
        this.currentTimeIndex = integerSlidingVal%timeUnit;
        this.currentDayTime = totalTimeRange[getTimeIndex(this.currentDayIndex, this.currentTimeIndex)];
        timeH.textContent = this.getDisplayText(this.currentDayTime);

      }
  },

  getNow: function () {
    return Math.floor(this.currentDayTime);
  },

  getIndex: function() {
    return Math.floor(this.currentSlideValue);
  },
  getDayIndex: function () {
    return this.currentDayIndex
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
  updateTangramForNewScene: function(){
    this.updateTangram(totalTimeRange.indexOf(this.currentDayTime))
  },

  updateTangram: function(idx) {
    tangramLayer.scene.styles.dongStyle.shaders.uniforms.u_offset = idx;
    tangramLayer.scene.styles.style2020_1.shaders.uniforms.u_offset = idx;
    tangramLayer.scene.styles.style2020_2.shaders.uniforms.u_offset = idx;
    tangramLayer.scene.styles.style2020_3.shaders.uniforms.u_offset = idx;
  },

  getDisplayText: function(s) {
     return (globalConfig.lang=='kr')? lang.days[globalConfig.lang][this.currentDayIndex] +'요일 '+ s[8]+s[9]+'시' : s[8]+s[9]+ ' ' + lang.days[globalConfig.lang][this.currentDayIndex];
   }
});


function getTimeIndex(d, t) {
  return (d*24 + t);
}

function getCurrentSlideValue(timeIndex, dayIndex) {
  return timeIndex
}

export default SliderControl;
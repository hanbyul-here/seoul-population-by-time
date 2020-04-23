import {formatNumber} from './util'
import lang from './lang'

const colors2020 = ['#f6e8c3', '#d8b365', '#a6611a', ]

var LegendControl = L.Control.extend({
    initialize: function(opts) {
      L.Util.setOptions(this, opts);
      this.currentLegend='total';
      this.sliderControl = opts.sliderControl
      this.checkedKeyValue = {}
     },

    onAdd: function(map) {
      var self = this
      this.containerDiv = L.DomUtil.create('div', 'container');
      L.DomEvent.disableClickPropagation(this.containerDiv);

      var titleH = L.DomUtil.create('h1');
      titleH.textContent = lang.title[globalConfig.lang];

      var linkToGithub = L.DomUtil.create('a', 'github-link f-right')
      linkToGithub.href = "https://github.com/hanbyul-here/seoul-population-by-time/tree/master/compare-year"
      linkToGithub.title = lang.github[globalConfig.lang]
      var githubLogo = L.DomUtil.create('img')
      githubLogo.src = "/github-mark.png"
      linkToGithub.appendChild(githubLogo)

      this.containerDiv.appendChild(titleH)
      this.containerDiv.appendChild(linkToGithub)
      var unitWrapper = L.DomUtil.create('div', 'legend-wrapper');
      var legendBox =  L.DomUtil.create('div',  'legend unit colorpast');
      var legendCheck = L.DomUtil.create('input')
      legendCheck.type = 'checkbox'
      legendCheck.value = 'show2019Data'
      legendCheck.checked = 'true'
      this.checkedKeyValue['show2019Data'] = true

      legendCheck.onclick = function(e) {
        var keyName = this.value
        self.checkedKeyValue[keyName] = e.target.checked
        window.tangramLayer.scene.config.global[keyName] = e.target.checked
        window.tangramLayer.scene.updateConfig().then(()=> {
          window.tangramLayer.scene.styles.hoverStyle.shaders.uniforms.u_offset = window.selectedDongID
          window.sliderControl.updateTangramForNewScene()
        })
      }

      var legendTitle = L.DomUtil.create('h4', 'legend-title is-inline');
      legendTitle.textContent = lang.week2019[globalConfig.lang];

      unitWrapper.appendChild(legendBox)
      unitWrapper.appendChild(legendCheck)
      unitWrapper.appendChild(legendTitle)
      this.containerDiv.appendChild(unitWrapper)

      var unitWrapper2020 = L.DomUtil.create('div', 'legend-wrapper');
      for(var i =0; i<colors2020.length; i++) {
        var wrapper = L.DomUtil.create('div','is-float-left')
        var legendBox2020 =  L.DomUtil.create('div',  'legend unit');
        legendBox2020.style.backgroundColor=colors2020[i]


        var legendCheck = L.DomUtil.create('input')
        legendCheck.type = 'checkbox'
        legendCheck.value = 'show2020Data'+(colors2020.length-i)
        legendCheck.checked = 'true'

        this.checkedKeyValue['show2020Data'+(colors2020.length-i)] = true

        legendCheck.onclick = function(e) {
          var keyName = this.value
          self.checkedKeyValue[keyName] = e.target.checked
          window.tangramLayer.scene.config.global[keyName] = e.target.checked
          window.tangramLayer.scene.updateConfig().then(()=> {
            window.tangramLayer.scene.styles.hoverStyle.shaders.uniforms.u_offset = window.selectedDongID
            window.sliderControl.updateTangramForNewScene()
          })
        }

        var legendTitle2020 = L.DomUtil.create('h4', 'legend-title is-inline');
        var weekNum = i + 2
        legendTitle2020.textContent = lang.weeks2020[globalConfig.lang][colors2020.length - 1 - i]//'2020년 3월 '+weekNum+'째주';
        wrapper.appendChild(legendBox2020)
        wrapper.appendChild(legendCheck)
        wrapper.appendChild(legendTitle2020)
        unitWrapper2020.appendChild(wrapper)

      }
      this.containerDiv.appendChild(unitWrapper2020)

      return this.containerDiv;
    },

    makeLegendUnit: function(tabD) {
      var unitWrapper = L.DomUtil.create('div', 'legend unit');
      var legendTitle = L.DomUtil.create('h4', 'legend-title');
      legendTitle.textContent = tabD.legendTitle;


      var legendBar = L.DomUtil.create('div', 'legend-bar '+ tabD.layerName);
      var max = L.DomUtil.create('div', 'max-value');
      max.textContent = lang.max[globalConfig.lang] + ' :'+ formatNumber(tabD.max);
      var min = L.DomUtil.create('div', 'min-value');
      min.textContent = lang.min[globalConfig.lang] + ' :'+ formatNumber(tabD.min);

      unitWrapper.appendChild(legendTitle);
      unitWrapper.appendChild(legendBar);

      unitWrapper.appendChild(max);
      unitWrapper.appendChild(min);

      return unitWrapper;

    },

    updateTangram: function() {
      for(var key in this.checkedKeyValue) {
        tangramLayer.scene.config.global[key] = this.checkedKeyValue[key]
      }
      return tangramLayer.scene.updateConfig()
    }

  });

export default LegendControl;
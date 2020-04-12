import {formatNumber} from './util'
import lang from './lang'

const colors2020 = ['#f6e8c3', '#d8b365', '#a6611a']

var LegendControl = L.Control.extend({
    initialize: function(opts) {
      this.currentLegend='total';
     },

    onAdd: function(map) {
      this.containerDiv = L.DomUtil.create('div', 'container');
      L.DomEvent.disableClickPropagation(this.containerDiv);

      var unitWrapper = L.DomUtil.create('div', 'legend-wrapper');
      var legendBox =  L.DomUtil.create('div',  'legend unit colorpast');

      var legendTitle = L.DomUtil.create('h4', 'legend-title is-inline');
      legendTitle.textContent = '2019년 3월 2째주';

      unitWrapper.appendChild(legendBox)
      unitWrapper.appendChild(legendTitle)
      this.containerDiv.appendChild(unitWrapper)

      var unitWrapper2020 = L.DomUtil.create('div', 'legend-wrapper');
      for(var i =0; i<colors2020.length; i++) {
        var wrapper = L.DomUtil.create('div','is-float-left')
        var legendBox2020 =  L.DomUtil.create('div',  'legend unit');
        legendBox2020.style.backgroundColor=colors2020[i]

        var legendTitle2020 = L.DomUtil.create('h4', 'legend-title is-inline');
        var weekNum = i + 2
        legendTitle2020.textContent = '2020년 3월 '+weekNum+'째주';
        wrapper.appendChild(legendBox2020)
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

    update: function(tab) {
      this.containerDiv.innerHTML = '';
      this.currentLegend = tab;
      var self = this;
      tab.data.map((elem, i) => {
        var legendUnitDiv = self.makeLegendUnit(elem);
        self.containerDiv.appendChild(legendUnitDiv);
      })
    }

  });

export default LegendControl;
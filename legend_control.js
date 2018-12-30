var LegendControl = L.Control.extend({
    initialize: function(opts) {
      this.currentLegend='total';
     },

    onAdd: function(map) {
      this.containerDiv = L.DomUtil.create('div', 'container');
      L.DomEvent.disableClickPropagation(this.containerDiv);

      return this.containerDiv;
    },

    makeLegendUnit: function(tabD) {
      var unitWrapper = L.DomUtil.create('div', 'legend unit');
      var legendTitle = L.DomUtil.create('h4', 'legend-title');
      legendTitle.textContent = tabD.legendTitle;


      var legendBar = L.DomUtil.create('div', 'legend-bar '+ tabD.layerName);
      var max = L.DomUtil.create('div', 'max-value');
      max.textContent = '최대 :'+ tabD.max;
      var min = L.DomUtil.create('div', 'min-value');
      min.textContent = '최소 :'+ tabD.min;

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

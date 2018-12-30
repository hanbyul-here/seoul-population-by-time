var TabControl = L.Control.extend({
  initialize: function(opts) {
    this.tangramLayer = tangramLayer;
    this.tabs = opts.tabs;
    this.currentDataSources = tangramLayer.scene.sources;
    this.prevTab = this.tabs[0];
   },

  onAdd: function(map) {
    var containerDiv = L.DomUtil.create('div', 'tab-container');

    var self = this;

    L.DomEvent.disableClickPropagation(containerDiv);
    var timePopLabel = L.DomUtil.create('div', 'tab label');
    timePopLabel.textContent = '생활인구';
    containerDiv.appendChild(timePopLabel);
    this.tabs
    .map((e, i) => {
      var wrapperDiv = L.DomUtil.create('div', 'tab');
      var oneTab = L.DomUtil.create('input');
      oneTab.type = 'radio';
      oneTab.name ='tab';
      oneTab.id = e.value;
      wrapperDiv.classList.add(e.value);
      if (i === 0) oneTab.checked = true;

      oneTab.onclick = function() {
        // set the data source first if there is none
        if (Object.keys(self.tangramLayer.scene.config.sources).findIndex((name => name===e.data[0].sourceName)) < 0) {
          e.data.map(elem => {
            self.tangramLayer.scene.setDataSource(elem.sourceName, elem.source);
          })
        }

        if (self.prevTab && self.prevTab.value !== e.value) {
          self.prevTab.data.map(elem => {
            self.tangramLayer.scene.config.layers[elem.layerName].enabled = false;
          })
          e.data.map(elem => {
            self.tangramLayer.scene.config.layers[elem.layerName].enabled = true;
          })
        }

        self.prevTab = e;
        self.tangramLayer.scene.updateConfig().then(() => {
            sliderControl.updateTangram(sliderControl.getIndex());
        })

        self.fire('tabChange', {
          value: e
        })
      }

      var tabLabel = L.DomUtil.create('label');
      tabLabel.textContent = e.displayText;
      tabLabel.for = e.value;

      wrapperDiv.appendChild(oneTab);
      wrapperDiv.appendChild(tabLabel);

      containerDiv.appendChild(wrapperDiv);
    })

    return containerDiv;
  }
})

L.extend(TabControl.prototype, L.Evented.prototype);

export default TabControl;
var TabControl = L.Control.extend({
  initialize: function(opts) {
    this.tangramLayer = tangramLayer;
    this.sliderControl = opts.sliderControl;
    this.tabs = opts.tabs;
    this.prevTab = this.tabs[0];
   },

  onAdd: function(map) {
    var containerDiv = L.DomUtil.create('div', 'tab-container');

    var self = this;
    L.DomEvent.disableClickPropagation(containerDiv);
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
        window.tangramLayer.scene.load(e.sceneFile).then(() => {
          self.fire('tabChange', {
            value: e
          })
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
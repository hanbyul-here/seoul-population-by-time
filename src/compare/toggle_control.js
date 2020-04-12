var ToggleControl = L.Control.extend({
    initialize: function () {
      this.openPanel = false;
      this.sliderControl = document.getElementsByClassName('slider-container')[0];//sliderControl.getContainer();
      this.tabControl = tabControl.getContainer();
      this.legendControl = legend.getContainer();
    },
    hide: function (elem) {
      elem.style.display = 'none';
    },
    show: function (elem) {
      elem.style.display= 'block';
    },
    onAdd: function () {
      var container = L.DomUtil.create('div', 'toggle-container')
      var button = L.DomUtil.create('button', 'toggle');
      button.textContent = 'Open Panel';
      var self = this;
      button.addEventListener('click', function (e) {
        L.DomEvent.stopPropagation(e);
        self.openPanel = !self.openPanel;
        button.textContent = (self.openPanel) ? 'Close Panel' : 'Open Panel';
        if (self.openPanel) {
          self.show(self.sliderControl)
          self.show(self.tabControl)
          self.show(self.legendControl)
        } else {
          self.hide(self.sliderControl)
          self.hide(self.tabControl)
          self.hide(self.legendControl)
        }

      })
      return button;
    }
})

export default ToggleControl;
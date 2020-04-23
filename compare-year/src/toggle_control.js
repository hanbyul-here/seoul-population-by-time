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
      var openPanelText = (globalConfig.lang=='kr')? '컨트롤 열기' : 'Open Panel';
      var closePanelText = (globalConfig.lang=='kr')? '컨트롤 닫기' : 'Close Panel';
      var button = L.DomUtil.create('button', 'toggle');
      button.textContent = openPanelText;
      var self = this;
      button.addEventListener('click', function (e) {
        L.DomEvent.stopPropagation(e);
        self.openPanel = !self.openPanel;
        button.textContent = (self.openPanel) ? closePanelText: openPanelText
        if (self.openPanel) {
          self.show(self.sliderControl)
          self.show(self.tabControl)
        } else {
          self.hide(self.sliderControl)
          self.hide(self.tabControl)
        }

      })
      return button;
    }
})

export default ToggleControl;
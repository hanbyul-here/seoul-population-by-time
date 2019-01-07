import SliderControl from './slider_control';
import TabControl from './tab_control';
import LegendControl from './legend_control';
import ToggleControl from './toggle_control';
import tabData from './tab_data';

function initMap() {
    window.map = L.map('map');

    map.setView([37.58451, 126.96939], 12);

    window.tangramLayer = Tangram.leafletLayer({
      scene: {
        import: './timeline.yaml'
     },
     events: {
       click: function(selection) {
         onTangramClick(selection)
       },
       hover: function(selection) {
         onTangramHover(selection);
       }
     }
    });

    tangramLayer.scene.subscribe({
      load: (ev) => {

        window.sliderControl = new SliderControl({position: 'topright', tangramLayer: tangramLayer});
        window.tabControl = new TabControl({position: 'topright', sliderControl: sliderControl, tabs: tabData});
        window.legend = new LegendControl();
        sliderControl.addTo(map);
        tabControl.addTo(map);
        legend.addTo(map);
        legend.update(tabData[0]);
        var toggle = new ToggleControl();
        toggle.addTo(map);
        tabControl.on('tabChange', function (e) {
          legend.update(e.value);
        })

      }
    })
    tangramLayer.addTo(map)
  }

  var PopupPanel = (function () {
      var displayKey = {
        t:'전체',
        f:'여성',
        m:'남성',
        r: '주민등록',
        a1: '10대',
        a2: '20대',
        a3: '30대',
        a4: '40대',
        a5: '50대',
        a6: '60대'
      }

      function makeDongHeader(obj) {
        var tableRowElem = document.createElement('tr');
        var nameColElem = document.createElement('h5');
        nameColElem.textContent = obj.name;
        tableRowElem.appendChild(nameColElem);
        return tableRowElem;
      }

      function makeCurrentTimeHeader(obj) {
        var tableRowElem = document.createElement('tr');
        var nameColElem = document.createElement('h5');
        nameColElem.textContent = getDisplayTextWODay(sliderControl.getNow().toString());
        tableRowElem.appendChild(nameColElem);
        return tableRowElem;
      }

      function makeRow(key, data) {
        var tableRowElem = document.createElement('tr');
        var nameColElem = document.createElement('td');
        var valueColElem = document.createElement('td');
        nameColElem.classList.add('legend-box');
        nameColElem.classList.add(key);
        valueColElem.classList.add('value');


        if(data) {
          nameColElem.textContent = displayKey[key];
          valueColElem.textContent = data[key];
        } else {
          nameColElem.textContent = displayKey['r'];
          nameColElem.classList.add('r');
          valueColElem.textContent = key;
        }
        tableRowElem.appendChild(nameColElem);
        tableRowElem.appendChild(valueColElem);
        return tableRowElem;
      }


      function jsonToTable(obj) {
        var wrapperTableElem = document.createElement('table');
        wrapperTableElem.classList.add('feature-table');

        var dongHeader = makeDongHeader(obj);
        wrapperTableElem.appendChild(dongHeader);
        var scopedObj = obj.population[sliderControl.getNow()]

        var timeHeader = makeCurrentTimeHeader(scopedObj);
        wrapperTableElem.appendChild(timeHeader);

        var residentRow = makeRow(obj['r']);
        for (var key in scopedObj) {
            var tableRowElem = makeRow(key, scopedObj);
            wrapperTableElem.appendChild(tableRowElem);
        }
        wrapperTableElem.appendChild(residentRow);


        return wrapperTableElem;
      }

      return {
        jsonToTable: jsonToTable
      }

  })();


  function onTangramClick (selection) {
    if (selection.feature) {

      var popup = L.popup()
                .setLatLng(selection.leaflet_event.latlng)
                .setContent(PopupPanel.jsonToTable(selection.feature.properties))
                .openOn(map);
    }
  }

  function onTangramHover(selection) {
    document.getElementById('map').style.cursor = selection.feature ? 'pointer' : '';
  }

  function getDisplayTextWODay(s) {
    return s[0]+s[1]+s[2]+s[3]+'/ '+s[4]+s[5] + '/ ' + s[6] +s[7] + '  '+ s[8]+s[9]+'시';
  }

  initMap();



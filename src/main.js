import SliderControl from './slider_control';
import TabControl from './tab_control';
import LegendControl from './legend_control';
import ToggleControl from './toggle_control';
import getTabData from './tab_data';
import {formatNumber} from './util'
import lang from './lang'

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
        window.legend = new LegendControl();
        sliderControl.addTo(map);
        var tabData
        getTabData()
        .then(e => {
          tabData = e
          legend.addTo(map);
          legend.update(tabData[0]);
          window.tabControl = new TabControl({position: 'topright', sliderControl: sliderControl, tabs: tabData});
          tabControl.on('tabChange', function (e) {
            legend.update(e.value);
          })
          tabControl.addTo(map);
          var toggle = new ToggleControl();
          toggle.addTo(map);
        })
      }
    })
    tangramLayer.addTo(map)
  }

  var PopupPanel = (function () {
      var popData;
      fetch('./data/20190304/whole.json').then(res => res.json()).then(e => popData = e)
      var displayKey = {
        t:lang.total[globalConfig.lang],
        f:lang.sexItems[globalConfig.lang][0],
        m:lang.sexItems[globalConfig.lang][1],
        r: lang.residenceItems[globalConfig.lang][1],
        a1: lang.ageItems[globalConfig.lang][0],
        a2: lang.ageItems[globalConfig.lang][1],
        a3: lang.ageItems[globalConfig.lang][2],
        a4: lang.ageItems[globalConfig.lang][3],
        a5: lang.ageItems[globalConfig.lang][4],
        a6: lang.ageItems[globalConfig.lang][5]
      }
      var keys = ['t','f','m','a1','a2','a3','a4','a5','a6']

      function makeDongHeader(obj) {
        var tableRowElem = document.createElement('tr');
        var nameColElem = document.createElement('h5');
        nameColElem.textContent = obj.full_name;
        tableRowElem.appendChild(nameColElem);
        return tableRowElem;
      }

      function makeCurrentTimeHeader() {
        var tableRowElem = document.createElement('tr');
        var nameColElem = document.createElement('h5');
        nameColElem.textContent = getDisplayTextWODay(sliderControl.getNow());
        tableRowElem.appendChild(nameColElem);
        return tableRowElem;
      }

      function makeRow(data, key) {
        var tableRowElem = document.createElement('tr');
        var nameColElem = document.createElement('td');
        var valueColElem = document.createElement('td');
        nameColElem.classList.add('legend-box');
        nameColElem.classList.add(key);
        valueColElem.classList.add('value');

        var index = sliderControl.getIndex();
        if(data) {
          nameColElem.textContent = displayKey[key];
          valueColElem.textContent = formatNumber(data[index]);
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
        var code = obj['code_8'];
        var dong = popData.filter(e => e['code_8'] === code)[0]

        var wrapperTableElem = document.createElement('table');
        wrapperTableElem.classList.add('feature-table');

        var dongHeader = makeDongHeader(dong);
        wrapperTableElem.appendChild(dongHeader);

        var timeHeader = makeCurrentTimeHeader();
        wrapperTableElem.appendChild(timeHeader);

        keys.forEach(e => {
          var tableRowElem = makeRow(dong[e], e);
          wrapperTableElem.appendChild(tableRowElem);
        })

        // wrapperTableElem.appendChild(residentRow);


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
    s = s+'';
    return s[0]+s[1]+s[2]+s[3]+'/'+s[4]+s[5] + '/' + s[6] +s[7] + '  '+ s[8]+s[9]+'시';
  }

  initMap();


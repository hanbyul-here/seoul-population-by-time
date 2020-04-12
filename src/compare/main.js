import SliderControl from './slider_control';
// import TabControl from './tab_control';
import LegendControl from './legend_control';
// import ToggleControl from './toggle_control';
import getTabData from './tab_data';
import {formatNumber} from './util'
import lang from './lang'

var date2019 = '20190304'
var compareW2 = '20200309'
var compareW3 = '20200316'
var compareW4 = '20200323'
var compares = [compareW2, compareW3, compareW4]

function initMap() {
    window.map = L.map('map');

    map.setView([37.58451, 126.96939], 12);

    window.tangramLayer = Tangram.leafletLayer({
      scene: {
        import: './compare.yaml'
     },
     events: {
       click: function(selection) {
         onTangramClick(selection)
       },
       hover: function(selection) {
         onTangramHover(selection);
       }
     },
     attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> &copy; OSM contributors'
    });

    tangramLayer.scene.subscribe({
      load: (ev) => {

        window.sliderControl = new SliderControl({position: 'topright', tangramLayer: tangramLayer});
        window.legend = new LegendControl();
        console.log("???")
        sliderControl.addTo(map);
        console.log("?")
        legend.addTo(map);

        var tabData
        // getTabData()
        // .then(e => {
        //   tabData = e
        //   legend.addTo(map);
        //   legend.update(tabData[0]);
        //   window.tabControl = new TabControl({position: 'topright', sliderControl: sliderControl, tabs: tabData});
        //   tabControl.on('tabChange', function (e) {
        //     legend.update(e.value);
        //     PopupPanel.updateKey(e.value)
        //   })
        //   tabControl.addTo(map);
        //   var toggle = new ToggleControl();
        //   toggle.addTo(map);
        // })
      }
    })
    tangramLayer.addTo(map)
  }

  var PopupPanel = (function () {
      var popData;
      var data2020W2;
      var data2020W3;
      var data2020W4;
      var dataKey = 't'

      fetch('./data/'+date2019+'/whole.json').then(res => res.json()).then(e => popData = e)
      fetch('./data/'+compareW2+'/total.json').then(res => res.json()).then(e => data2020W2 = e)
      fetch('./data/'+compareW3+'/total.json').then(res => res.json()).then(e => data2020W3 = e)
      fetch('./data/'+compareW4+'/total.json').then(res => res.json()).then(e => data2020W4 = e)
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

      function makeRow(data, key, timeclassName) {
        var tableRowElem = document.createElement('tr');
        var nameColElem = document.createElement('td');
        var valueColElem = document.createElement('td');

        var name = document.createElement('span')
        tableRowElem.classList.add(timeclassName)
        nameColElem.classList.add(timeclassName)
        nameColElem.classList.add('legend-box');
        valueColElem.classList.add('value');

        var index = sliderControl.getIndex();
        if(data) {
          name.textContent = key;

          nameColElem.appendChild(name);

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

      function updateKey(key) {
        dataKey = key
      }

      function jsonToTable(obj) {
        var code = obj['code_8'];

        var compareDong = popData.filter(e => e['code_8'] === code)[0]
        var w2 = data2020W2.filter(e => e['code_8'] === code)[0]
        var w3 = data2020W3.filter(e => e['code_8'] === code)[0]
        var w4 = data2020W4.filter(e => e['code_8'] === code)[0]

        var wrapperTableElem = document.createElement('table');
        wrapperTableElem.classList.add('feature-table');

        var dongHeader = makeDongHeader(compareDong);
        wrapperTableElem.appendChild(dongHeader);

        // var timeHeader = makeCurrentTimeHeader();
        // wrapperTableElem.appendChild(timeHeader);
        keys.forEach(e => {
          if(e == dataKey) {
            var compareTableRowElem = makeRow(compareDong[e], '19년3월2째주', 'color2019');

            var tableRow2Elem = makeRow(w2[e], '20년3월2째주', 'color2020w2');
            var tableRow3Elem = makeRow(w3[e], '20년3월3째주', 'color2020w3');
            var tableRow4Elem = makeRow(w4[e], '20년3월4째주', 'color2020w4');

            wrapperTableElem.appendChild(compareTableRowElem);
            wrapperTableElem.appendChild(tableRow2Elem);
            wrapperTableElem.appendChild(tableRow3Elem);
            wrapperTableElem.appendChild(tableRow4Elem);

          }
        })

        // wrapperTableElem.appendChild(residentRow);


        return wrapperTableElem;
      }

      return {
        jsonToTable: jsonToTable,
        updateKey: updateKey
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


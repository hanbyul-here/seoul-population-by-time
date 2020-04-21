import SliderControl from './slider_control';
import TabControl from './tab_control';
import LegendControl from './legend_control';
import ToggleControl from './toggle_control';
import getTabData from './tab_data';
import {formatNumber} from './util'
import lang from './lang'

var date2019 = '20190304'
var compareW2 = '20200309'
var compareW3 = '20200316'
var compareW4 = '20200323'
var compares = [compareW2, compareW3, compareW4]


function onTangramClick (selection) {
  if (selection.feature) {
    var popup = L.popup()
              .setLatLng(selection.leaflet_event.latlng)
              .setContent(PopupPanel.jsonToTable(selection.feature.properties))
              .openOn(map);
    window.tangramLayer.scene.styles.hoverStyle.shaders.uniforms.u_offset = selection.feature.properties.id;
  } else {
    window.tangramLayer.scene.styles.hoverStyle.shaders.uniforms.u_offset = 2000000;
  }
}

function onTangramHover(selection) {
  // if(selection.feature) {
  //   document.getElementById('map').style.cursor = 'pointer';
  // }
}
function initMap() {
    window.map = L.map('map');

    map.setView([37.58451, 126.96939], 12);

    window.tangramLayer = Tangram.leafletLayer({
      scene: {
        import: './compare-t.yaml'
     },
     attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> &copy; OSM contributors'
    });

    window.sliderControl = new SliderControl({position: 'topright', tangramLayer: tangramLayer});
    window.legend = new LegendControl({position: 'topright'});

    sliderControl.addTo(map);


    var tabData = getTabData()


    window.tabControl = new TabControl({position: 'topright', sliderControl: sliderControl, tabs: tabData});
    tabControl.on('tabChange', function (e) {
      PopupPanel.updateKey(e.value.files, e.value.value,e.value.displayText)
      sliderControl.updateTangramForNewScene()
      legend.updateTangram()
    })
    tabControl.addTo(map);
    legend.addTo(map);
    var toggleControl = new ToggleControl()
    toggleControl.addTo(map)
    tangramLayer.scene.subscribe({
      load: (ev) => {
        window.tangramLayer.setSelectionEvents({
          click: onTangramClick
       });

      }
    })
    tangramLayer.addTo(map)

  }

  var PopupPanel = (function () {
      var popData;
      var data2020W2;
      var data2020W3;
      var data2020W4;
      var dataKey = 't';
      var displayKey=lang.total[globalConfig.lang];

      fetch('/data/'+date2019+'/whole.json').then(res => res.json()).then(e => popData = e)
      fetch('/data/'+compareW2+'/total.json').then(res => res.json()).then(e => data2020W2 = e)
      fetch('/data/'+compareW3+'/total.json').then(res => res.json()).then(e => data2020W3 = e)
      fetch('/data/'+compareW4+'/total.json').then(res => res.json()).then(e => data2020W4 = e)
      var displayKey = lang.total[globalConfig.lang];
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
        nameColElem.textContent = getDisplayTextWODay(sliderControl.getNow()) + ' ' + displayKey;
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

        nameColElem.textContent = key

        var index = sliderControl.getIndex();
        if(data[index]) {
          valueColElem.textContent = formatNumber(data[index]);
        } else {
          valueColElem.textContent = lang.loading[globalConfig.lang];
        }
        tableRowElem.appendChild(nameColElem);
        tableRowElem.appendChild(valueColElem);
        return tableRowElem;
      }

      function updateKey(files, value, label) {
        fetch(files[0]).then(res => res.json()).then(e => data2020W2 = e)
        fetch(files[1]).then(res => res.json()).then(e => data2020W3 = e)
        fetch(files[2]).then(res => res.json()).then(e => data2020W4 = e)
        dataKey = value
        displayKey = label
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

        var timeHeader = makeCurrentTimeHeader();
        wrapperTableElem.appendChild(timeHeader);

        keys.forEach(e => {
          if(e == dataKey) {
            var compareTableRowElem = makeRow(compareDong[e], lang.week2019[globalConfig.lang], 'color2019');

            var tableRow2Elem = makeRow(w2[e], lang.weeks2020[globalConfig.lang][0], 'color2020w2');
            var tableRow3Elem = makeRow(w3[e], lang.weeks2020[globalConfig.lang][1], 'color2020w3');
            var tableRow4Elem = makeRow(w4[e], lang.weeks2020[globalConfig.lang][2], 'color2020w4');

            wrapperTableElem.appendChild(compareTableRowElem);
            wrapperTableElem.appendChild(tableRow2Elem);
            wrapperTableElem.appendChild(tableRow3Elem);
            wrapperTableElem.appendChild(tableRow4Elem);

          }
        })

        return wrapperTableElem;
      }

      return {
        jsonToTable: jsonToTable,
        updateKey: updateKey
      }

  })();


  function getDisplayTextWODay(s) {
    s = s+'';
    var currentDayIndex = sliderControl.getDayIndex()
    return (globalConfig.lang=='kr')? lang.days[globalConfig.lang][currentDayIndex] +'요일 '+ s[8]+s[9]+'시' : s[8]+s[9]+ ' ' + lang.days[globalConfig.lang][currentDayIndex];
  }

  initMap();


import lang from './lang'

function getTabData() {
  var minMaxData;
  var ageGroupData;
  var ageGroupUnit = 6;
  var tabData

  return fetch('./data/max_min.json')
  .then(res => res.json())
  .then(e => {
    minMaxData = e

    ageGroupData = Array(ageGroupUnit).fill().map((f,idx) => idx)
    .map((f,i) => ({
      layerName: 'age'+i,
      sourceName: 'tri'+i,
      min: e['a'+(i+1)+'0_min'],
      max: e['a'+(i+1)+'0_max'],
      legendTitle: lang.ageItems[globalConfig.lang][i],
      source:{
        type: 'GeoJSON',
        url: './geometries/tri_'+(i+1)+'.json'
      }}))

      tabData = [
        {
          value: 'total',
          displayText: lang.total[globalConfig.lang],
          data: [
            {
              layerName: 'dong',
              sourceName: 'hex',
              legendTitle: lang.total[globalConfig.lang],
              max: minMaxData.t_max,
              min: minMaxData.t_min,
              source: {
                type: 'GeoJSON',
                url: './geometries/hex.geojson'
              }
            }
          ]
        }, {
          value: 'sex',
          displayText: lang.sex[globalConfig.lang],
          data: [
            {
              layerName: 'male',
              sourceName: 'half_hex_0',
              legendTitle: lang.sexItems[globalConfig.lang][1],
              max: minMaxData.m_max,
              min: minMaxData.m_min,
              source: {
                type: 'GeoJSON',
                url: './geometries/half_hex_1.json'
              }
            },
            {
              layerName: 'female',
              sourceName: 'half_hex_1',
              legendTitle: lang.sexItems[globalConfig.lang][0],
              max: minMaxData.f_max,
              min: minMaxData.f_min,
              source: {
                type: 'GeoJSON',
                url: './geometries/half_hex_2.json'
              }
            }
          ]
        }, {
          value: 'age',
          displayText: lang.ages[globalConfig.lang],
          data: ageGroupData
        },
          {
          value: 'resident',
          displayText: lang.residence[globalConfig.lang],
          data: [
            {
              layerName: 'time_pop',
              sourceName: 'half_hex_0',
              legendTitle: lang.residenceItems[globalConfig.lang][0],
              max: 187456,
              min: 1866,
              source: {
                type: 'GeoJSON',
                url: './geometries/half-key0.geojson'
              }
            }
          , {
            layerName: 'time_2020_pop',
            sourceName: 'half_hex_1',
            legendTitle: lang.residenceItems[globalConfig.lang][1],
              max: 56121,
              min: 331,
            source: {
              type: 'GeoJSON',
              url: './geometries/half-key1.geojson'
            }
          }]
        }
      ]
      return tabData
  })
}


export default getTabData;
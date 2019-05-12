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
      legendTitle: (i+1)+'0대',
      source:{
        type: 'GeoJSON',
        url: './geometries/tri_'+(i+1)+'.json'
      }}))

      tabData = [
        {
          value: 'total',
          displayText: '전체',
          data: [
            {
              layerName: 'dong',
              sourceName: 'hex',
              legendTitle: '전체',
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
          displayText: '성별',
          data: [
            {
              layerName: 'female',
              sourceName: 'half_hex_0',
              legendTitle: '여성',
              max: minMaxData.f_max,
              min: minMaxData.f_min,
              source: {
                type: 'GeoJSON',
                url: './geometries/half_hex_1.json'
              }
            }
          , {
            layerName: 'male',
            sourceName: 'half_hex_1',
            legendTitle: '남성',
            max: minMaxData.m_max,
            min: minMaxData.m_min,
            source: {
              type: 'GeoJSON',
              url: './geometries/half_hex_2.json'
            }
          }]
        }, {
          value: 'age',
          displayText: '연령군별',
          data: ageGroupData
        },
          {
          value: 'resident',
          displayText: '주민등록인구와 비교해보기',
          data: [
            {
              layerName: 'time_pop',
              sourceName: 'half_hex_1',
              legendTitle: '생활인구',
              max: 187456,
              min: 1866,
              source: {
                type: 'GeoJSON',
                url: './geometries/half-key0.geojson'
              }
            }
          , {
            layerName: 'resident',
            sourceName: 'half_hex_0',
            legendTitle: '주민등록인구',
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
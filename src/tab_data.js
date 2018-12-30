var ageGroupUnit = 6;
var ageMaxMin = [[17996, 123],[60651, 177], [52536 ,317] , [41310,338],[24896,377],[16727,298]];
var ageGroupData = Array(ageGroupUnit).fill().map((f,idx) => idx)
                .map((f,i) => ({
                  layerName: 'age'+i,
                  sourceName: 'tri'+i,
                  min: ageMaxMin[i][1],
                  max: ageMaxMin[i][0],
                  legendTitle: (i+1)+'0대',
                  source:{
                    type: 'GeoJSON',
                    url: './geometries/triangle-key'+i+'.geojson'
                  }}))

var tabData = [
    {
      value: 'total',
      displayText: '전체',
      data: [
        {
          layerName: 'dong',
          sourceName: 'hex',
          legendTitle: '전체',
          max: 187456,
          min: 1866,
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
          sourceName: 'half_hex_1',
          legendTitle: '여성',
          max: 89808,
          min: 837,
          source: {
            type: 'GeoJSON',
            url: './geometries/half-key0.geojson'
          }
        }
      , {
        layerName: 'male',
        sourceName: 'half_hex_0',
        legendTitle: '남성',
        max: 99803,
        min: 1019,
        source: {
          type: 'GeoJSON',
          url: './geometries/half-key1.geojson'
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

export default tabData;
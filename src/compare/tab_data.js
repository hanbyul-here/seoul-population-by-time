import lang from './lang'

function getTabData() {
  var dates = ['20190304','20200309','20200316','20200323']
  var fileNames = ['total','f','m','a1','a2','a3','a4','a5','a6']


  var labels = [
    lang.total[globalConfig.lang],
    lang.sexItems[globalConfig.lang][0],
    lang.sexItems[globalConfig.lang][1],
    lang.ageItems[globalConfig.lang][0],
    lang.ageItems[globalConfig.lang][1],
    lang.ageItems[globalConfig.lang][2],
    lang.ageItems[globalConfig.lang][3],
    lang.ageItems[globalConfig.lang][4],
    lang.ageItems[globalConfig.lang][5]
  ]


  return fileNames.map((e, idx) => {
    return {
      value: e,
      displayText: labels[idx],
      files: dates.map(e => '/data/'+dates[idx]+'/'+e+'.json'),
      sceneFile: '/compare-year/compare-'+e+'.yaml'
    }
  })
}


export default getTabData;
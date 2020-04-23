import lang from './lang'

function getTabData() {
  var dates = ['20200302','20200309','20200316']
  var keyNames = ['t','f','m','a1','a2','a3','a4','a5','a6']
  var fileNames = ['total','f','m','a1','a2','a3','a4','a5','a6']
  var imageNames = ['total','female','male','a10','a20','a30','a40','a50','a60']


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


  return keyNames.map((e, idx) => {
    return {
      value: e,
      displayText: labels[idx],
      files: dates.map(e => '/data/'+e+'/'+fileNames[idx]+'.json'),
      sceneFile: '/compare-years/compare-'+e+'.yaml',
      imagePath2019: '/data/20190304/' +imageNames[idx]+'.png',
      imagePath2020_1:'/data/20200302/' +imageNames[idx]+'.png',
      imagePath2020_2:'/data/20200309/' +imageNames[idx]+'.png',
      imagePath2020_3:'/data/20200316/' +imageNames[idx]+'.png'
    }
  })
}


export default getTabData;
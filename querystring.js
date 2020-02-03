window.globalConfig = {lang: 'kr'}

function getQueryValue(str) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(str);
}

if (getQueryValue('lang')) {
  globalConfig.lang = getQueryValue('lang') ;
}
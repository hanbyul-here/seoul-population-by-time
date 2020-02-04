window.globalConfig = {lang: 'en'}

function getQueryValue(str) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(str);
}

if (getQueryValue('lang')) {
  if(getQueryValue('lang') === 'kr') globalConfig.lang = getQueryValue('lang') ;
}
function formatNumber(n) {
  var stringN = n+'';
  return stringN.split('').reverse().reduce((acc, curr, idx)=> {
    if(idx!== 0 && idx%3 ===0) acc.push(',')
    acc.push(curr)
    return acc
  },[]).reverse().join('')
}

export {
  formatNumber
}
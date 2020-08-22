const getStatus = (statCode) => {
  const numDigits = statCode.toString().length;
  if (numDigits !== 3)
    return 'not valid status code';

  if (statCode >= 200 && statCode < 400)
    return 'ok';

  return 'fail';
}

module.exports = { getStatus };
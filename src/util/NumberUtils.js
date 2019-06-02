const getRandomNumber = (min, max) => (
  Math.random() * (max - min) + min
);

const normalizeNumberString = numberStr => (
  // eslint-disable-next-line no-useless-escape
  numberStr.replace(/[R$\s\.]/gi, '').replace('.', '').replace(',', '.')
);

export { getRandomNumber, normalizeNumberString };

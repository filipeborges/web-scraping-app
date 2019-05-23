const getRandomNumber = (min, max) => (
  Math.random() * (max - min) + min
);

const normalizeNumberString = numberStr => (
  numberStr.replace(/[R$\s\.]/gi, '').replace('.', '').replace(',', '.')
);

export { getRandomNumber, normalizeNumberString };

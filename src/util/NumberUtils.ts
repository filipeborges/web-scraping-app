const getRandomNumber = (min: number, max: number) => (
  Math.random() * (max - min) + min
);

const normalizeNumberString = (numberStr: string) => (
  // eslint-disable-next-line no-useless-escape
  numberStr.replace(/[R$\s\.]/gi, '').replace('.', '').replace(',', '.')
);

export { getRandomNumber, normalizeNumberString };

const generateRandomNumbers = (min, max, count) => {
  const randomNumbers = [];

  for (let i = 0; i < count; i++) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    randomNumbers.push(randomNumber);
  }

  if (count === 1) {
    return randomNumbers[0]
  } else {
    return randomNumbers
  };
};

export { generateRandomNumbers }
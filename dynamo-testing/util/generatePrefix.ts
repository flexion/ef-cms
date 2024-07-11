export const generateUuidPairs = (charSet: string): string[] => {
  const chars = charSet;
  const pairs: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      pairs.push(chars[i] + chars[j]);
    }
  }

  return pairs;
};

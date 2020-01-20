const convertListToColonSeparatedString = (list: string[]) => {
  if (list.length < 1) {
    return '';
  } else {
    return list.reduce((acc, answer) => {
      return `${acc}:${answer}`;
    });
  }
};

const convertColonSeparatedStringToList = (s: string): string[] =>
  s.length < 1 ? [] : s.split(':');

export { convertColonSeparatedStringToList, convertListToColonSeparatedString };

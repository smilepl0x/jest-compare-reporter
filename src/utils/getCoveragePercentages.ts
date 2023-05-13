const getPercentage = (obj: Object) => {
  let total = 0;
  let covered = 0;

  for (const item of Object.values(obj)) {
    total++;
    item > 0 && covered++;
  }

  return ((covered * 100) / total)?.toFixed(2) ?? 0;
};

export const getCoveragePercentages = (previousCoverage: Object) => {
  const result = {};
  // this ugly
  for (const [key, value] of Object.entries(previousCoverage) as [
    string,
    { s: Number; f: Number; b: Number }
  ][]) {
    const [_, fileName] = key.split(process.cwd());
    Object.assign(result, {
      [fileName]: {
        s: getPercentage(value?.s || {}),
        f: getPercentage(value?.f || {}),
        b: getPercentage(value?.b || {}),
      },
    });
  }

  return result;
};

process.on("message", (message: Object) => {
  let percentages = getCoveragePercentages(message);
  process.send?.(percentages);
});

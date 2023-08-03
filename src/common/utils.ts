export const getDifferenceArray = (
  arrA: string[] = [],
  arrB: string[] = [],
) => {
  const differenceA = arrA.filter((item) => item && !arrB.includes(item));
  const differenceB = arrB.filter((item) => item && !arrA.includes(item));
  return {
    differenceA,
    differenceB,
  };
};

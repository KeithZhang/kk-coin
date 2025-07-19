export default function calculateTotal(amounts: string): number {
  const numbers = amounts
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter((item) => item !== '' && !isNaN(Number(item)))
    .map(item => parseFloat(item));
  return numbers.filter(num => !isNaN(num)).reduce((acc, curr) => acc + curr, 0);
}

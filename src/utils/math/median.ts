/**
 * This function returns the median value of given `values` array.
 *
 * IMPORTANT: this will change the ordering of the array!
 * @returns The median
 */
export default function median(values: number[]): number {
  if (values.length === 0) throw Error('Array cannot be empty')

  values.sort((a, b) => a - b)

  const middle = Math.floor(values.length / 2)
  return values[middle]
}

export default function pascalCase(str: string): string {
  const parts = str
    .split('.')
    .join('-').split('-')
    .join('_').split('_')

  const pascalCaseName = parts
    .map((word, idx) => idx !== 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join('');

  return pascalCaseName
}

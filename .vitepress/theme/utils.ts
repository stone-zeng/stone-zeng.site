export const arrayChunk = <T>(array: T[], size: number) => {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export const isArray = (value: any) => Array.isArray(value)

export const isDate = (value: any) => value instanceof Date

export const toTitle = (str: string) => str.replace('--', '\u{2013}')

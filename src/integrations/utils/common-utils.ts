
export const ifSet = (object: any , path: string) => {
  return path.split('.').reduce((obj, part) => obj && obj[part], object)
}

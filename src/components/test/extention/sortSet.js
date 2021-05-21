function sortSet(iterable=[]) {
  let array = [...iterable]
  array.sort()
  return new Set([...array])
}

export default sortSet
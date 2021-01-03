export function getTypeNames(types) {
  return types.map((type) => {
    const {
      node: { frontmatter: data },
    } = type

    return { fieldValue: data.fieldValue, ...data }
  })
}

export function mergeTypes(types, typesWithExtraInfo) {
  return typesWithExtraInfo.map((type, index) => {
    return { ...type, totalCount: types[index].totalCount }
  })
}

// color functions via https://codepen.io/jreyesgs/pen/MyKoRj
function subtractLight(color, amount) {
  const cc = parseInt(color, 16) - amount
  let c = cc < 0 ? 0 : cc
  c = c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`

  return c
}

export function darken(color, amount) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = parseInt((255 * amount) / 100)

  return (color = `#${subtractLight(
    color.substring(0, 2),
    amount
  )}${subtractLight(color.substring(2, 4), amount)}${subtractLight(
    color.substring(4, 6),
    amount
  )}`)
}

export function getTypeNames(types) {
  return types.map((cat) => {
    const {
      node: { frontmatter: type },
    } = cat

    return { fieldValue: type.fieldValue, name: type.name }
  })
}

export function mergeTypes(types, typesWithExtraInfo) {
  return typesWithExtraInfo.map((type, index) => {
    return { ...type, totalCount: types[index].totalCount }
  })
}

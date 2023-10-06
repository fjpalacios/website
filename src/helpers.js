const getTheme = () => {
  return document.body.classList.contains('dark') ? 'dark' : 'light'
}

const invertTheme = () => {
  return getTheme() === 'dark' ? 'light' : 'dark'
}

const saveTheme = (theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme)
  }
}

export const getSavedTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')

    return savedTheme === null ? 'dark' : savedTheme
  }

  return 'dark'
}

export const switchTheme = () => {
  const currentTheme = getTheme()
  const newTheme = invertTheme()

  document.body.classList.remove(currentTheme)
  document.body.classList.add(newTheme)

  saveTheme(newTheme)
}

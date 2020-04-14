const getTheme = (): string => {
  return document.body.classList.contains('dark') ? 'dark' : 'light'
}

const invertTheme = (): string => {
  return getTheme() === 'dark' ? 'light' : 'dark'
}

const saveTheme = (theme: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme)
  }
}

export const getSavedTheme = (): string => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')

    return savedTheme === null ? 'dark' : savedTheme
  }

  return 'dark'
}

export const switchTheme = (): void => {
  const currentTheme = getTheme()
  const newTheme = invertTheme()

  document.body.classList.remove(currentTheme)
  document.body.classList.add(newTheme)

  saveTheme(newTheme)
}

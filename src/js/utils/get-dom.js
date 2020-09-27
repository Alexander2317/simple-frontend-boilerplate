const MAX_LENGTH = 1

const getDOM = (name) =>
  document.querySelectorAll(name).length > MAX_LENGTH
    ? document.querySelectorAll(name)
    : document.querySelector(name)

export default getDOM

import { getDOM } from './utils'

const elements = {
  button: '.js-features-button',
  list: '.js-features',
}

const TEXTS = {
  show: 'Show list',
  hide: 'Hide list',
}

const CLASSES = {
  hide: 'hide',
}

const handleClick = (event) => {
  event.preventDefault()

  if (!getDOM(elements.list).classList.contains(CLASSES.hide)) {
    getDOM(elements.list).classList.add(CLASSES.hide)
    getDOM(elements.button).innerHTML = TEXTS.show
    return
  }
  getDOM(elements.list).classList.remove(CLASSES.hide)
  getDOM(elements.button).innerHTML = TEXTS.hide
}

const hideList = () =>
  getDOM(elements.button).addEventListener('click', handleClick)

export default hideList

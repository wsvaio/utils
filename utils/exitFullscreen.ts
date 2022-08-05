export default (elem?) => {
  elem ??= document;
  if (elem.cancelFullScreen) {
    elem.cancelFullScreen();
  } else if (elem.mozCancelFullScreen) {
    elem.mozCancelFullScreen();
  } else if (elem.webkitCancelFullScreen) {
    elem.webkitCancelFullScreen();
  } else if (elem.webkitExitFullScreen) {
    elem.webkitExitFullScreen();
  }
}
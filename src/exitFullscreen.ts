/**
 * 退出全屏模式
 * @param elem 全屏元素
 */
export const exitFullscreen = elem => {
	elem ||= document;
	if (elem.cancelFullScreen)
		elem.cancelFullScreen();

	else if (elem.mozCancelFullScreen)
		elem.mozCancelFullScreen();

	else if (elem.webkitCancelFullScreen)
		elem.webkitCancelFullScreen();

	else if (elem.webkitExitFullScreen)
		elem.webkitExitFullScreen();
};

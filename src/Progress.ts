/**
 * Progress  类是一个全局进度条，用于展示全局操作的进度。
 */
export class Progress {
	private timer: any = null;
	private num = 0;
	private el: HTMLDivElement = document.createElement("div");
	/**
	 * 进度条实例列表。
	 */
	private static list: Progress[] = [];
	private static css = `
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    width: 0%;
    transition: all 200ms ease 0s;
  `;

	/**
	 * 进度条颜色。
	 */
	static color = "rgba(64, 158, 255, 0.618)";
	/**
	 * 错误状态下的进度条颜色。
	 */
	static errColor = "rgba(245, 108, 108, 0.618)";
	/**
	 * 进度条高度。
	 */
	static height = "2px";

	static zIndex = 1000;
	/**
	 * 进度条最大值。
	 */
	static max = 95;
	/**
	 * 进度条速度。
	 */
	static speed = 10;
	/**
	 * 构造函数。
	 */
	constructor() {
		this.el.style.cssText = Progress.css;
		this.el.style.background = Progress.color;
		this.el.style.height = Progress.height;
		this.el.style.zIndex = String(Progress.zIndex);

		document.body.append(this.el);
		Progress.list.push(this);
		this.timer = setInterval(() => this.inc(), 500);
	}

	/**
	 * 增加进度。
	 */
	private inc() {
		this.num += ((Progress.max - this.num) / Progress.max) * Math.random() * Progress.speed;
		this.el.style.width = `${this.num}%`;
	}

	/**
	 * 销毁进度条。
	 *
	 * @param success 进度条销毁状态。为 true 时表示成功，为 false 时表示失败。
	 */
	destroy(success = true) {
		clearInterval(this.timer);
		this.el.style.width = "100%";
		if (!success) this.el.style.background = Progress.errColor;
		setTimeout(() => {
			this.el.style.opacity = "0";
		}, 200);
		setTimeout(() => {
			this.el.style.opacity = "0";
			document.body.removeChild(this.el);
		}, 400);
	}

	/**
	 * 启动全局进度条。
	 */
	static start() {
		// eslint-disable-next-line no-new
		new Progress();
	}

	/**
	 * 完成全局进度条。
	 *
	 * @param success 进度条完成状态。为 true 时表示成功，为 false 时表示失败。
	 */
	static done(success = true) {
		let progress = Progress.list.pop();
		if (progress) progress.destroy(success);
	}

	/**
	 * 清除所有全局进度条。
	 */
	static clear() {
		for (let progress of this.list) progress.destroy();
		this.list.length = 0;
	}
}

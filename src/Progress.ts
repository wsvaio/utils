// 全局进度条
export class Progress {
  private timer: any = null;
  private num = 0;
  private el: HTMLDivElement = document.createElement("div");

  private static list: Progress[] = [];
  private static css = `
    position: fixed;
    top: 0; left: 0;
    z-index: 1000;
    pointer-events: none;
    width: 0%;
    transition: all 200ms ease 0s;
  `;

  static color = "rgba(64, 158, 255, 0.618)";
  static errColor = "rgba(245, 108, 108, 0.618)";
  static height = "2px";

  static max = 95;
  static speed = 10;

  constructor() {
    this.el.style.cssText = Progress.css;
    this.el.style.background = Progress.color;
    this.el.style.height = Progress.height;
    document.body.append(this.el);
    Progress.list.push(this);
    this.timer = setInterval(() => this.inc(), 500);
  }

  private inc() {
    this.num += (Progress.max - this.num) / Progress.max * Math.random() * Progress.speed;
    this.el.style.width = `${this.num}%`;
  }

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

  static start() {
    // eslint-disable-next-line no-new
    new Progress();
  }

  static done(success = true) {
    let progress = Progress.list.pop();
    if (progress) progress.destroy(success);
  }

  static clear() {
    for (let progress of this.list) progress.destroy();
    this.list.length = 0;
  }
}

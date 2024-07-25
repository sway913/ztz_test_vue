import { BrowserWindow } from "electron"
import Skeleton from "./Skeleton"
import WebView from "./WebView"

export default class WebViewManager {
  webViewList: WebView[] = []
  skeleton: Skeleton
  win
  bounds

  constructor(win: BrowserWindow, bounds) {
    this.win = win
    this.bounds = bounds
    this.skeleton = new Skeleton(win, bounds)
  }

  addWebView(params) {
    this.webViewList.push(new WebView(this.win, params, this.bounds, this.skeleton))
    this.skeleton = new Skeleton(this.win, this.bounds)
  }

  showWebView(params) {
    this.webViewList.find((webView) => {
      if (webView.doesURLIncludeSubstring(params)) {
        webView.showWebView()
      }
    })
  }
  hideWebView(params) {
    this.webViewList.find((webView) => {
      if (webView.doesURLIncludeSubstring(params)) {
        webView.hideWebView()
      }
    })
  }
  removeAllWebViews() {
    this.webViewList.map((webView) => {
      webView.removeWebView()
    })
  }
  changeURL(params) {
    this.webViewList.find((webView) => {
      if (webView.doesURLIncludeSubstring(params)) {
        webView.changeURL()
      }
    })
  }
  refreshView(params) {
    this.webViewList.find((webView) => {
      if (webView.doesURLIncludeSubstring(params)) {
        webView.refreshView()
      }
    })
  }
}

# 这是一个网页截屏生成工具

    可以方便的使用url调用的形式, 生成网页截图
    
## 安装

注意: 最好使用cnpm安装package, 否则可能下载phantomjs失败.
```
git clone https://github.com/zhaishuaigan/web-screen.git web-screen
cd web-screen
cnpm install
node main.js
```

然后就可以在浏览器打开: `http://localhost:8000/screen?url=http://baidu.com&size=1024*768` 生成百度的截图
size是可选项, 后面是浏览器窗口 最小宽度 和 最小高度, 默认值是 1024 * 600.
如果要修改端口, 可编辑main.js中PORT变量的值.

## 实例
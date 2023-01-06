# pipe_project
###### tags: `portfolio`

# Flask 網頁版
### Deploy on Heroku at 2022.8.16
[Demo](https://pipe-project-333.herokuapp.com)


## 最新版本(網頁版)執行畫面
添加關聯式下拉表單
![](https://i.imgur.com/DAFdlWb.png)

## 說明：
![](https://i.imgur.com/zh4wjYr.jpg)
### 照著上面說明圖的例子計算：
![](https://i.imgur.com/OoGcNcw.png)
### 按下submit，會在下面顯示出能用來包覆的pipe管：
![](https://i.imgur.com/yPLuSPJ.png)
### 它的推薦形式是要「至少」哪個管(pipe)以上



# tkinter 應用程式(exe)版
下載 資料夾 pipe_tkinter 後 進去
打上 

pyinstaller -F -w -i [icon 絕/對/路/徑]/pyi_icon.ico cal_pipe_gui.py

將原始檔案包裝成 應用程式 EXE 檔來使用

## 執行畫面
![](https://i.imgur.com/MMf1GZL.png)

## 將 Flask 版本 用 PYINSTALLER 包裝成 EXE 檔
指令:
pyinstaller -F -i pyi_icon.ico --add-data="templates;templates"  app.py

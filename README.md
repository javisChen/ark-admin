# 启动开发环境
建议统一使用nvm管理node版本

## 安装nvm（Mac OS）
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
安装后source下配置
```shell
source ~/.zshrc
```
验证是否是否安装成功
```shell
nvm -v

0.39.7 返回版本号表示成功
```
## 安装Node（v16.20.2）

```shell
nvm install v16.20.2

```
耐心等下，看到以下信息即可
```shell
Downloading and installing node v16.20.2...
Downloading https://nodejs.org/dist/v16.20.2/node-v16.20.2-darwin-arm64.tar.xz...
############################################################################################################################################################################################## 100.0%
Computing checksum with shasum -a 256
Checksums matched!
Now using node v16.20.2 (npm v8.19
```

为了更好地管理依赖，建议重新设置全局包存放地址，参考以下
```shell
npm config set prefix "/to/path/npm_global"    
        
npm config set cache "/to/path/npm_cache"
```
## 全局安装Yarn
```shell
npm i -g yarn
```

## 安装项目依赖
```shell
yarn install
```

## 启动项目
```shell
yarn serve
```
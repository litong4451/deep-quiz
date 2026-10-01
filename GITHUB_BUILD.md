# 深题 - APK 一键构建方案

## 🚀 方案：推送到 GitHub，自动构建 APK

我已经为你准备好了 GitHub Actions 配置！只需三步：

### 1. 推送到 GitHub
```bash
cd /workspace
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

### 2. 开启自动构建
在 GitHub 仓库的 Actions 标签页，你会看到 "Build Android APK" 工作流正在运行！

### 3. 下载 APK
构建完成后（约 5-10 分钟）：
- 点击 Actions 页面的最新构建记录
- 在 Artifacts 区域下载 `deep-quiz-apk`
- 解压得到 `app-debug.apk`，直接安装到手机！

## 📁 我为你准备的文件
- `.github/workflows/build-apk.yml` - GitHub Actions 自动构建配置
- `android/` - 完整的 Android 项目
- `APK_BUILD_GUIDE.md` - 本地构建详细指南
- `SIMPLE_BUILD.md` - 其他在线打包方案

## 🎉 就这么简单！
你只需把代码推到 GitHub，GitHub 免费的服务器会自动帮你下载所有依赖、编译项目、打包成 APK！

# 深题 Android APK 构建指南

## 项目已准备好！

我已经为你准备好了完整的 Android 项目，你可以在自己的电脑上构建 APK。

## 前置要求

1. **Node.js (建议 v16 或更高版本)
2. **JDK 17** 或更高版本
3. **Android Studio** (最新稳定版
4. **Git**

## 构建步骤

### 1. 安装依赖
在自己的电脑上克隆/下载项目，然后运行：

```bash
cd /workspace
npm install
```

### 2. 构建 Web 应用
```bash
npm run build
npx cap sync
```

### 3. 打开 Android Studio 构建
有两种方法：

#### 方法一：使用 Android Studio（推荐）

1. 打开 Android Studio
2. 选择 "Open an Existing Project"
3. 选择 `/workspace/android` 文件夹
4. Android Studio 会自动同步项目和下载依赖
5. 等待同步完成（首次可能需要 5-10 分钟）
6. 点击菜单：Build → Build Bundle(s) / APK(s) → Build APK(s)
7. APK 会生成在：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 方法二：使用命令行

1. 确保已安装 Android SDK 和 JDK 17+
2. 在项目根目录运行：

```bash
cd android
./gradlew assembleDebug
```

APK 将生成在：`android/app/build/outputs/apk/debug/app-debug.apk`

### 4. 生成发布版 APK（可选）

如果你想要正式发布版本：

```bash
cd android
./gradlew assembleRelease
```

发布版 APK 在：`android/app/build/outputs/apk/release/app-release.apk`

## 项目文件说明

```
/workspace/
├── src/                  # React 源码
├── dist/                 # 构建后的 Web 文件
├── android/              # Android 原生项目
│   └── app/
│       └── src/
│           └── main/
│               ├── assets/   # Web 资源
│               ├── java/   # Java 源码
│               └── res/  # 图标、资源文件
├── capacitor.config.json # Capacitor 配置
└── package.json        # 项目配置
```

## 安装到手机

1. 在手机上启用"允许安装未知来源应用
2. 传输 APK 文件到手机
3. 点击安装
4. 打开深题，开始使用！

## 常见问题

**Gradle 下载慢？**
- 在 `gradle.properties` 添加国内镜像源，或使用 Android Studio 自带的 Gradle 配置

**Android SDK 问题？**
- 使用 Android Studio SDK Manager 安装需要的 SDK 版本

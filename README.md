# 深题（deep-quiz）

一款专注于深度学习的背题应用。支持 Web / Android / 桌面端，随时随地刷题复习。

## 用户指南

### 功能介绍

- 题库管理：添加题目、分类组织
- 多种题型：单选（答案点选）、简答、判断
- 做题模式：翻卡复习 + 下一题快速切换

### 获取深题

Android 用户请在 GitHub Releases 页面下载最新 APK：

> **Releases**：https://github.com/litong4451/deep-quiz/releases

下载 `deep-quiz-{版本}.apk` 安装即可。测试版本号带有 `-beta` 标记。

---

## 开发者指南

### 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React + Vite |
| 移动端 | Capacitor（Android） |
| 桌面端 | Electron |
| CI/CD | GitHub Actions |

### 本地开发

```bash
npm install
npm run dev        # 启动 Vite 开发服务器
npm run build      # 构建 Web 产物到 dist/
npx cap sync android && cd android && ./gradlew assembleDebug   # 本地构建 APK
```

### 自动构建与发版

推送到 `main` 分支即自动完成全链路，无需本地 Android 环境：

1. 读取 `package.json` 的 `version` 作为版本唯一来源
2. 自动写入 Android `versionName` / `versionCode`（versionCode = git 提交总数，自动递增）
3. 构建 APK
4. 自动打 tag `v{version}`（已存在则跳过）
5. 自动发布 GitHub Release，上传 `deep-quiz-{version}.apk`

版本含 `-beta` / `-alpha` / `-rc` / `-pre` 时，Release 自动标记为测试版（prerelease）。

### 发版操作

修改 `package.json` 的 `version`（如 `1.1.0`）→ 推送 main → CI 自动完成构建 / 打 tag / 发布 Release：

```bash
git add package.json && git commit -m "release: 1.1.0" && git push
```

详细版本规范见 [VERSIONING.md](VERSIONING.md)。

### 项目结构

```
├── src/                     # React 应用源码
├── android/                 # Android 原生工程（Capacitor）
├── electron/                # Electron 桌面端
├── dist/                    # Web 构建产物
├── .github/workflows/       # CI 自动构建 + 自动发版
├── VERSIONING.md            # 版本规范
├── capacitor.config.json    # Capacitor 配置
└── package.json             # 项目配置（版本唯一来源）
```


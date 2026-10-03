# 深题（deep-quiz）版本规范

## 版本号格式

```
v{major}.{minor}.{patch}[-{suffix}]
```

- `major.minor.patch`：语义化版本（SemVer），`package.json` 的 `version` 字段为唯一事实来源
- `suffix`：可选的档位或发布阶段后缀，参与 tag 与产物命名

## 产品档位（收费规划）

| 档位 | 版本号示例 | 定位 | 定价 |
|---|---|---|---|
| Lite 精简版 | `1.0.0-lite` | 基础免费，核心背题功能 | 免费 |
| 常规版（标准版） | `1.0.0` | 标准功能，覆盖日常使用 | 待定 |
| Pro 专业版 | `1.0.0-pro` | 付费增强：高级题库 / 统计 / 同步 | 待定 |
| Max 旗舰版 | `1.0.0-max` | 全功能解锁，含全部增值服务 | 待定 |
| Pro Max 顶配版 | `1.0.0-pro-max` | 全功能 + 终身权益 / 专属支持 | 待定 |

> 定价确认后由产品侧填写，命名梯度与代码解耦，后续调整不影响发版链路。

## 发布阶段

| 阶段 | 后缀 | Release 类型 |
|---|---|---|
| 测试版 | `-beta` | prerelease（测试版） |
| 内测版 | `-alpha` | prerelease |
| 候选版 | `-rc` / `-pre` | prerelease |
| 正式版 | 无（或档位后缀） | 正式版 |

## CI 自动发版逻辑（.github/workflows/build-apk.yml）

1. 单一版本来源：读取 `package.json` 的 `version`
2. 自动写入 Android 版本号：
   - `versionName` = `package.json` version
   - `versionCode` = git 提交总数（`git rev-list --count HEAD`，随提交自动递增）
3. 构建 APK
4. 自动打 tag：`v{version}`（已存在则跳过）
5. 自动发布 Release：上传重命名产物 `deep-quiz-{version}.apk`
   - 版本含 `-beta` / `-alpha` / `-rc` / `-pre` 时自动标记为 prerelease

## 发版流程（唯一操作）

1. 修改 `package.json` 的 `version`（如 `1.0.0-pro`）
2. 推送 main 分支
3. CI 自动完成：写入版本号 → 构建 → 打 tag → 发布 Release + 产物

无需手动维护 `versionCode`、tag 或 Release。

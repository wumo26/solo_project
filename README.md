# solo_project

Angular 前端與 Spring Boot 後端的整合專案。

```text
solo_project/
├── solo_project_front_end/   # Angular 19
├── solo_project_backend_end/ # Spring Boot 3.2.4 / Java 21
├── config/                  # 本機設定與可提交的範例
├── docs/操作流程.md
├── build.gradle
├── settings.gradle
└── gradlew.bat
```

使用 IntelliJ IDEA 的 File → Open 開啟整個 `solo_project` 資料夾，以根目錄的 Gradle 設定匯入，Project SDK 與 Gradle JVM 選擇 Java 21。

## 本機設定

第一次從 GitHub 下載時，複製 `config/application-local.properties.example` 為 `config/application-local.properties`，填入資料庫密碼與自己的隨機 JWT 金鑰（至少 32 個 UTF-8 bytes）。實際設定檔不會提交到 Git。也可以不建立此檔，改用 `DB_PASSWORD` 與 `JWT_SECRET` 環境變數。

整合當下這台電腦的本機設定已保留。預設 MySQL 連線為 `localhost:3306/quiz1150512`，使用者 `root`；需要時可在本機設定檔覆寫 `spring.datasource.url` 和 `spring.datasource.username`。本儲存庫不包含資料庫資料或匯出檔，換電腦需另外準備資料庫結構與資料。

## 啟動

在專案根目錄的 PowerShell 啟動後端：

```powershell
.\gradlew.bat :solo_project_backend_end:bootRun
```

另開一個 Terminal，啟動前端：

```powershell
cd .\solo_project_front_end
npm.cmd ci
npm.cmd start
```

前端：http://localhost:4200；後端：http://localhost:8080。前端 `/api` 請求透過 `proxy.conf.json` 轉送至後端。前端套件已安裝時，不必每次執行 `npm.cmd ci`。

## 編譯驗證

```powershell
.\gradlew.bat :solo_project_backend_end:classes :solo_project_backend_end:testClasses
cd .\solo_project_front_end
npm.cmd run build
```

完整的資料夾整合、IntelliJ 開啟、Git 首次上傳與日常更新方式，請見 [操作流程](docs/操作流程.md)。

# 造句小劇場 · Crea tu Historia

課堂用小遊戲（repo：`crea-tu-historia`）：老師按「抽選」，隨機出現一張**圖片卡**和一個**語法點**，學生用它們造句。
介面和語法點只有繁體／簡體（右上角切換）。

- Firebase 專案：**memorma-24dab**（連線房間用，集合 `sentence_rooms`）
- 語法點資料：《當代中文課程》Book 1–6 共 541 點，精簡自 `Generador-de-ejercicios` 的 `grammar-data.js`

## 兩個玩法

1. **造句抽選**：抽圖片＋語法點，學生造一個句子。老師端多一塊「老師專用」（例句建議、教材例句、圖片可用詞），學生端看不到。
2. **編故事**：老師輸入一個句子，抽一張圖片，學生要想一個短故事並用到這個句子，可設 1／2／3／5 分鐘倒數。

## 怎麼用

- **單機**：老師直接用，投影或分享畫面給學生。
- **連線**：老師按「開啟連線」→ 得到 4 位數房號 → 學生用手機打開同一個網址，按「我是學生」輸入房號。老師抽選後，學生手機同步出現卡片和倒數。
- 老師設定（存在這台裝置）：選冊／程度、勾選或取消個別語法點、自訂語法點（可打繁體或簡體，會自動轉兩種字形）、勾選要抽的圖片、抽過不重複。

## 老師專用內容怎麼來

不用 AI。`tools/content-src.js` 裡，每個語法點（用標題比對）配 5 張圖各一句例句，`node tools/build.js` 轉成簡體並產生：

- `content.js`：圖片清單（學生端也會載入）
- `hints.js`：例句建議（**只有老師端才會載入**）

目前 541 個語法點裡有 281 個配到圖片例句（Book 1 全部、Book 2 約 93%、Book 3 約 65%），其餘顯示教材例句＋圖片可用詞。沒配到的清單在 `tools/unmatched.txt`。

> 因為 repo 是公開的，有心的學生仍可在 GitHub 上看到 `hints.js`；網頁本身不會把它給學生端。

## 新增圖片

1. 把圖放進 `images/`（任何 4:3 的 svg／jpg／png，建議 800×600）。
2. 在 `tools/content-src.js` 的 `IMAGES` 和 `ORDER` 加上這張圖，並在每一列 `R` 最後補一句（要配一張新圖就要補一欄）。
3. `cd tools && npm install && node build.js`

## 連線設定（第一次要做）

把 `firestore-rules-sentence_rooms.txt` 的內容貼進 memorma-24dab 的 Firestore 規則並發布。沒貼之前，「開啟連線」會失敗，單機模式不受影響。

測試用：網址加 `?local=1`，同一個瀏覽器的不同分頁可以當老師和學生（不用網路）。

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 整個遊戲（老師端、學生端、設定、連線） |
| `content.js` / `hints.js` | 由 `tools/build.js` 產生，不要手改 |
| `grammar-lite.js` | 語法點精簡資料（老師端才載入） |
| `images/*.svg` | 5 張圖片卡 |
| `firestore-rules-sentence_rooms.txt` | 連線房間的 Firestore 規則 |

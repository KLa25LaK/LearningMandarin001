# GitHub 上傳與手機看圖片

## 你的網站目前問題（LearningMandarin001）

網頁要找：`images/coco-xxx.png`  
GitHub 上現在：圖片在**根目錄**，且**只有 1 張** `coco-fenjiao.png`。

請依下方步驟建立 `images` 資料夾並上傳 **5 張** 圖。

測試連結（修好後應能開圖）：
https://kla25lak.github.io/LearningMandarin001/images/coco-shuangxiangpao.png

---

## 資料夾結構（一定要這樣）

```
chinese-cours-jour/          ← 你的 repository 根目錄
├── index.html
└── images/                  ← 不能少！
    ├── coco-shuangxiangpao.png
    ├── coco-sanxiongdi.png
    ├── coco-sijizhenyeqing.png
    ├── coco-yutou.png
    └── coco-fenjiao.png
```

若 GitHub 上**只有** `index.html`、沒有 `images` 資料夾，手機與電腦都會看不到 CoCo 飲料圖。

---

## 上傳步驟

### 方法一：網頁上傳

1. 打開 GitHub 你的 repository
2. 點 **Add file** → **Upload files**
3. 把整個 **`images` 資料夾**（裡面 5 張 `.png`）和 **`index.html`** 一起拖進去
4. 確認網頁上能看到路徑：`images/coco-shuangxiangpao.png` 等
5. **Commit changes**

### 方法二：終端機（若已安裝 git）

```bash
cd chinese-cours-jour
git add index.html images/
git commit -m "Add index and drink images"
git push
```

---

## 開啟 GitHub Pages（網址給學生用手機開）

1. Repository → **Settings** → **Pages**
2. **Source**：Deploy from a branch
3. **Branch**：`main`（或 `master`），資料夾選 **`/ (root)`**
4. 儲存後等 1～3 分鐘
5. 網址會像：`https://你的帳號.github.io/仓库名稱/`

**請用這個 Pages 網址**，不要用：

- `raw.githubusercontent.com/...`（那是下載檔，不是網站）
- 只在本機「檔案」預覽

---

## 手機測試圖片是否正常

在 Safari 直接開（把網址換成你的）：

`https://你的帳號.github.io/仓库名稱/images/coco-shuangxiangpao.png`

- **有顯示圖** → 路徑正確，回主頁點主題二 CoCo 區即可
- **404** → `images` 沒推上 GitHub，或檔名大小寫不一致（必須全小寫，與上表相同）

---

## 常見錯誤

| 狀況 | 原因 |
|------|------|
| 電腦有圖、手機沒圖 | 多半開錯網址，或快取；用手機 Safari 開 Pages 完整網址 |
| 全部破圖 | `images` 資料夾沒上傳到 GitHub |
| 只有部分破圖 | 檔名打錯（GitHub 區分大小寫） |
| 發音沒聲音 | 要用 **https** 的 Pages 網址，不要用檔案預覽 |

---

## 檔名對照（請勿改名）

| 檔案 | 飲料 |
|------|------|
| `coco-shuangxiangpao.png` | 百香雙響炮 |
| `coco-sanxiongdi.png` | 奶茶三兄弟 |
| `coco-sijizhenyeqing.png` | 四季珍椰青 |
| `coco-yutou.png` | 芋頭西谷米牛奶 |
| `coco-fenjiao.png` | 粉角檸檬冬瓜 |

/* 月刊ぴあん — 号のデータ（バックナンバーの一覧はここが元になります）
 *
 * ■ 新しい号を足すときの手順
 *   1) 原本PDFを共有ドライブの「⑤ ぴあんチラシ」に置く
 *        あとりえチラシ_2026年09月.pdf / にじいろチラシ_2026年09月.pdf
 *   2) ページ画像に変換する（両事業所まとめて）
 *        python tools/add_issue.py --ym 2026-09
 *   3) このファイルの issues 配列の「先頭」に、下と同じ形で1件足す
 *      （src / w / h は 2) が表示するJSONをそのまま使えます）
 *   4) 保存して push すれば、サイトに新しい号が並びます
 *
 * ■ sec（ページの種類）に使える値
 *   cover=表紙 / schedule=スケジュール / subject=きょうかかだい
 *   meditation=めいそうかだい / main=メインかだい
 *   other=1枚に複数の課題がまとまった以前の形式（2026年3月以前の号）
 *
 * ■ crop（任意）
 *   下が余白だけのページで、上から何割を見せるか（0.5＝上半分）。
 *   隠した部分は画面では見られなくなるので、余白だけのページにしか使いません。
 *   （「いんさつ・PDFでほぞん」では全体が出ます）
 */
window.PIAN = {
  brands: {
    atelier: { key: "atelier", name: "あとりえくれよん", en: "ATELIER", href: "index.html" },
    nijiiro: { key: "nijiiro", name: "にじいろくれよん", en: "NIJIIRO", href: "nijiiro.html" }
  },
  issues: [
    {
      id: "2026-08", year: 2026, month: 8,
      label: "2026年8月号", short: "8月号",
      brands: {
        atelier: {
          catch: "はなびが ドン！ こころが パッ！",
          note: "",
          thumb: {"src": "images/2026-08/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-08/atelier/p1.webp", "w": 1600, "h": 2264, "sec": "cover", "title": "表紙", "sub": "2026年8月号"},
            {"src": "images/2026-08/atelier/p2.webp", "w": 1600, "h": 2264, "sec": "subject", "title": "さまことば", "sub": "きょうかかだい ①〜⑤週目"},
            {"src": "images/2026-08/atelier/p3.webp", "w": 1600, "h": 2264, "sec": "meditation", "title": "戦士のポーズでホッとタイム", "sub": "めいそうかだい ①〜⑤週目"},
            {"src": "images/2026-08/atelier/p4.webp", "w": 1600, "h": 2264, "sec": "main", "title": "うちわ", "sub": "メインかだい ①週目"},
            {"src": "images/2026-08/atelier/p5.webp", "w": 1600, "h": 2264, "sec": "main", "title": "たまつむバランス", "sub": "メインかだい ②週目"},
            {"src": "images/2026-08/atelier/p6.webp", "w": 1600, "h": 2264, "sec": "main", "title": "おめめをきたえよう選手権", "sub": "メインかだい ③週目"},
            {"src": "images/2026-08/atelier/p7.webp", "w": 1600, "h": 2264, "sec": "main", "title": "この音はなんだろう？選手権", "sub": "メインかだい ④週目"},
            {"src": "images/2026-08/atelier/p8.webp", "w": 1600, "h": 2264, "sec": "schedule", "title": "8月のメイン課題スケジュール", "sub": "1か月のよてい", "crop": 0.5}
          ]
        },
        nijiiro: {
          catch: "はなびが ドン！ こころが パッ！",
          note: "8月13日・14日はお盆休みです。",
          thumb: {"src": "images/2026-08/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-08/nijiiro/p1.webp", "w": 1600, "h": 2264, "sec": "cover", "title": "表紙", "sub": "2026年8月号"},
            {"src": "images/2026-08/nijiiro/p2.webp", "w": 1600, "h": 2264, "sec": "subject", "title": "あしざん", "sub": "きょうかかだい ①〜④週目"},
            {"src": "images/2026-08/nijiiro/p3.webp", "w": 1600, "h": 2264, "sec": "meditation", "title": "ふきあげパイプでホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-08/nijiiro/p4.webp", "w": 1600, "h": 2264, "sec": "main", "title": "衣類のお片付け1", "sub": "メインかだい ①週目"},
            {"src": "images/2026-08/nijiiro/p5.webp", "w": 1600, "h": 2264, "sec": "main", "title": "ストライクＡＳＩＡ", "sub": "メインかだい ②週目"},
            {"src": "images/2026-08/nijiiro/p6.webp", "w": 1600, "h": 2264, "sec": "main", "title": "衣類のお片付け2", "sub": "メインかだい ③週目"},
            {"src": "images/2026-08/nijiiro/p7.webp", "w": 1600, "h": 2264, "sec": "main", "title": "うちわ", "sub": "メインかだい ④週目"},
            {"src": "images/2026-08/nijiiro/p8.webp", "w": 1600, "h": 2264, "sec": "schedule", "title": "8月のメイン課題スケジュール", "sub": "1か月のよてい", "crop": 0.5}
          ]
        }
      }
    },
    {
      id: "2026-07", year: 2026, month: 7,
      label: "2026年7月号", short: "7月号",
      brands: {
        atelier: {
          catch: "",
          note: "①週目は6月の続き（はたらく細胞シアター2）です。",
          thumb: {"src": "images/2026-07/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-07/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年7月号"},
            {"src": "images/2026-07/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "subject", "title": "あしざん", "sub": "きょうかかだい ②〜⑤週目"},
            {"src": "images/2026-07/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "meditation", "title": "ふきあげパイプでホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-07/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "main", "title": "ゴムバンド", "sub": "メインかだい ②週目"},
            {"src": "images/2026-07/atelier/p5.webp", "w": 1600, "h": 2263, "sec": "main", "title": "マグネット", "sub": "メインかだい ③週目"},
            {"src": "images/2026-07/atelier/p6.webp", "w": 1600, "h": 2263, "sec": "main", "title": "衣類のお片付け（Tシャツたたみリレー）", "sub": "メインかだい ④週目"},
            {"src": "images/2026-07/atelier/p7.webp", "w": 1600, "h": 2263, "sec": "main", "title": "衣類のお片付け（衣類たたみリレー）", "sub": "メインかだい ⑤週目"},
            {"src": "images/2026-07/atelier/p8.webp", "w": 1600, "h": 2263, "sec": "schedule", "title": "7月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-07/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-07/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年7月号"},
            {"src": "images/2026-07/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "subject", "title": "ヨメルかな", "sub": "きょうかかだい ②〜⑤週目"},
            {"src": "images/2026-07/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "meditation", "title": "ボディスキャンでホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-07/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "main", "title": "キャプテン・リノ", "sub": "メインかだい ①週目"},
            {"src": "images/2026-07/nijiiro/p5.webp", "w": 1600, "h": 2263, "sec": "main", "title": "イラスト（おさかな）", "sub": "メインかだい ②週目"},
            {"src": "images/2026-07/nijiiro/p6.webp", "w": 1600, "h": 2263, "sec": "main", "title": "ポストカード（スイーツ）", "sub": "メインかだい ③週目"},
            {"src": "images/2026-07/nijiiro/p7.webp", "w": 1600, "h": 2263, "sec": "main", "title": "はたらく細胞シアター", "sub": "メインかだい ④〜⑤週目"},
            {"src": "images/2026-07/nijiiro/p8.webp", "w": 1600, "h": 2263, "sec": "schedule", "title": "7月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2026-06", year: 2026, month: 6,
      label: "2026年6月号", short: "6月号",
      brands: {
        atelier: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-06/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-06/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年6月号"},
            {"src": "images/2026-06/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "subject", "title": "ヨメルかな", "sub": "きょうかかだい ①〜⑤週目"},
            {"src": "images/2026-06/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "meditation", "title": "ボディスキャンでホッとタイム", "sub": "めいそうかだい ①〜⑤週目"},
            {"src": "images/2026-06/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "main", "title": "イラスト（おさかな）", "sub": "メインかだい ①週目"},
            {"src": "images/2026-06/atelier/p5.webp", "w": 1600, "h": 2263, "sec": "main", "title": "ポストカード（スイーツ）", "sub": "メインかだい ②週目"},
            {"src": "images/2026-06/atelier/p6.webp", "w": 1600, "h": 2263, "sec": "main", "title": "キャプテン・リノ", "sub": "メインかだい ③週目"},
            {"src": "images/2026-06/atelier/p7.webp", "w": 1600, "h": 2263, "sec": "main", "title": "はたらく細胞シアター", "sub": "メインかだい ④〜⑤週目"},
            {"src": "images/2026-06/atelier/p8.webp", "w": 1600, "h": 2263, "sec": "schedule", "title": "6月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-06/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-06/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年6月号"},
            {"src": "images/2026-06/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "subject", "title": "ラインナップゲーム（山）", "sub": "きょうかかだい ①〜⑤週目"},
            {"src": "images/2026-06/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "meditation", "title": "かたをまわしてホッとタイム", "sub": "めいそうかだい ①〜⑤週目"},
            {"src": "images/2026-06/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "main", "title": "クラスター", "sub": "メインかだい ①週目"},
            {"src": "images/2026-06/nijiiro/p5.webp", "w": 1600, "h": 2263, "sec": "main", "title": "なかまを知ろう", "sub": "メインかだい ②〜③週目"},
            {"src": "images/2026-06/nijiiro/p6.webp", "w": 1600, "h": 2263, "sec": "main", "title": "紙飛行機バトル", "sub": "メインかだい ④週目"},
            {"src": "images/2026-06/nijiiro/p7.webp", "w": 1600, "h": 2263, "sec": "main", "title": "キャプテン・リノ", "sub": "メインかだい ⑤週目"},
            {"src": "images/2026-06/nijiiro/p8.webp", "w": 1600, "h": 2263, "sec": "schedule", "title": "6月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2026-05", year: 2026, month: 5,
      label: "2026年5月号", short: "5月号",
      brands: {
        atelier: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-05/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-05/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年5月号"},
            {"src": "images/2026-05/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "subject", "title": "ラインナップゲーム（山）", "sub": "きょうかかだい ②〜⑤週目"},
            {"src": "images/2026-05/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "meditation", "title": "かたをまわしてホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-05/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "main", "title": "おめめをきたえよう選手権", "sub": "メインかだい ①週目"},
            {"src": "images/2026-05/atelier/p5.webp", "w": 1600, "h": 2263, "sec": "main", "title": "クラスター", "sub": "メインかだい ②週目"},
            {"src": "images/2026-05/atelier/p6.webp", "w": 1600, "h": 2263, "sec": "main", "title": "なかまを知ろう", "sub": "メインかだい ③〜④週目"},
            {"src": "images/2026-05/atelier/p7.webp", "w": 1600, "h": 2263, "sec": "main", "title": "紙飛行機バトル", "sub": "メインかだい ⑤週目"},
            {"src": "images/2026-05/atelier/p8.webp", "w": 1600, "h": 2263, "sec": "schedule", "title": "5月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-05/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-05/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年5月号"},
            {"src": "images/2026-05/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "subject", "title": "さまことば", "sub": "きょうかかだい ②〜⑤週目"},
            {"src": "images/2026-05/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "meditation", "title": "フラミンゴでホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-05/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "main", "title": "ストライクＡＳＩＡ", "sub": "メインかだい ②週目"},
            {"src": "images/2026-05/nijiiro/p5.webp", "w": 1600, "h": 2263, "sec": "main", "title": "壁面アート（にじいろの木 2026）", "sub": "メインかだい ③週目"},
            {"src": "images/2026-05/nijiiro/p6.webp", "w": 1600, "h": 2263, "sec": "main", "title": "すごろく", "sub": "メインかだい ④週目"},
            {"src": "images/2026-05/nijiiro/p7.webp", "w": 1600, "h": 2263, "sec": "main", "title": "おめめをきたえよう選手権", "sub": "メインかだい ⑤週目"},
            {"src": "images/2026-05/nijiiro/p8.webp", "w": 1600, "h": 2263, "sec": "schedule", "title": "5月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2026-04", year: 2026, month: 4,
      label: "2026年4月号", short: "4月号",
      brands: {
        atelier: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-04/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-04/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年4月号"},
            {"src": "images/2026-04/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "subject", "title": "さまことば", "sub": "きょうかかだい ②〜⑤週目"},
            {"src": "images/2026-04/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "meditation", "title": "フラミンゴでホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-04/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "main", "title": "壁面アート（にじいろの木 2026）", "sub": "メインかだい ②週目"},
            {"src": "images/2026-04/atelier/p5.webp", "w": 1600, "h": 2263, "sec": "main", "title": "すごろく", "sub": "メインかだい ③週目"},
            {"src": "images/2026-04/atelier/p6.webp", "w": 1600, "h": 2263, "sec": "main", "title": "たまつむバランス", "sub": "メインかだい ④週目"},
            {"src": "images/2026-04/atelier/p7.webp", "w": 1600, "h": 2263, "sec": "main", "title": "おめめをきたえよう選手権", "sub": "メインかだい ⑤週目"},
            {"src": "images/2026-04/atelier/p8.webp", "w": 1600, "h": 2263, "sec": "schedule", "title": "4月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "この号は、1枚に複数の課題がまとまった以前の形式です。",
          thumb: {"src": "images/2026-04/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-04/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年4月号"},
            {"src": "images/2026-04/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "インク de リンク／ストローでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-04/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "アートセラピー2・マスキングテープアート", "sub": "メインかだい"},
            {"src": "images/2026-04/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "聞き上手になろう／4月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    }
  ]
};

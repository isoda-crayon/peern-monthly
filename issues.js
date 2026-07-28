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
          note: "",
          thumb: {"src": "images/2026-04/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-04/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年4月号"},
            {"src": "images/2026-04/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "インク de リンク／ストローでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-04/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "アートセラピー2・マスキングテープアート", "sub": "メインかだい"},
            {"src": "images/2026-04/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "聞き上手になろう／4月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2026-03", year: 2026, month: 3,
      label: "2026年3月号", short: "3月号",
      brands: {
        atelier: {
          catch: "",
          note: "3月20日はお休みです。",
          thumb: {"src": "images/2026-03/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-03/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年3月号"},
            {"src": "images/2026-03/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "インク de リンク・ストローでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-03/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "聞き上手になろう1・聞き上手になろう2・クラスター", "sub": "メインかだい"},
            {"src": "images/2026-03/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "イラスト・リレーアート・3月のメイン課題スケジュール", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "3月20日はお休みです。",
          thumb: {"src": "images/2026-03/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-03/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年3月号"},
            {"src": "images/2026-03/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ワードバスケット・ゆるめてホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-03/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "たまつむバランス・ストライクASIA・この音はなんだろう？選手権", "sub": "メインかだい"},
            {"src": "images/2026-03/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "アートセラピー・3月のメイン課題スケジュール", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2026-02", year: 2026, month: 2,
      label: "2026年2月号", short: "2月号",
      brands: {
        atelier: {
          catch: "",
          note: "2月11日・23日はお休みです。",
          thumb: {"src": "images/2026-02/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-02/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年2月号"},
            {"src": "images/2026-02/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ワードバスケット・ゆるめてホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-02/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "アンガーマネジメント1・アンガーマネジメント2・アートセラピー", "sub": "メインかだい"},
            {"src": "images/2026-02/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "この音はなんだろう？選手権・2月のメイン課題スケジュール", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "2月11日・23日はお休みです。",
          thumb: {"src": "images/2026-02/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-02/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年2月号"},
            {"src": "images/2026-02/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "サイズアップ／ろうそくでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-02/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "紙飛行機バトル・おばけキャッチ", "sub": "メインかだい"},
            {"src": "images/2026-02/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "アンガーマネジメント1・アンガーマネジメント2／2月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2026-01", year: 2026, month: 1,
      label: "2026年1月号", short: "1月号",
      brands: {
        atelier: {
          catch: "",
          note: "1月12日はお休みです。",
          thumb: {"src": "images/2026-01/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-01/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年1月号"},
            {"src": "images/2026-01/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "サイズアップ／ろうそくでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-01/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・新年ゲーム大会・おばけキャッチ", "sub": "メインかだい"},
            {"src": "images/2026-01/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "紙飛行機バトル／1月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "1月12日はお休みです。",
          thumb: {"src": "images/2026-01/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-01/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2026年1月号"},
            {"src": "images/2026-01/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "エモジト！／ぽかぽかアイテムでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2026-01/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "新年ゲーム大会・おめめをきたえよう選手権", "sub": "メインかだい"},
            {"src": "images/2026-01/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター1・はたらく細胞シアター2／1月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-12", year: 2025, month: 12,
      label: "2025年12月号", short: "12月号",
      brands: {
        atelier: {
          catch: "",
          note: "12月30日〜1月2日はお休みです。",
          thumb: {"src": "images/2025-12/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-12/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年12月号"},
            {"src": "images/2025-12/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "エモジト！・ぽかぽかアイテムでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-12/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "イラスト・カレンダー・はたらく細胞シアター", "sub": "メインかだい"},
            {"src": "images/2025-12/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "年忘れゲーム大会・12月のメイン課題スケジュール", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2025-12/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-12/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年12月号"},
            {"src": "images/2025-12/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "トータスメダル・かおりでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-12/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "日本の名産名所・イラスト・カレンダー", "sub": "メインかだい"},
            {"src": "images/2025-12/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "スリルボム・12月のメイン課題スケジュール", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-11", year: 2025, month: 11,
      label: "2025年11月号", short: "11月号",
      brands: {
        atelier: {
          catch: "",
          note: "11月3日・24日はお休みです。",
          thumb: {"src": "images/2025-11/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-11/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年11月号"},
            {"src": "images/2025-11/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "トータスメダル・かおりでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-11/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "この音はなんだろう？選手権・キャプテン・リノ", "sub": "メインかだい"},
            {"src": "images/2025-11/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "コマ・日本の名産名所・11月のメイン課題スケジュール", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "11月3日・24日はお休みです。",
          thumb: {"src": "images/2025-11/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-11/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年11月号"},
            {"src": "images/2025-11/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ヨメルかな／はくしゅでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-11/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・この音はなんだろう？選手権・おばけキャッチ", "sub": "メインかだい"},
            {"src": "images/2025-11/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "コマ／11月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-10", year: 2025, month: 10,
      label: "2025年10月号", short: "10月号",
      brands: {
        atelier: {
          catch: "",
          note: "10月13日はお休みです。",
          thumb: {"src": "images/2025-10/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-10/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年10月号"},
            {"src": "images/2025-10/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ヨメルかな／はくしゅでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-10/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "クラスター・おばけキャッチ・おめめをきたえよう選手権", "sub": "メインかだい"},
            {"src": "images/2025-10/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "イラスト（ハロウィン）・リレーアート（世界の名画）／10月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "10月13日はお休みです。",
          thumb: {"src": "images/2025-10/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-10/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙／10月のよてい", "sub": "2025年10月号・スケジュール"},
            {"src": "images/2025-10/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "インク de リンク／イメージでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-10/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "センサリーボトル・イラスト（ハロウィン）", "sub": "メインかだい"},
            {"src": "images/2025-10/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "お友だちってなんだろう？1・お友だちってなんだろう？2／キャプテン・リノ", "sub": "メインかだい"}
          ]
        }
      }
    },
    {
      id: "2025-09", year: 2025, month: 9,
      label: "2025年9月号", short: "9月号",
      brands: {
        atelier: {
          catch: "",
          note: "9月15日・23日はお休みです。",
          thumb: {"src": "images/2025-09/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-09/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年9月号"},
            {"src": "images/2025-09/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "インク de リンク／イメージでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-09/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "キャプテン・リノ・クラスター・センサリーボトル", "sub": "メインかだい"},
            {"src": "images/2025-09/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "お友だちってなんだろう？／9月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "9月15日・23日はお休みです。",
          thumb: {"src": "images/2025-09/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-09/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "other", "title": "9月のメイン課題スケジュール", "sub": "1か月のよてい"},
            {"src": "images/2025-09/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ヨメルかな／戦士のポーズでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-09/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "イラスト（おつきみ）・センサリーボトル", "sub": "メインかだい"},
            {"src": "images/2025-09/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター・キャプテン・リノ", "sub": "メインかだい"}
          ]
        }
      }
    },
    {
      id: "2025-08", year: 2025, month: 8,
      label: "2025年8月号", short: "8月号",
      brands: {
        atelier: {
          catch: "",
          note: "8月11日・13日〜15日はお休み、12日はおたのしみ企画です。",
          thumb: {"src": "images/2025-08/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-08/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年8月号"},
            {"src": "images/2025-08/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ヨメルかな／戦士のポーズでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-08/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "スリルボム・うちわ", "sub": "メインかだい"},
            {"src": "images/2025-08/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター／8月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "③週（8月11日〜15日）はお休みです。",
          thumb: {"src": "images/2025-08/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-08/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年8月号"},
            {"src": "images/2025-08/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "トータスメダル／ふきあげパイプでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-08/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "うちわ・傘のモビール1・傘のモビール2", "sub": "メインかだい"},
            {"src": "images/2025-08/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "これな〜んだ？10 どうぶつ編／8月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-07", year: 2025, month: 7,
      label: "2025年7月号", short: "7月号",
      brands: {
        atelier: {
          catch: "",
          note: "7月21日はお休みです。",
          thumb: {"src": "images/2025-07/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-07/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年7月号"},
            {"src": "images/2025-07/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "トータスメダル／ふきあげパイプでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-07/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ポストカード・傘のモビール1・傘のモビール2", "sub": "メインかだい"},
            {"src": "images/2025-07/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "クラスター・スリルボム／7月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "7月21日はお休みです。",
          thumb: {"src": "images/2025-07/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-07/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年7月号"},
            {"src": "images/2025-07/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ワードバスケット／ボディスキャンでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-07/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "お部屋のお片付け1・お部屋のお片付け2・おめめをきたえよう選手権・スリルボム", "sub": "メインかだい"},
            {"src": "images/2025-07/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "うちわ／7月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-06", year: 2025, month: 6,
      label: "2025年6月号", short: "6月号",
      brands: {
        atelier: {
          catch: "",
          note: "",
          thumb: {"src": "images/2025-06/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-06/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年6月号"},
            {"src": "images/2025-06/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ワードバスケット／ボディスキャンでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-06/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "動物・お部屋のお片付け", "sub": "メインかだい"},
            {"src": "images/2025-06/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "イラスト・ポストカード／6月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2025-06/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-06/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター・動物", "sub": "メインかだい"},
            {"src": "images/2025-06/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "インク de リンク／かたをまわしてホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-06/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター・動物", "sub": "メインかだい"},
            {"src": "images/2025-06/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "6月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2025-05", year: 2025, month: 5,
      label: "2025年5月号", short: "5月号",
      brands: {
        atelier: {
          catch: "",
          note: "4月29日・5月5日・5月6日はお休みです。",
          thumb: {"src": "images/2025-05/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-05/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年5月号"},
            {"src": "images/2025-05/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "インク de リンク／かたをまわしてホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-05/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "アンガーマネジメント・はたらく細胞シアター", "sub": "メインかだい"},
            {"src": "images/2025-05/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・動物・巨大恐竜／5月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "4月29日・5月5日・5月6日はお休みです。",
          thumb: {"src": "images/2025-05/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-05/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年5月号"},
            {"src": "images/2025-05/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "エモジト！／フラミンゴでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-05/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "衣類のお片付け1・衣類のお片付け2・クラスター・箱の中身はなんだろう？選手権", "sub": "メインかだい"},
            {"src": "images/2025-05/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "イラスト（魚）・ポストカード（スイーツ）／5月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-04", year: 2025, month: 4,
      label: "2025年4月号", short: "4月号",
      brands: {
        atelier: {
          catch: "",
          note: "4月29日はお休みです。",
          thumb: {"src": "images/2025-04/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-04/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年4月号"},
            {"src": "images/2025-04/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語／フラミンゴでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-04/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "スピードスピログラム・イラスト（桜）・リレーアート", "sub": "メインかだい"},
            {"src": "images/2025-04/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "アンガーマネジメント1・アンガーマネジメント2／4月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "4月29日はお休みです。",
          thumb: {"src": "images/2025-04/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-04/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年4月号"},
            {"src": "images/2025-04/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数／ストローでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-04/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "なかまを知ろう2・メタリックキャラクター・メタリック恐竜", "sub": "メインかだい"},
            {"src": "images/2025-04/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "衣類のお片付け1・衣類のお片付け2／4月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-03", year: 2025, month: 3,
      label: "2025年3月号", short: "3月号",
      brands: {
        atelier: {
          catch: "",
          note: "",
          thumb: {"src": "images/2025-03/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-03/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年3月号"},
            {"src": "images/2025-03/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数／ストローでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-03/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "衣類のお片付け1・衣類のお片付け2・メタリックキャラクター・メタリック恐竜", "sub": "メインかだい"},
            {"src": "images/2025-03/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "スピードスピログラム／3月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "3月20日はお休みです。",
          thumb: {"src": "images/2025-03/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-03/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年3月号"},
            {"src": "images/2025-03/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語／ゆるめてホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-03/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・紙飛行機バトル1・紙飛行機バトル2", "sub": "メインかだい"},
            {"src": "images/2025-03/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "なかまを知ろう1・なかまを知ろう2／3月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-02", year: 2025, month: 2,
      label: "2025年2月号", short: "2月号",
      brands: {
        atelier: {
          catch: "",
          note: "2月11日・2月24日はお休みです。",
          thumb: {"src": "images/2025-02/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-02/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年2月号"},
            {"src": "images/2025-02/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数／ゆるめてホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-02/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・クラスター", "sub": "メインかだい"},
            {"src": "images/2025-02/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "なかまを知ろう1・なかまを知ろう2／2月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "2月11日と24日はお休みです。",
          thumb: {"src": "images/2025-02/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-02/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年2月号"},
            {"src": "images/2025-02/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数／ココアでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-02/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "箱の中身はなんだろう？選手権・スピードスピログラム", "sub": "メインかだい"},
            {"src": "images/2025-02/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ゴムバンド・マグネット／2月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2025-01", year: 2025, month: 1,
      label: "2025年1月号", short: "1月号",
      brands: {
        atelier: {
          catch: "",
          note: "1月1日〜3日と13日はお休みです。",
          thumb: {"src": "images/2025-01/atelier/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-01/atelier/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年1月号"},
            {"src": "images/2025-01/atelier/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語／ろうそくでホッとタイム", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-01/atelier/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "箱の中身はなんだろう？選手権", "sub": "メインかだい"},
            {"src": "images/2025-01/atelier/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ゴムバンド・マグネット／1月のよてい", "sub": "メインかだい・スケジュール"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "1月1日〜3日と13日はお休みです。",
          thumb: {"src": "images/2025-01/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2025-01/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2025年1月号"},
            {"src": "images/2025-01/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語／ろうそくの火をふきけそう", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2025-01/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "これな〜んだ？10 どうぶつ編・スリルボム・アンガーマネジメント1・アンガーマネジメント2", "sub": "メインかだい"},
            {"src": "images/2025-01/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "1月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-12", year: 2024, month: 12,
      label: "2024年12月号", short: "12月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "12月30日・31日はお休みで、1月は6日からです。",
          thumb: {"src": "images/2024-12/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-12/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年12月号"},
            {"src": "images/2024-12/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数・注意訓練トレーニング", "sub": "教科課題・瞑想"},
            {"src": "images/2024-12/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター1・はたらく細胞シアター2・万華鏡", "sub": "メイン課題 講座系課題・ものづくり系課題"},
            {"src": "images/2024-12/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "利きチョコ選手権・ぴあん 12月スケジュール表", "sub": "単発系課題・1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-11", year: 2024, month: 11,
      label: "2024年11月号", short: "11月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "11月4日（月）は振替休日でお休みです。",
          thumb: {"src": "images/2024-11/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-11/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年11月号"},
            {"src": "images/2024-11/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語・ポーズ瞑想(手動瞑想)", "sub": "教科課題・瞑想"},
            {"src": "images/2024-11/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "この音の主はなんだろう？選手権・利きチョコ選手権・アンガーマネジメント1・アンガーマネジメント2", "sub": "メイン課題 単発系課題・講座系課題"},
            {"src": "images/2024-11/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ぴあん 11月スケジュール表", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-10", year: 2024, month: 10,
      label: "2024年10月号", short: "10月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "10月14日（月）はスポーツの日でお休みです。",
          thumb: {"src": "images/2024-10/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-10/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年10月号"},
            {"src": "images/2024-10/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数・宇宙人の日", "sub": "教科課題・瞑想"},
            {"src": "images/2024-10/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ストライクASIA・番犬ガオガオの庭・これな〜んだ？10 どうぶつ編・マステのビニール傘", "sub": "メイン課題 課題①・課題②"},
            {"src": "images/2024-10/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ぴあん 10月スケジュール表", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-09", year: 2024, month: 9,
      label: "2024年9月号", short: "9月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "16日（敬老の日）と23日（振替休日）はお休みです。",
          thumb: {"src": "images/2024-09/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-09/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年9月号"},
            {"src": "images/2024-09/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語・1，2，3で拍手！", "sub": "教科課題・瞑想"},
            {"src": "images/2024-09/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター・かぜ症候群1・かぜ症候群2・LaQ・2025年カレンダー・立体動物園", "sub": "メイン課題"},
            {"src": "images/2024-09/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ぴあん 9月スケジュール表", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-08", year: 2024, month: 8,
      label: "2024年8月号", short: "8月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "12日（山の日）と13〜15日（おぼん休み）はお休みです。",
          thumb: {"src": "images/2024-08/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-08/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年8月号"},
            {"src": "images/2024-08/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数・かたをまわそう", "sub": "教科課題・瞑想"},
            {"src": "images/2024-08/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・ペーパークラフト・巨大恐竜", "sub": "メイン課題"},
            {"src": "images/2024-08/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "オーナメント・キーホルダー・モビール・金魚・ぴあん 8月スケジュール表", "sub": "メイン課題・1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-07", year: 2024, month: 7,
      label: "2024年7月号", short: "7月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "15日はお休みです。",
          thumb: {"src": "images/2024-07/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-07/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年7月号"},
            {"src": "images/2024-07/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語・池のなみ", "sub": "教科課題・瞑想"},
            {"src": "images/2024-07/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "たまつむバランス・クラスター・センサリーボトル・キラキラボトル・アクアリウム", "sub": "メイン課題"},
            {"src": "images/2024-07/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・ぴあん 7月スケジュール表", "sub": "メイン課題・1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-06", year: 2024, month: 6,
      label: "2024年6月号", short: "6月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2024-06/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-06/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年6月号"},
            {"src": "images/2024-06/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "算数／しっぽフリフリ", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2024-06/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "はたらく細胞シアター・アイロンビーズ", "sub": "メインかだい"},
            {"src": "images/2024-06/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "6月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        }
      }
    },
    {
      id: "2024-05", year: 2024, month: 5,
      label: "2024年5月号", short: "5月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "ペーパークラフト作品を掲示予定です。",
          thumb: {"src": "images/2024-05/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-05/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年5月号"},
            {"src": "images/2024-05/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "国語／フラミンゴになる！", "sub": "きょうかかだい・めいそうかだい"},
            {"src": "images/2024-05/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "聞き上手になろう・リレーアート", "sub": "メインかだい"},
            {"src": "images/2024-05/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "お知らせ／5月のよてい", "sub": "おしらせ・スケジュール"}
          ]
        }
      }
    },
    {
      id: "2024-04", year: 2024, month: 4,
      label: "2024年4月号", short: "4月号",
      brands: {
        nijiiro: {
          catch: "",
          note: "くるみぼたん専門店のサイトがOPEN、アニメ「はたらく細胞」が4月から放送です。",
          thumb: {"src": "images/2024-04/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2024-04/nijiiro/p1.webp", "w": 1600, "h": 2263, "sec": "cover", "title": "表紙", "sub": "2024年4月号"},
            {"src": "images/2024-04/nijiiro/p2.webp", "w": 1600, "h": 2263, "sec": "other", "title": "おめめをきたえよう選手権・なかまを知ろう", "sub": "メインかだい"},
            {"src": "images/2024-04/nijiiro/p3.webp", "w": 1600, "h": 2263, "sec": "other", "title": "ペーパークラフト・ジグソーパズル", "sub": "メインかだい"},
            {"src": "images/2024-04/nijiiro/p4.webp", "w": 1600, "h": 2263, "sec": "other", "title": "お知らせ／4月のよてい", "sub": "おしらせ・スケジュール"}
          ]
        }
      }
    }
  ]
};

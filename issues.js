/* 月刊ぴあん — 号のデータ（バックナンバーの一覧はここが元になります）
 *
 * ■ 新しい号を足すときの手順
 *   1) PDFをページ画像に変換する
 *        python tools/add_issue.py --pdf "月刊ぴあん あとりえ.pdf" --brand atelier --ym 2026-09
 *        python tools/add_issue.py --pdf "月刊ぴあん にじいろ.pdf" --brand nijiiro --ym 2026-09
 *   2) このファイルの issues 配列の「先頭」に、下と同じ形で1件足す
 *      （src / w / h は 1) が表示するJSONをそのまま使えます）
 *   3) 保存して push すれば、サイトに新しい号が並びます
 *
 * ■ sec（ページの種類）に使える値
 *   cover=表紙 / schedule=スケジュール / subject=きょうかかだい
 *   meditation=めいそうかだい / main=メインかだい
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
            {"src": "images/2026-07/atelier/p1.webp", "w": 1000, "h": 1112, "sec": "subject", "title": "あしざん", "sub": "きょうかかだい ②〜⑤週目"},
            {"src": "images/2026-07/atelier/p2.webp", "w": 1000, "h": 1124, "sec": "meditation", "title": "ふきあげパイプでホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-07/atelier/p3.webp", "w": 1000, "h": 1126, "sec": "main", "title": "ゴムバンド", "sub": "メインかだい ②週目"},
            {"src": "images/2026-07/atelier/p4.webp", "w": 1000, "h": 1123, "sec": "main", "title": "マグネット", "sub": "メインかだい ③週目"},
            {"src": "images/2026-07/atelier/p5.webp", "w": 1000, "h": 1120, "sec": "main", "title": "衣類のお片付け（Tシャツたたみリレー）", "sub": "メインかだい ④週目"},
            {"src": "images/2026-07/atelier/p6.webp", "w": 1000, "h": 1108, "sec": "main", "title": "衣類のお片付け（衣類たたみリレー）", "sub": "メインかだい ⑤週目"},
            {"src": "images/2026-07/atelier/p7.webp", "w": 1200, "h": 698, "sec": "schedule", "title": "7月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-07/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-07/nijiiro/p1.webp", "w": 1000, "h": 1151, "sec": "subject", "title": "ヨメルかな", "sub": "きょうかかだい ②〜⑤週目"},
            {"src": "images/2026-07/nijiiro/p2.webp", "w": 1000, "h": 1151, "sec": "meditation", "title": "ボディスキャンでホッとタイム", "sub": "めいそうかだい ②〜⑤週目"},
            {"src": "images/2026-07/nijiiro/p3.webp", "w": 1000, "h": 1151, "sec": "main", "title": "キャプテン・リノ", "sub": "メインかだい ①週目"},
            {"src": "images/2026-07/nijiiro/p4.webp", "w": 1000, "h": 1151, "sec": "main", "title": "イラスト（おさかな）", "sub": "メインかだい ②週目"},
            {"src": "images/2026-07/nijiiro/p5.webp", "w": 1000, "h": 1151, "sec": "main", "title": "ポストカード（スイーツ）", "sub": "メインかだい ③週目"},
            {"src": "images/2026-07/nijiiro/p6.webp", "w": 1000, "h": 1151, "sec": "main", "title": "はたらく細胞シアター", "sub": "メインかだい ④〜⑤週目"},
            {"src": "images/2026-07/nijiiro/p7.webp", "w": 1200, "h": 698, "sec": "schedule", "title": "7月のメイン課題スケジュール", "sub": "1か月のよてい"}
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
            {"src": "images/2026-06/atelier/p1.webp", "w": 1000, "h": 1162, "sec": "subject", "title": "ヨメルかな", "sub": "きょうかかだい ①〜⑤週目"},
            {"src": "images/2026-06/atelier/p2.webp", "w": 1000, "h": 1167, "sec": "meditation", "title": "ボディスキャンでホッとタイム", "sub": "めいそうかだい ①〜⑤週目"},
            {"src": "images/2026-06/atelier/p3.webp", "w": 1000, "h": 1172, "sec": "main", "title": "イラスト（おさかな）", "sub": "メインかだい ①週目"},
            {"src": "images/2026-06/atelier/p4.webp", "w": 1000, "h": 1167, "sec": "main", "title": "ポストカード（スイーツ）", "sub": "メインかだい ②週目"},
            {"src": "images/2026-06/atelier/p5.webp", "w": 1000, "h": 1169, "sec": "main", "title": "キャプテン・リノ", "sub": "メインかだい ③週目"},
            {"src": "images/2026-06/atelier/p6.webp", "w": 1000, "h": 1167, "sec": "main", "title": "はたらく細胞シアター", "sub": "メインかだい ④〜⑤週目"},
            {"src": "images/2026-06/atelier/p7.webp", "w": 1200, "h": 724, "sec": "schedule", "title": "6月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        },
        nijiiro: {
          catch: "",
          note: "",
          thumb: {"src": "images/2026-06/nijiiro/thumb.webp", "w": 240, "h": 240},
          pages: [
            {"src": "images/2026-06/nijiiro/p1.webp", "w": 1000, "h": 1197, "sec": "subject", "title": "ラインナップゲーム（山）", "sub": "きょうかかだい ①〜⑤週目"},
            {"src": "images/2026-06/nijiiro/p2.webp", "w": 1000, "h": 1197, "sec": "meditation", "title": "かたをまわしてホッとタイム", "sub": "めいそうかだい ①〜⑤週目"},
            {"src": "images/2026-06/nijiiro/p3.webp", "w": 1000, "h": 1197, "sec": "main", "title": "クラスター", "sub": "メインかだい ①週目"},
            {"src": "images/2026-06/nijiiro/p4.webp", "w": 1000, "h": 1197, "sec": "main", "title": "なかまを知ろう", "sub": "メインかだい ②〜③週目"},
            {"src": "images/2026-06/nijiiro/p5.webp", "w": 1000, "h": 1170, "sec": "main", "title": "紙飛行機バトル", "sub": "メインかだい ④週目"},
            {"src": "images/2026-06/nijiiro/p6.webp", "w": 1000, "h": 1197, "sec": "main", "title": "キャプテン・リノ", "sub": "メインかだい ⑤週目"},
            {"src": "images/2026-06/nijiiro/p7.webp", "w": 1200, "h": 711, "sec": "schedule", "title": "6月のメイン課題スケジュール", "sub": "1か月のよてい"}
          ]
        }
      }
    }
  ]
};

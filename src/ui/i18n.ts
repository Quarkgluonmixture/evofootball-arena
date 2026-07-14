/**
 * UI localization (Phase 28.1): Chinese by default, English via the top-bar
 * toggle. Keys are the English source strings — `t()` falls back to the key
 * itself, so untranslated (or newly added) labels degrade to English instead
 * of breaking. UI chrome only: sim-generated text (event feed lines, mined
 * season stories, player/team names) deliberately stays English — those
 * strings live in `sim/` which must never know about the browser.
 *
 * Switching languages persists the choice and reloads the page — panels are
 * built once at startup, and a deterministic league replays its current
 * fixture identically after reload.
 */

export type Lang = 'zh' | 'en';

const STORE_KEY = 'evofootball-lang';

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORE_KEY);
    return v === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export const lang: Lang = readLang();

export function setLang(next: Lang): void {
  try {
    localStorage.setItem(STORE_KEY, next);
  } catch {
    /* private mode — the toggle still works for this load */
  }
  location.reload();
}

const ZH: Record<string, string> = {
  // ---- top bar ----
  'League table': '联赛中心',
  Save: '保存',
  Load: '读取',
  Export: '导出',
  Import: '导入',
  seed: '种子',
  'New league': '新联赛',
  Reset: '重置',
  '✕ exit cinematic': '✕ 退出影院模式',
  'Delete the save and start over?': '删除存档并重新开始?',

  // ---- left panel ----
  'Match control': '比赛控制',
  '⏸ pause': '⏸ 暂停',
  '▶ play': '▶ 继续',
  '⏭ skip': '⏭ 跳过',
  'Auto-continue to next match': '自动进入下一场',
  'Simulate (headless)': '快速模拟',
  Round: '单轮',
  Season: '整季',
  '10 Seasons': '10 个赛季',
  'View & camera': '视角与镜头',
  Tactical: '战术',
  TV: '转播',
  Ball: '跟球',
  Goal: '门后',
  Orbit: '环绕',
  'Reset cam': '重置镜头',
  '🎬 Replay': '🎬 回放',
  'Sound FX (beeps)': '音效(蜂鸣)',
  Presentation: '演出',
  '🎥 Cinematic': '🎥 影院模式',
  '📸 Screenshot': '📸 截图',
  'FX quality': '特效质量',
  Low: '低',
  Med: '中',
  High: '高',
  'Debug overlays': '调试图层',
  'Player action labels': '球员动作标签',
  'Formation targets': '阵型落点',
  'Pass target line': '传球目标线',
  'Shot vector': '射门向量',
  'Marking lines': '盯人连线',
  'Press assignments': '逼抢指派',
  'Ball heatmap': '球路热力图',
  '⚡ Exhibition (friendly)': '⚡ 表演赛(友谊赛)',
  '⚔ Promotion playoff': '⚔ 升级附加赛',
  Cup: '杯赛',
  Gen: '世代',
  'Season#': '赛季',
  'Round#': '轮次',
  KO: '开球',
  HT: '半场',
  FT: '全场',
  'GOAL!': '进球!',
  '↪ kick-in': '↪ 界外球',
  '⚑ corner': '⚑ 角球',
  '🥅 goal kick': '🥅 球门球',
  '⚠ free kick': '⚠ 任意球',
  '🚩 offside': '🚩 越位',
  '⚡ PENALTY': '⚡ 点球',

  // ---- right panel ----
  'Match stats · xG race': '比赛数据 · xG 曲线',
  'Teams & tactical genes': '球队与战术基因',
  'Selected player': '选中球员',
  'Click a player on the pitch.': '点击场上的球员查看详情。',
  mode: '模式',
  shots: '射门',
  'on target': '射正',
  xG: 'xG',
  possession: '控球率',
  passes: '传球',
  'pass %': '传球成功率',
  crosses: '传中',
  'one-twos': '2过1',
  'third man': '三人配合',
  overlaps: '套边',
  'headers won': '争顶成功',
  miscontrols: '停球失误',
  recoveries: '抢回球权',
  corners: '角球',
  offsides: '越位',
  fouls: '犯规',
  cards: '红黄牌',
  saves: '扑救',
  'action:': '动作:',
  stamina: '体能',
  'utility scores:': '效用评分:',

  // ---- tactical identity (Phase 30) ----
  'formation ⚔': '⚔ 进攻阵型',
  'formation 🛡': '🛡 防守阵型',
  marking: '盯人方案',
  'man-marking': '盯人',
  zonal: '区域',

  // ---- team modes ----
  BuildUp: '组织',
  Attack: '进攻',
  Defend: '防守',
  Press: '逼抢',
  CounterAttack: '反击',
  ResetShape: '落位',

  // ---- tactical genes ----
  passBias: '传球倾向',
  shootBias: '射门倾向',
  dribbleBias: '盘带倾向',
  pressIntensity: '逼抢强度',
  defensiveCompactness: '防守紧凑度',
  attackingWidth: '进攻宽度',
  riskTolerance: '冒险倾向',
  counterAttackBias: '反击倾向',
  staminaConservation: '体能节省',
  markingAggression: '盯人强度',
  keeperAggression: '门将激进度',
  tempo: '节奏',
  formationDepth: '阵型高度',
  supportDistance: '接应距离',

  // ---- player attributes (8 since Phase 47) ----
  budget: '预算',
  pace: '速度',
  passing: '传球',
  dribbling: '盘带',
  finishing: '射术',
  defending: '防守',
  strength: '强壮',
  reflexes: '反应',

  // ---- evolution center (Phase 51) ----
  'Evolution center': '演化中心',
  Overall: '总览',
  'Four lenses on the same league — axes are wherever the clubs disagree most, overall and per phase of play.':
    '同一联盟的四个镜头——坐标轴取各镜头内分歧最大的维度：总览与进攻/防守/组织各一张，滑块同步驱动。',
  now: '当前',
  'x-axis': '横轴',
  'y-axis': '纵轴',
  'the two dimensions this league disagrees on most': '本联盟分歧最大的两个维度',
  'Club deep dive': '俱乐部深潜',
  'This club\'s biggest style moves': '这家俱乐部漂移最大的风格维度',
  'Finish a season to see this club\'s drift.': '完成一个赛季后可见漂移曲线。',
  'Dynasty wall': '王朝墙',
  elite: '精英存续',
  reborn: '重生',
  founded: '创立',
  mutated: '延续',
  promoted: '升级',
  relegated: '降级',
  'promotion/relegation': '升降级',
  'tap a row to inspect the club': '点击任意一行查看俱乐部',
  'Population trends': '种群趋势',
  'All gene & attribute curves (league mean per generation)': '全部基因与属性曲线（联盟均值/世代）',
  'Last evolution': '最近一次演化',

  // ---- style space & nameplates (Phase 49; en source strings from styleSpace.ts) ----
  'Style space': '风格空间',
  'Axes = the two dimensions this season\'s clubs disagree on most; trails = recent seasons.':
    '坐标轴=本赛季各队分歧最大的两个维度；轨迹=最近几个赛季的漂移。',
  'style divergence': '风格分化度',
  'Budget allocation': '预算分配',
  Balanced: '均衡',
  'High press': '高位逼抢',
  'Passive block': '低位站防',
  'Pass-first': '传控优先',
  'Shoot on sight': '见球就射',
  'Street dribblers': '盘带成瘾',
  'Wings unleashed': '两翼齐飞',
  'Narrow knife': '中路渗透',
  'All-in risk': '冒险主义',
  'Safety first': '稳字当头',
  'Counter-punchers': '防守反击',
  'Energy misers': '节能大师',
  'Bone-crunchers': '凶狠盯抢',
  'Sweeper keeper': '门卫',
  'Up-tempo': '快节奏',
  'Slow burn': '慢热控场',
  'High line': '高位防线',
  'The bus': '深蹲大巴',
  'Compact block': '密集收缩',
  'Stretch play': '拉开空间',
  'Tight triangles': '紧凑三角',
  'Trigger happy': '出手果断',
  'Ball carriers': '持球推进',
  'Vertical passing': '向前直塞',
  'Never backwards': '决不回传',
  'Through-ball surgeons': '直塞手术刀',
  'Cross bombardment': '下底轰炸',
  'Route one': '长传冲吊',
  'Long-range artillery': '远射炮台',
  'Runners in waves': '前插如潮',
  'Hunt in packs': '群狼围猎',
  'Glue marking': '贴身盯防',
  'Lane thieves': '拦截大师',
  'Hoof it clear': '大脚解围',
  'Tiki-taka': '传控织网',
  'Swarm support': '蜂群接应',
  'One-two addicts': '二过一上瘾',
  'Third-man runs': '三人连击',
  'Overlap machine': '套边机器',
  // policy-dim axis labels (the style-space map can pick any dim as an axis)
  shootBase: '射门欲望',
  dribbleBase: '带球欲望',
  passFwdBase: '向前传球',
  passBackPen: '回传惩罚',
  throughBase: '直塞欲望',
  crossBase: '传中欲望',
  loftBase: '长传欲望',
  longShotW: '远射欲望',
  runScore: '前插欲望',
  chaseBase: '追抢欲望',
  markBase: '盯人强度',
  interceptScore: '拦截倾向',
  clearBase: '解围倾向',
  clearPressureW: '压力解围',
  passBase: '短传倾向',
  passLaneW: '传球线路',
  passOpenW: '空当传球',
  passOutletMul: '出球阀门',
  supportBase: '接应倾向',
  wallPassW: '二过一欲望',
  thirdManW: '三人配合欲望',
  overlapW: '套边欲望',

  // ---- league screen ----
  League: '联赛',
  'Team cards': '球队卡片',
  'Promotion rules': '升降级规则',
  'Auto top/bottom 2': '自动升降级(前2/后2)',
  '⚔ Playoff': '⚔ 附加赛',
  'Cup draw rule': '杯赛平局规则',
  '\u{1F945} Penalty shootout': '\u{1F945} 点球大战',
  '⚡ Underdog advances': '⚡ 黑马晋级',
  'Roll of honour': '荣誉榜',
  'Rivalries': '宿敌对决',
  'meetings in deciders': '次决战相遇',
  'Awards (Premier Division)': '赛季最佳(超级组)',
  'Challenger top scorers': '挑战组射手榜',
  '🎓 Retirements': '🎓 赛季退役',
  'Champions history': '历届冠军',
  'Top scorers (current season, D1)': '本赛季射手榜(超级组)',
  'Tactical gene drift (league mean per generation)': '战术基因漂移(每代联赛均值)',
  'Squad attribute drift (league mean per generation)': '球员属性漂移(每代联赛均值)',
  'Formation identity share (per generation)': '阵型身份份额(每代)',
  'Attack formation': '进攻阵型',
  'Defend formation': '防守阵型',
  Marking: '盯人方案',
  'Premier Division': '超级组',
  'Challenger Division': '挑战组',
  Close: '关闭',
  '✕ Close': '✕ 关闭',

  // ---- replay bar ----
  Replay: '回放',
  Exit: '退出',
  '✕ Exit replay': '✕ 退出回放',
  'exit replay ✕': '退出回放 ✕',

  // ---- the watching experience (Phase 33) ----
  rating: '评分',
  'Tap for the tactical DNA clash': '点按查看战术基因对撞',
  'Longest passing move': '最长传递配合',
  '🎬 Auto highlights (HT/FT)': '🎬 自动集锦(半场/全场)',

  // ---- rebirth ceremony & tactical DNA (Phase 32.5) ----
  'Rebirth ceremony': '重生仪式',
  'The pyramid turns over: the weakest Challenger clubs die, and champions breed their successors.':
    '金字塔翻转:挑战组垫底的俱乐部死去,豪门的战术基因诞下新军。',
  'Survived untouched (elite)': '原样存续(精英)',
  'Died and reborn': '死亡与重生',
  'fitness at death': '死亡时适应度',
  'gene drift': '基因漂移',
  parents: '父本',
  'no novel mutations — a true heir': '无新突变——纯正传人',
  Continue: '继续',
  'league mean': '联赛均值',
  'tap to dismiss': '点按关闭',

  // ---- league screen extras ----
  'Season report': '赛季报告',
  Evolution: '演化',
  'Hall of fame': '名人堂',
  bracket: '对阵表',
  "Last season's cup": '上赛季杯赛',
  'Squad attribute drift': '球员属性漂移',
  '🎓 All-time greats (retired)': '🎓 历史最佳(已退役)',
  '🏆 Premier titles': '🏆 超级组冠军榜',
  '🥇 Challenger titles': '🥇 挑战组冠军榜',
  '🎢 Movement records': '🎢 升降级纪录',
  '📜 Records (single season)': '📜 单赛季纪录',
  '🧬 Dynasty timeline (per league slot)': '🧬 王朝时间线(按联赛席位)',

  // ---- chronicle & eras (Phase 52) ----
  '📜 Chronicle': '📜 编年史',
  'Age of contention': '群雄割据',
  Eras: '纪元',
  'The recorded ages of this league — era names are discovered from the records, never preset.':
    '这个联盟被记录下来的时代——纪元之名从史料中涌现，绝非预设。',
  'No completed seasons yet — the chronicle opens after the first one.':
    '还没有完整赛季——第一季结束后编年史开卷。',
};

/** Translate a UI string; unknown keys fall back to the English source. */
export function t(key: string): string {
  return lang === 'zh' ? (ZH[key] ?? key) : key;
}

/** `H1`/`H2` → 上半场/下半场. */
export function halfLabel(half: 1 | 2): string {
  if (lang === 'zh') return half === 1 ? '上半场' : '下半场';
  return `H${half}`;
}

// The document language should match the UI language (a11y + font shaping).
try {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
} catch {
  /* non-DOM context (tests) */
}

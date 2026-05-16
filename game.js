// ====== 破壁：暗影博弈 v5 — 主持人抢答版 ======
// 电脑在主持人处，选手只在推进/攻击时看屏幕

const ATTR_NAMES = { truth: '实事求是', mass: '群众路线', indep: '独立自主' };
const ATTR_KEYS = ['truth', 'mass', 'indep'];
const STATUS_COLORS = {
  '临门': '#4ecdc4',
  '正常': '#f7b731',
  '危机': '#fc5c65',
};

// ====== 题库（单选40 + 填空40 + 多选40 = 120题） ======
const Q_SINGLE = [
  { q: '毛泽东思想的核心是什么？', opts: ['实事求是', '武装斗争', '党的建设', '土地革命'], ans: 0 },
  { q: '毛泽东思想是马克思列宁主义在中国的（ ）', opts: ['简单复制', '运用和发展', '理论替代', '暂时借用'], ans: 1 },
  { q: '毛泽东思想强调把马克思主义基本原理同（ ）相结合', opts: ['苏联经验', '西方理论', '中国革命和建设的具体实际', '传统文化'], ans: 2 },
  { q: '毛泽东思想活的灵魂不包括以下哪一项？', opts: ['实事求是', '群众路线', '独立自主', '武装斗争'], ans: 3 },
  { q: '毛泽东思想的精髓是（ ）', opts: ['群众路线', '独立自主', '实事求是', '统一战线'], ans: 2 },
  { q: '群众路线的核心内容是（ ）', opts: ['一切为了群众，一切依靠群众', '党指挥枪', '独立自主', '批评与自我批评'], ans: 0 },
  { q: '"从群众中来，到群众中去"体现了（ ）', opts: ['独立自主', '实事求是', '群众路线', '武装斗争'], ans: 2 },
  { q: '坚持独立自主意味着（ ）', opts: ['完全照搬外国经验', '立足中国国情，走自己的路', '关起门来搞建设', '放弃国际合作'], ans: 1 },
  { q: '近代中国革命的性质是（ ）', opts: ['社会主义革命', '资产阶级民主革命', '无产阶级革命', '农民起义'], ans: 1 },
  { q: '新民主主义革命的对象不包括（ ）', opts: ['帝国主义', '封建主义', '官僚资本主义', '民族资产阶级全体'], ans: 3 },
  { q: '新民主主义革命的动力包括（ ）', opts: ['仅工人阶级', '仅农民阶级', '工人阶级、农民阶级、城市小资产阶级和民族资产阶级中的进步力量', '全体社会成员'], ans: 2 },
  { q: '新民主主义革命的道路是（ ）', opts: ['城市包围农村', '农村包围城市，武装夺取政权', '和平过渡', '议会斗争'], ans: 1 },
  { q: '新民主主义革命理论中，革命的主要形式是（ ）', opts: ['议会斗争', '武装斗争', '经济斗争', '文化斗争'], ans: 1 },
  { q: '新民主主义革命在经济上的基本纲领是（ ）', opts: ['消灭一切私有制', '没收官僚资本，保护民族工商业', '完全取消市场', '平均分配土地'], ans: 1 },
  { q: '新民主主义文化的特点是（ ）', opts: ['全盘西化', '民族化、科学化、大众化', '复古主义', '精英主义'], ans: 1 },
  { q: '新民主主义政治上要建立（ ）', opts: ['资产阶级专政', '无产阶级领导的各革命阶级联合专政', '君主立宪', '无政府状态'], ans: 1 },
  { q: '人民军队的根本原则是（ ）', opts: ['官兵平等', '党对军队的绝对领导', '军事优先', '自愿参军'], ans: 1 },
  { q: '中国革命的主要形式之一是（ ）', opts: ['议会斗争', '合法游行', '武装斗争', '经济制裁'], ans: 2 },
  { q: '农村根据地建设的重要意义在于（ ）', opts: ['暂时避难', '长期斗争的重要支点', '经济特区', '对外开放窗口'], ans: 1 },
  { q: '统一战线是中国革命取得胜利的（ ）', opts: ['次要方法', '重要法宝', '临时手段', '被迫选择'], ans: 1 },
  { q: '统一战线的原则是（ ）', opts: ['团结所有人', '有利于团结大多数、孤立最主要敌人', '只联合无产阶级', '排除一切资产阶级'], ans: 1 },
  { q: '在不同阶段，统一战线的联合对象（ ）', opts: ['永远不变', '随主要矛盾变化而调整', '越来越少', '越来越多'], ans: 1 },
  { q: '党的建设的重点不包括（ ）', opts: ['思想建设', '组织建设', '作风建设', '军事扩张'], ans: 3 },
  { q: '毛泽东反对的不良作风包括（ ）', opts: ['主观主义、宗派主义和党八股', '谦虚谨慎', '艰苦奋斗', '批评与自我批评'], ans: 0 },
  { q: '党要保持（ ），密切联系群众', opts: ['神秘性', '先进性和纯洁性', '封闭性', '独立性'], ans: 1 },
  { q: '新中国成立后，革命任务逐步转向（ ）', opts: ['对外扩张', '社会主义改造和社会主义建设', '恢复封建制度', '全盘西化'], ans: 1 },
  { q: '社会主义改造的对象包括（ ）', opts: ['仅农业', '农业、手工业、资本主义工商业', '仅工业', '仅商业'], ans: 1 },
  { q: '社会主义建设必须（ ）', opts: ['照搬苏联模式', '从中国实际出发，探索适合本国国情的道路', '完全模仿西方', '回到传统农业社会'], ans: 1 },
  { q: '根据矛盾分析方法，事物发展的根本动力是（ ）', opts: ['外部推动', '矛盾运动', '偶然因素', '天意'], ans: 1 },
  { q: '在社会治理中，应根据矛盾性质（ ）', opts: ['一视同仁', '采取不同方法', '全部镇压', '放任不管'], ans: 1 },
  { q: '要正确区分和处理（ ）', opts: ['主要矛盾和次要矛盾', '国际矛盾和国内矛盾', '经济矛盾和政治矛盾', '历史矛盾和现实矛盾'], ans: 0 },
  { q: '人民内部矛盾与敌我矛盾（ ）', opts: ['性质相同', '性质不同，处理方法也不同', '没有区别', '都可以用暴力解决'], ans: 1 },
  { q: '对人民内部矛盾应采取（ ）', opts: ['镇压的方法', '民主的方法、说服教育的方法', '武力解决', '置之不理'], ans: 1 },
  { q: '正确处理人民内部矛盾的目的在于（ ）', opts: ['消灭不同意见', '调动积极性，团结一切可以团结的力量', '制造对立', '维持现状'], ans: 1 },
  { q: '调查研究是（ ）的重要基础', opts: ['主观主义', '实事求是', '本本主义', '经验主义'], ans: 1 },
  { q: '认识来源于（ ）', opts: ['书本', '天才', '实践', '想象'], ans: 2 },
  { q: '毛泽东反对脱离实际的（ ）', opts: ['本本主义和经验主义', '实事求是', '群众路线', '独立自主'], ans: 0 },
  { q: '毛泽东思想的三个基本方面（活的灵魂）是（ ）', opts: ['实事求是、群众路线、独立自主', '武装斗争、统一战线、党的建设', '理论、实践、创新', '政治、经济、文化'], ans: 0 },
  { q: '中国革命取得胜利的"三大法宝"是（ ）', opts: ['实事求是、群众路线、独立自主', '武装斗争、统一战线、党的建设', '土地革命、武装斗争、根据地建设', '理论联系实际、密切联系群众、批评与自我批评'], ans: 1 },
  { q: '群众是（ ）的创造者', opts: ['文化', '历史', '经济', '科技'], ans: 1 },
];

const Q_FILL = [
  { q: '毛泽东思想活的灵魂包括实事求是、群众路线和___。', ans: '独立自主' },
  { q: '中国革命取得胜利的"三大法宝"是武装斗争、统一战线和___。', ans: '党的建设' },
  { q: '毛泽东思想的精髓是___。', ans: '实事求是' },
  { q: '新民主主义革命的道路是___包围城市，武装夺取政权。', ans: '农村' },
  { q: '人民军队的根本原则是党对军队的___领导。', ans: '绝对' },
  { q: '___是中国革命的主要形式之一。', ans: '武装斗争' },
  { q: '___是中国革命取得胜利的重要法宝。', ans: '统一战线' },
  { q: '党的建设的重点包括思想建设、组织建设和___。', ans: '作风建设' },
  { q: '___是实事求是的重要基础。', ans: '调查研究' },
  { q: '认识来源于___，也要回到实践中接受检验。', ans: '实践' },
  { q: '群众是___的创造者。', ans: '历史' },
  { q: '新民主主义革命的性质是资产阶级___革命。', ans: '民主' },
  { q: '近代中国社会的主要矛盾是帝国主义和___的矛盾。', ans: '中华民族' },
  { q: '矛盾___存在，推动事物发展。', ans: '普遍' },
  { q: '党要保持先进性和___，密切联系群众。', ans: '纯洁性' },
  { q: '毛泽东提出"没有___就没有发言权"。', ans: '调查' },
  { q: '___是毛泽东方法论中强调一切从实际出发的原则。', ans: '实事求是' },
  { q: '正确处理人民内部矛盾要采取___的方法。', ans: '民主' },
  { q: '___是毛泽东思想中关于依靠人民、动员人民的根本工作路线。', ans: '群众路线' },
  { q: '社会主义建设必须从中国___出发。', ans: '实际' },
  { q: '毛泽东反对主观主义、宗派主义和___。', ans: '党八股' },
  { q: '社会主义改造的对象包括农业、手工业和___工商业。', ans: '资本主义' },
  { q: '党只有保持同人民群众的___联系，才能获得力量源泉。', ans: '血肉' },
  { q: '___是毛泽东思想的根本点，是党的思想路线的核心。', ans: '实事求是' },
  { q: '中国革命和建设不能照搬___模式。', ans: '外国' },
  { q: '领导干部要深入___，倾听民意，解决实际问题。', ans: '基层' },
  { q: '反对脱离实际的___和经验主义。', ans: '本本主义' },
  { q: '___是检验真理的唯一标准。', ans: '实践' },
  { q: '要分清___矛盾和次要矛盾，抓住重点。', ans: '主要' },
  { q: '对人民内部矛盾要采取说服___的方法。', ans: '教育' },
  { q: '党对军队的___领导是人民军队建设的根本原则。', ans: '绝对' },
  { q: '___是毛泽东思想中关于处理党内外关系的根本方法。', ans: '群众路线' },
  { q: '新民主主义文化是民族的、___的、大众的文化。', ans: '科学' },
  { q: '统一战线原则是有利于团结___、孤立最主要敌人。', ans: '大多数' },
  { q: '新中国成立后，革命任务逐步转向社会主义___和社会主义建设。', ans: '改造' },
  { q: '党的___是革命事业的重要保证。', ans: '建设' },
  { q: '___是毛泽东思想活的灵魂之一，强调立足本国国情走自己的路。', ans: '独立自主' },
  { q: '毛泽东认为战争要依靠人民、___人民、组织人民。', ans: '动员' },
  { q: '新民主主义革命的对象是帝国主义、封建主义和___资本主义。', ans: '官僚' },
  { q: '___理论是毛泽东思想中关于在半殖民地半封建国家进行革命的理论。', ans: '新民主主义革命' },
];

const Q_MULTI = [
  { q: '以下哪些属于毛泽东思想活的灵魂？（多选）', opts: ['实事求是', '群众路线', '独立自主', '武装斗争'], ans: [0, 1, 2] },
  { q: '中国革命取得胜利的"三大法宝"包括（多选）', opts: ['武装斗争', '统一战线', '党的建设', '群众路线'], ans: [0, 1, 2] },
  { q: '新民主主义革命的对象包括（多选）', opts: ['帝国主义', '封建主义', '官僚资本主义', '民族资产阶级'], ans: [0, 1, 2] },
  { q: '新民主主义革命的动力包括（多选）', opts: ['工人阶级', '农民阶级', '城市小资产阶级', '大资产阶级'], ans: [0, 1, 2] },
  { q: '以下哪些属于毛泽东倡导的工作方法？（多选）', opts: ['调查研究', '实事求是', '本本主义', '群众路线'], ans: [0, 1, 3] },
  { q: '党的建设的重点包括（多选）', opts: ['思想建设', '组织建设', '作风建设', '军事扩张'], ans: [0, 1, 2] },
  { q: '毛泽东反对的不良作风包括（多选）', opts: ['主观主义', '宗派主义', '党八股', '实事求是'], ans: [0, 1, 2] },
  { q: '社会主义改造的对象包括（多选）', opts: ['农业', '手工业', '资本主义工商业', '外资企业'], ans: [0, 1, 2] },
  { q: '新民主主义革命的基本纲领包括（多选）', opts: ['政治纲领', '经济纲领', '文化纲领', '军事纲领'], ans: [0, 1, 2] },
  { q: '以下哪些是毛泽东思想的基本方法？（多选）', opts: ['理论联系实际', '密切联系群众', '批评与自我批评', '全盘西化'], ans: [0, 1, 2] },
  { q: '实事求是的基本要求包括（多选）', opts: ['一切从实际出发', '用实践检验真理', '主观臆断', '理论联系实际'], ans: [0, 1, 3] },
  { q: '统一战线的基本原则包括（多选）', opts: ['团结大多数', '孤立最主要敌人', '消灭所有资产阶级', '随矛盾变化调整联盟'], ans: [0, 1, 3] },
  { q: '人民战争思想强调（多选）', opts: ['依靠人民', '动员人民', '组织人民', '依靠外国'], ans: [0, 1, 2] },
  { q: '矛盾分析方法要求（多选）', opts: ['分清主要矛盾和次要矛盾', '区分矛盾的主要方面和次要方面', '根据矛盾性质采取不同方法', '回避矛盾'], ans: [0, 1, 2] },
  { q: '正确处理人民内部矛盾（多选）', opts: ['用民主方法', '用说服教育方法', '调动一切积极因素', '采取暴力镇压'], ans: [0, 1, 2] },
  { q: '以下哪些属于毛泽东思想的内容？（多选）', opts: ['新民主主义革命理论', '社会主义改造理论', '三个代表重要思想', '人民战争思想'], ans: [0, 1, 3] },
  { q: '毛泽东关于党的建设的论述强调（多选）', opts: ['保持党的先进性', '保持党的纯洁性', '密切联系群众', '脱离群众'], ans: [0, 1, 2] },
  { q: '以下哪些属于群众路线的内容？（多选）', opts: ['一切为了群众', '一切依靠群众', '从群众中来', '到群众中去'], ans: [0, 1, 2, 3] },
  { q: '农村包围城市道路理论的基本依据包括（多选）', opts: ['中国半殖民地半封建的社会性质', '农民占人口大多数', '敌人在城市力量强大', '中国经济发达'], ans: [0, 1, 2] },
  { q: '独立自主原则体现在（多选）', opts: ['立足中国国情', '不照搬别国经验', '完全拒绝外国帮助', '走自己的路'], ans: [0, 1, 3] },
  { q: '新民主主义文化的特点是（多选）', opts: ['民族的', '科学的', '大众的', '精英的'], ans: [0, 1, 2] },
  { q: '以下哪些属于新民主主义革命区别于旧民主主义革命的特征？（多选）', opts: ['由无产阶级领导', '属于世界无产阶级革命的一部分', '以社会主义为前途', '由资产阶级领导'], ans: [0, 1, 2] },
  { q: '毛泽东认识论的主要观点包括（多选）', opts: ['实践是认识的来源', '认识需要回到实践中检验', '反对本本主义', '知识是天生的'], ans: [0, 1, 2] },
  { q: '社会主义革命和建设中毛泽东强调（多选）', opts: ['从中国实际出发', '探索适合中国国情的道路', '照搬别国经验', '独立自主'], ans: [0, 1, 3] },
  { q: '以下属于毛泽东思想形成背景的有（多选）', opts: ['半殖民地半封建的国情', '新民主主义革命的实践', '社会主义建设的探索', '西方资本主义经验'], ans: [0, 1, 2] },
  { q: '武装斗争思想认为（多选）', opts: ['武装斗争是中国革命的主要形式', '要坚持党对军队的绝对领导', '要依靠人民战争', '军队可以脱离党的领导'], ans: [0, 1, 2] },
  { q: '关于调查研究正确的说法有（多选）', opts: ['是实事求是的基础', '没有调查就没有发言权', '调查就是解决问题', '可以脱离实际'], ans: [0, 1, 2] },
  { q: '新民主主义经济纲领包括（多选）', opts: ['没收官僚资本', '保护民族工商业', '消灭一切私有制', '发展民族经济'], ans: [0, 1, 3] },
  { q: '以下哪些属于正确处理人民内部矛盾的方法？（多选）', opts: ['民主协商', '说服教育', '团结—批评—团结', '残酷斗争'], ans: [0, 1, 2] },
  { q: '党的建设需要反对的不良倾向包括（多选）', opts: ['主观主义', '宗派主义', '形式主义', '党八股'], ans: [0, 1, 3] },
  { q: '统一战线在不同阶段的联合对象会（多选）', opts: ['随主要矛盾变化而调整', '在不同时期有所不同', '始终固定不变', '原则是团结大多数'], ans: [0, 1, 3] },
  { q: '关于矛盾分析正确的说法有（多选）', opts: ['矛盾普遍存在', '矛盾推动事物发展', '要抓住主要矛盾', '矛盾可以完全消除'], ans: [0, 1, 2] },
  { q: '人民内部矛盾与敌我矛盾的区别在于（多选）', opts: ['性质不同', '处理方法不同', '没有区别', '前者用民主方法，后者用专政方法'], ans: [0, 1, 3] },
  { q: '以下属于毛泽东提出的重要概念的有（多选）', opts: ['实事求是', '群众路线', '一国两制', '独立自主'], ans: [0, 1, 3] },
  { q: '理论联系实际要求（多选）', opts: ['把马克思主义基本原理同中国实际结合', '反对本本主义', '照搬书本', '实践是检验真理的标准'], ans: [0, 1, 3] },
  { q: '新民主主义革命胜利的历史意义包括（多选）', opts: ['为中国走向社会主义创造了前提', '改变了世界政治格局', '证明了毛泽东思想的正确性', '直接实现了共产主义'], ans: [0, 1, 2] },
  { q: '以下属于群众路线内容的有（多选）', opts: ['一切为了群众', '一切依靠群众', '从群众中来，到群众中去', '领导干部必须远离群众'], ans: [0, 1, 2] },
  { q: '关于独立自主正确的说法有（多选）', opts: ['立足本国国情', '不照搬外国经验', '走自己的路', '完全闭关自守'], ans: [0, 1, 2] },
  { q: '调查研究应该（多选）', opts: ['深入实际', '实事求是', '走马观花', '以实践检验'], ans: [0, 1, 3] },
  { q: '毛泽东思想的当代价值体现在（多选）', opts: ['提供立场观点方法', '坚持群众路线的指导意义', '独立自主的战略定力', '已完全过时'], ans: [0, 1, 2] },
];

// --- State ---
const state = {
  energy: { truth: 0, mass: 0, indep: 0 },
  round: 0, allocA: null, allocB: null,
  charA: 'expert', charB: 'leader',
  // Hero: expert defends every round
  defenseAttr: null,   // expert's defense for current round
  // Villain: peek at one attribute every round
  villainPeeked: false,
  // Quiz bonuses for current round
  heroABonus: 0, heroBBonus: 0, villainBonus: 0,
  // Current round
  heroAPush: null, heroBPush: null, villainDamage: null,
  roundStartEnergy: { truth: 0, mass: 0, indep: 0 },
  // Quiz state
  quizIdx: 0,            // 0=单选, 1=填空, 2=多选
  usedSingle: [], usedFill: [], usedMulti: [],
  history: [], _result: null,
  timerInterval: null, timerSeconds: 30,
};

// --- Helpers ---
function $(id) { return document.getElementById(id); }
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $(`screen-${name}`);
  if (el) el.classList.add('active');
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function allocTotal(a) { return a ? a.truth + a.mass + a.indep : 0; }

function randomAssignChars() {
  if (Math.random() < 0.5) { state.charA = 'expert'; state.charB = 'leader'; }
  else { state.charA = 'leader'; state.charB = 'expert'; }
}
function getCharName(p) {
  const c = p === 'A' ? state.charA : state.charB;
  return c === 'expert' ? '专家' : '领袖';
}

function getPlayerByChar(char) {
  return state.charA === char ? 'A' : 'B';
}

function getPlayerBonus(player) {
  return player === 'A' ? state.heroABonus : state.heroBBonus;
}

function applyEnergyDelta(delta) {
  ATTR_KEYS.forEach(attr => { state.energy[attr] += delta[attr]; });
}

function getRoundEffects() {
  const effects = { truth: 0, mass: 0, indep: 0 };
  ATTR_KEYS.forEach(attr => {
    effects[attr] = state.energy[attr] - state.roundStartEnergy[attr];
  });
  return effects;
}

function pickFrom(arr, used) {
  const avail = arr.filter((_, i) => !used.includes(i));
  if (avail.length === 0) { used.length = 0; return pickFrom(arr, used); }
  const idx = arr.indexOf(avail[Math.floor(Math.random() * avail.length)]);
  used.push(idx);
  return { ...arr[idx], _idx: idx };
}

// --- Init ---
function init() {
  $('btn-start').addEventListener('click', startGame);
  $('btn-rules').addEventListener('click', () => showScreen('rules'));
  $('btn-rules-back').addEventListener('click', () => showScreen('title'));
  $('btn-restart').addEventListener('click', restartGame);
  setupSetupAlloc('A'); $('btn-setup-A-confirm').addEventListener('click', confirmSetupA);
  setupSetupAlloc('B'); $('btn-setup-B-confirm').addEventListener('click', confirmSetupB);
  $('btn-nego-end').addEventListener('click', endNegotiation);
  $('btn-play-A-confirm').addEventListener('click', () => confirmPlay('A'));
  $('btn-play-B-confirm').addEventListener('click', () => confirmPlay('B'));
  $('btn-play-V-confirm').addEventListener('click', confirmVillainPlay);
  $('btn-next-round').addEventListener('click', startBuzzer);
  $('btn-game-over').addEventListener('click', showGameOver);
}

function startGame() {
  randomAssignChars();
  state.usedSingle = []; state.usedFill = []; state.usedMulti = [];
  $('setup-A-char').textContent = getCharName('A');
  $('setup-B-char').textContent = getCharName('B');
  showScreen('setup-A');
}

// --- Setup ---
function setupSetupAlloc(player) {
  const screen = $(`screen-setup-${player}`);
  const alloc = { truth: 0, mass: 0, indep: 0 };
  ATTR_KEYS.forEach(attr => {
    const row = screen.querySelector(`.alloc-row .${attr}`).closest('.alloc-row');
    row.querySelector('.minus').addEventListener('click', () => {
      if (alloc[attr] > 0) { alloc[attr]--; updateSetupUI(player, alloc); }
    });
    row.querySelector('.plus').addEventListener('click', () => {
      if (allocTotal(alloc) < 5) { alloc[attr]++; updateSetupUI(player, alloc); }
    });
  });
  screen._alloc = alloc;
  updateSetupUI(player, alloc);
}
function updateSetupUI(player, alloc) {
  const t = allocTotal(alloc);
  ATTR_KEYS.forEach(a => { $(`alloc-${player}-${a}`).textContent = alloc[a]; });
  $(`alloc-${player}-remain`).textContent = 5 - t;
  $(`btn-setup-${player}-confirm`).disabled = t !== 5;
}
function confirmSetupA() {
  if (allocTotal($('screen-setup-A')._alloc) !== 5) return;
  state.allocA = { ...$('screen-setup-A')._alloc };
  showScreen('setup-B');
}
function confirmSetupB() {
  if (allocTotal($('screen-setup-B')._alloc) !== 5) return;
  state.allocB = { ...$('screen-setup-B')._alloc };
  state.energy = {
    truth: state.allocA.truth + state.allocB.truth,
    mass:  state.allocA.mass  + state.allocB.mass,
    indep: state.allocA.indep + state.allocB.indep,
  };
  state.round = 0; state.history = []; state.defenseAttr = null;
  state.heroAPush = null; state.heroBPush = null; state.villainDamage = null;
  state.roundStartEnergy = { ...state.energy };
  state._result = null;
  startBuzzer();
}

// ====== 抢答环节（主持人主导） ======
function startBuzzer() {
  state.round++;
  state.heroAPush = null; state.heroBPush = null; state.villainDamage = null;
  state.defenseAttr = null; state.villainPeeked = false;
  state.heroABonus = 0; state.heroBBonus = 0; state.villainBonus = 0;
  state.roundStartEnergy = { ...state.energy };
  state.quizIdx = 0;

  $('buzzer-round').textContent = state.round;
  updateBuzzerScores();
  resetBuzzerBody();
  renderQuizQuestion();
  showScreen('buzzer');
}

function resetBuzzerBody() {
  $('buzzer-body').innerHTML = `
    <div class="buzzer-q" id="buzzer-q"></div>
    <div class="buzzer-opts" id="buzzer-opts"></div>
    <div class="buzzer-answer-box" id="buzzer-answer"></div>
    <div class="buzzer-result" id="buzzer-result"></div>
  `;
}

function renderQuizQuestion() {
  const idx = state.quizIdx;
  const types = ['单选题', '填空题', '多选题'];

  let question, typeLabel;
  if (idx === 0) {
    question = pickFrom(Q_SINGLE, state.usedSingle);
    typeLabel = '单选';
  } else if (idx === 1) {
    question = pickFrom(Q_FILL, state.usedFill);
    typeLabel = '填空';
  } else {
    question = pickFrom(Q_MULTI, state.usedMulti);
    typeLabel = '多选';
  }
  state._currentQ = question;
  state._currentType = idx;

  $('buzzer-qnum').textContent = `${idx + 1}/3 · ${typeLabel}`;
  $('buzzer-q').textContent = question.q;

  const optsDiv = $('buzzer-opts');
  const answerDiv = $('buzzer-answer');
  optsDiv.innerHTML = '';
  answerDiv.innerHTML = '';

  if (idx === 0) {
    // 单选：显示选项
    question.opts.forEach((opt, i) => {
      const div = document.createElement('div');
      div.className = 'buzzer-opt-item';
      div.textContent = String.fromCharCode(65 + i) + '. ' + opt;
      if (i === question.ans) div.classList.add('correct-answer');
      optsDiv.appendChild(div);
    });
    answerDiv.innerHTML = '<strong>正确答案：</strong>' +
      String.fromCharCode(65 + question.ans) + '. ' + question.opts[question.ans];
  } else if (idx === 1) {
    // 填空
    optsDiv.innerHTML = '<div class="fill-blank">________</div>';
    answerDiv.innerHTML = '<strong>正确答案：</strong>' + question.ans;
  } else {
    // 多选
    question.opts.forEach((opt, i) => {
      const div = document.createElement('div');
      div.className = 'buzzer-opt-item';
      div.textContent = String.fromCharCode(65 + i) + '. ' + opt;
      if (question.ans.includes(i)) div.classList.add('correct-answer');
      optsDiv.appendChild(div);
    });
    answerDiv.innerHTML = '<strong>正确答案：</strong>' +
      question.ans.map(i => String.fromCharCode(65 + i)).join('、');
  }

  // Result buttons
  $('buzzer-result').innerHTML = `
    <button class="btn-buzzer-hero" id="btn-buzzer-expert">专家 +1</button>
    <button class="btn-buzzer-hero" id="btn-buzzer-leader">领袖 +1</button>
    <button class="btn-buzzer-villain" id="btn-buzzer-hacker">黑客 +1</button>
  `;

  $('btn-buzzer-expert').addEventListener('click', () => awardBuzzer('expert'));
  $('btn-buzzer-leader').addEventListener('click', () => awardBuzzer('leader'));
  $('btn-buzzer-hacker').addEventListener('click', () => awardBuzzer('hacker'));
}

function awardBuzzer(winner) {
  if (winner === 'expert' || winner === 'leader') {
    const player = getPlayerByChar(winner);
    if (player === 'A') state.heroABonus++;
    else state.heroBBonus++;
  } else if (winner === 'hacker') {
    state.villainBonus++;
  }

  updateBuzzerScores();

  state.quizIdx++;
  if (state.quizIdx < 3) {
    renderQuizQuestion();
  } else {
    // All 3 questions done
    $('buzzer-body').innerHTML = `
      <div style="text-align:center;padding:16px;">
        <h3 style="color:var(--gold);margin-bottom:12px;">抢答结束</h3>
        <p style="color:var(--text-dim);line-height:1.8;">
          专家奖励：<strong style="color:#4ecdc4;">+${getPlayerBonus(getPlayerByChar('expert'))}</strong> 推进点<br>
          领袖奖励：<strong style="color:#45aaf2;">+${getPlayerBonus(getPlayerByChar('leader'))}</strong> 推进点<br>
          黑客奖励：<strong style="color:#fc5c65;">+${state.villainBonus}</strong> 伤害点
        </p>
        <div class="status-summary">${buildStatusSummaryHTML()}</div>
        <button id="btn-buzzer-done" class="btn-primary" style="margin-top:12px;">进入谈判</button>
      </div>`;
    $('btn-buzzer-done').addEventListener('click', startNegotiation);
  }
}

function updateBuzzerScores() {
  $('buzzer-expert-bonus').textContent = getPlayerBonus(getPlayerByChar('expert'));
  $('buzzer-leader-bonus').textContent = getPlayerBonus(getPlayerByChar('leader'));
  $('buzzer-hacker-bonus').textContent = state.villainBonus;
}

// ====== 谈判 ======
function startNegotiation() {
  state.timerSeconds = 30;
  $('round-num').textContent = state.round;
  updateExactBars('public');
  updateTimerDisplay();
  $('timer-ring').classList.remove('warning', 'danger');
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(tickTimer, 1000);
  showScreen('negotiation');
}
function tickTimer() {
  state.timerSeconds--;
  updateTimerDisplay();
  const ring = $('timer-ring');
  ring.classList.remove('warning', 'danger');
  if (state.timerSeconds <= 10) ring.classList.add('danger');
  else if (state.timerSeconds <= 15) ring.classList.add('warning');
  if (state.timerSeconds <= 0) endNegotiation();
}
function updateTimerDisplay() {
  $('timer-text').textContent = state.timerSeconds;
  $('timer-circle').style.strokeDashoffset = 326.73 * (1 - state.timerSeconds / 30);
}
function endNegotiation() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
  startHeroPlay('A');
}

// --- Bars & Public Status ---
function getStatusInfo(val) {
  let label;
  if (val > 7) label = '临门';
  else if (val >= 3) label = '正常';
  else label = '危机';
  return { label, color: STATUS_COLORS[label] };
}

function getStatusCounts() {
  const counts = {};
  ATTR_KEYS.forEach(attr => {
    const info = getStatusInfo(state.energy[attr]);
    counts[info.label] = (counts[info.label] || 0) + 1;
  });
  return counts;
}

function buildStatusSummaryHTML() {
  const counts = getStatusCounts();
  const order = ['临门', '正常', '危机'];
  const parts = order
    .filter(label => counts[label])
    .map(label => `<span style="color:${STATUS_COLORS[label]};">${label} ${counts[label]} 个</span>`);
  return '<strong>主持人可透露：</strong>' + parts.join('，');
}
function updateExactBars(suffix) {
  ATTR_KEYS.forEach(attr => {
    const val = state.energy[attr];
    const bar = $(`bar-${attr}-${suffix}`);
    const valEl = $(`val-${attr}-${suffix}`);
    if (bar) bar.style.width = (clamp(val, 0, 10) * 10) + '%';
    if (valEl) valEl.textContent = val;
  });
}

// ====== Hero Play ======
function startHeroPlay(player) {
  const pushPoints = getHeroPushPoints(player);
  const bonus = getPlayerBonus(player);
  const screen = $(`screen-play-${player}`);
  const alloc = { truth: 0, mass: 0, indep: 0 };
  screen._alloc = alloc;

  $(`play-${player}-char`).textContent = getCharName(player);
  $(`play-${player}-round`).textContent = state.round;
  $(`play-${player}-base`).textContent = getHeroBase(player);
  $(`play-${player}-bonus`).textContent = bonus > 0 ? ' + 抢答' + bonus + ' = ' + pushPoints : '';
  $(`play-${player}-total`).textContent = pushPoints;

  setupPlayAlloc(player, alloc, pushPoints);
  updatePlayUI(player, alloc, pushPoints);

  // Expert defense: rebuild 3 small buttons from scratch
  const char = player === 'A' ? state.charA : state.charB;
  const defGroup = $(`defense-group-${player}`);
  if (char === 'expert') {
    defGroup.style.display = 'block';
    const btnsDiv = defGroup.querySelector('.defense-btns');
    btnsDiv.innerHTML = '';
    ATTR_KEYS.forEach(attr => {
      const btn = document.createElement('button');
      btn.className = 'btn-defense-sm';
      btn.dataset.attr = attr;
      btn.textContent = state.defenseAttr === attr ? '🛡️ ' + ATTR_NAMES[attr] : ATTR_NAMES[attr];
      if (state.defenseAttr) {
        btn.disabled = true;
        if (state.defenseAttr === attr) btn.classList.add('defense-selected');
      }
      btn.addEventListener('click', () => {
        if (state.defenseAttr) return;
        state.defenseAttr = attr;
        // Disable all and highlight selected
        btnsDiv.querySelectorAll('.btn-defense-sm').forEach(b => {
          b.disabled = true;
          b.classList.remove('defense-selected');
          if (b.dataset.attr === attr) { b.classList.add('defense-selected'); b.textContent = '🛡️ ' + ATTR_NAMES[attr]; }
        });
        updatePlayUI(player, alloc, pushPoints);
      });
      btnsDiv.appendChild(btn);
    });
  } else {
    defGroup.style.display = 'none';
  }

  // Confirm button — same logic for all point counts (including 0)
  const confirmBtn = $('btn-play-' + player + '-confirm');
  confirmBtn.disabled = !canConfirmHeroPlay(player, alloc, pushPoints);
  confirmBtn.textContent = '确认推进，交给' + (player === 'A' ? '正方B' : '黑客');
  showScreen('play-' + player);
}

function getHeroBase(player) {
  const char = player === 'A' ? state.charA : state.charB;
  return char === 'leader' ? 2 : 0;
}
function getHeroPushPoints(player) {
  return getHeroBase(player) + getPlayerBonus(player);
}

function setupPlayAlloc(player, alloc, maxPoints) {
  const screen = $(`screen-play-${player}`);
  ATTR_KEYS.forEach(attr => {
    const row = screen.querySelector(`.play-alloc-row.${attr}`);
    const minus = row.querySelector('.minus');
    const plus = row.querySelector('.plus');
    const nm = minus.cloneNode(true); const np = plus.cloneNode(true);
    minus.parentNode.replaceChild(nm, minus);
    plus.parentNode.replaceChild(np, plus);
    nm.addEventListener('click', () => {
      if (alloc[attr] > 0) { alloc[attr]--; updatePlayUI(player, alloc, maxPoints); }
    });
    np.addEventListener('click', () => {
      if (allocTotal(alloc) < maxPoints) { alloc[attr]++; updatePlayUI(player, alloc, maxPoints); }
    });
  });
}

function updatePlayUI(player, alloc, maxPoints) {
  const t = allocTotal(alloc);
  ATTR_KEYS.forEach(a => { $(`push-${player}-${a}`).textContent = alloc[a]; });
  $(`push-${player}-remain`).textContent = maxPoints - t;
  $(`btn-play-${player}-confirm`).disabled = !canConfirmHeroPlay(player, alloc, maxPoints);
}

function canConfirmHeroPlay(player, alloc, maxPoints) {
  const char = player === 'A' ? state.charA : state.charB;
  const pointsDone = allocTotal(alloc) === maxPoints;
  const defenseDone = char !== 'expert' || !!state.defenseAttr;
  return pointsDone && defenseDone;
}

function confirmPlay(player) {
  const screen = $(`screen-play-${player}`);
  if (player === 'A' && state.heroAPush) return;
  if (player === 'B' && state.heroBPush) return;
  if (allocTotal(screen._alloc) !== getHeroPushPoints(player)) return;
  const char = player === 'A' ? state.charA : state.charB;
  if (char === 'expert' && !state.defenseAttr) return;
  if (player === 'A') {
    state.heroAPush = { ...screen._alloc };
    applyEnergyDelta(state.heroAPush);
    startHeroPlay('B');
  } else if (player === 'B') {
    state.heroBPush = { ...screen._alloc };
    applyEnergyDelta(state.heroBPush);
    startVillainPlay();
  }
}

// ====== Villain Play (peek + damage on one page) ======
function startVillainPlay() {
  state.villainPeeked = false;
  const totalDamage = 3 + state.villainBonus;
  const alloc = { truth: 0, mass: 0, indep: 0 };
  $('screen-play-V')._alloc = alloc;
  $('play-V-round').textContent = state.round;
  $('play-V-total').textContent = totalDamage;
  $('play-V-base').textContent = 3;
  $('play-V-bonus').textContent = state.villainBonus > 0 ? ' + 抢答' + state.villainBonus + ' = ' + totalDamage : '';

  // No status bars or defense information — hacker sees only the peeked value.

  // Reset peek buttons and result
  $('peek-result').textContent = '';
  ATTR_KEYS.forEach(attr => {
    const btn = $(`peek-btn-${attr}`);
    btn.disabled = false;
    btn.style.opacity = '1';
  });

  // Wire up peek buttons (clone to remove old listeners)
  ATTR_KEYS.forEach(attr => {
    const btn = $(`peek-btn-${attr}`);
    const nbtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(nbtn, btn);
    nbtn.addEventListener('click', () => {
      if (state.villainPeeked) return;
      state.villainPeeked = true;
      $('peek-result').innerHTML = '🔍 ' + ATTR_NAMES[attr] + ' = <strong style="color:#fc5c65;font-size:1.3rem;">' + state.energy[attr] + '</strong>';
      ATTR_KEYS.forEach(a => { $(`peek-btn-${a}`).disabled = true; $(`peek-btn-${a}`).style.opacity = '0.4'; });
    });
  });

  setupVillainAlloc(alloc, totalDamage);
  updateVillainUI(alloc, totalDamage);
  $('btn-play-V-confirm').disabled = true;
  showScreen('play-V');
}

function setupVillainAlloc(alloc, maxPoints) {
  const screen = $('screen-play-V');
  ATTR_KEYS.forEach(attr => {
    const row = screen.querySelector(`.villain-alloc-row.${attr}`);
    const minus = row.querySelector('.minus');
    const plus = row.querySelector('.plus');
    const nm = minus.cloneNode(true); const np = plus.cloneNode(true);
    minus.parentNode.replaceChild(nm, minus);
    plus.parentNode.replaceChild(np, plus);
    nm.addEventListener('click', () => {
      if (alloc[attr] > 0) { alloc[attr]--; updateVillainUI(alloc, maxPoints); }
    });
    np.addEventListener('click', () => {
      if (allocTotal(alloc) < maxPoints) { alloc[attr]++; updateVillainUI(alloc, maxPoints); }
    });
  });
}

function updateVillainUI(alloc, maxPoints) {
  const t = allocTotal(alloc);
  ATTR_KEYS.forEach(a => { $(`dmg-${a}`).textContent = alloc[a]; });
  $('dmg-remain').textContent = maxPoints - t;
  const maxSingle = Math.max(alloc.truth, alloc.mass, alloc.indep);
  $('dmg-warn').style.display = maxSingle > 3 ? 'block' : 'none';
  if (maxSingle > 3) $('dmg-warn').textContent = '⚠️ 单个属性最多 3 点伤害';
  $('btn-play-V-confirm').disabled = t !== maxPoints;
}

function confirmVillainPlay() {
  if (state.villainDamage) return;
  const alloc = $('screen-play-V')._alloc;
  if (allocTotal(alloc) !== 3 + state.villainBonus) return;
  const damage = { truth: 0, mass: 0, indep: 0 };
  ATTR_KEYS.forEach(attr => { damage[attr] = -(Math.min(alloc[attr], 3)); });
  // Expert defense
  if (state.defenseAttr) damage[state.defenseAttr] = 0;
  state.villainDamage = damage;
  applyEnergyDelta(state.villainDamage);
  resolve();
}

// ====== Resolution ======
function resolve() {
  const before = { ...state.roundStartEnergy };
  const effects = getRoundEffects();

  const over10 = ATTR_KEYS.filter(a => state.energy[a] > 10).length;
  const below0 = ATTR_KEYS.filter(a => state.energy[a] < 0).length;
  let gameOver = false, result = '';
  if (below0 >= 1) { gameOver = true; result = 'lose'; }
  else if (over10 >= 1) { gameOver = true; result = 'win'; }
  state._result = result;

  state.history.push({ round: state.round, before: { ...before },
    heroAPush: state.heroAPush ? { ...state.heroAPush } : null,
    heroBPush: state.heroBPush ? { ...state.heroBPush } : null,
    villainDamage: state.villainDamage ? { ...state.villainDamage } : null,
    defense: state.defenseAttr, effects: { ...effects }, after: { ...state.energy } });

  renderResolution(effects, result, gameOver);
  $('btn-next-round').style.display = gameOver ? 'none' : 'inline-block';
  $('btn-game-over').style.display = gameOver ? 'inline-block' : 'none';
  $('resolve-round').textContent = state.round;
  state.defenseAttr = null;
  showScreen('resolution');
}

function renderResolution(effects, result, gameOver) {
  $('reveal-card-A').innerHTML = state.heroAPush ? buildPushHTML('正方A', state.heroAPush, true) : '<div class="rc-name">未推进</div>';
  $('reveal-card-B').innerHTML = state.heroBPush ? buildPushHTML('正方B', state.heroBPush, true) : '<div class="rc-name">未推进</div>';
  $('reveal-card-V').innerHTML = state.villainDamage ? buildPushHTML('黑客', state.villainDamage, false) : '<div class="rc-name">未打击</div>';
  let summary = '';
  ATTR_KEYS.forEach(attr => {
    const net = effects[attr];
    if (net === 0) return;
    const cls = net > 0 ? 'net-positive' : 'net-negative';
    summary += `${ATTR_NAMES[attr]}：<span class="${cls}">${net > 0 ? '+' : ''}${net}</span> &nbsp;`;
  });
  if (state.defenseAttr && state.history.length > 0 && state.history[state.history.length - 1].defense) {
    summary += '<br>🛡️ <span style="color:#4ecdc4">专家防御：' + ATTR_NAMES[state.defenseAttr] + ' 免受伤害</span>';
  }
  $('effect-summary').innerHTML = summary || '本轮无净变化';
  updateExactBars('resolve');
  const rd = $('resolve-result');
  if (gameOver) {
    rd.innerHTML = result === 'win'
      ? '<span class="win">🎉 技术突破成功！正方胜利！</span>'
      : '<span class="lose">💔 科研命脉断裂！黑客胜利！</span>';
  } else { rd.innerHTML = '<span class="continue">▶ 游戏继续 — 进入下一回合</span>'; }
}

function buildPushHTML(name, points, isHero) {
  const parts = [];
  ATTR_KEYS.forEach(a => { if (points[a] !== 0) parts.push(ATTR_NAMES[a] + ' ' + (points[a] > 0 ? '+' : '') + points[a]); });
  return `<div class="rc-name">${isHero ? '🟦' : '🟥'} ${name}</div><div class="rc-effect">${parts.join('，') || '无变化'}</div>`;
}

// --- Game Over ---
function showGameOver() {
  const result = state._result || 'lose';
  $('gameover-emblem').textContent = result === 'win' ? '🎉' : '💔';
  $('gameover-title').textContent = result === 'win' ? '技术突围成功！' : '封锁得逞！';
  $('gameover-title').className = result === 'win' ? 'win-title' : 'lose-title';
  $('gameover-subtitle').textContent = result === 'win'
    ? '研发团队突破科技霸权封锁，实现了核心技术自主可控！'
    : `第 ${state.round} 回合，关键领域崩溃，研发被迫中止……`;
  $('gameover-theory').innerHTML = result === 'win'
    ? '<strong>毛概启示：</strong>毛泽东思想活的灵魂——<strong>实事求是、群众路线、独立自主</strong>，是革命和建设取得胜利的根本保证。'
    : '<strong>毛概启示：</strong><strong>实事求是、群众路线、独立自主</strong>三者是一个有机整体，缺一不可。要善于运用<strong>矛盾分析方法</strong>，抓住主要矛盾，集中力量突破关键瓶颈。';
  $('gameover-stats').innerHTML = `共经历 <strong>${state.round}</strong> 回合 | 实事求是 <strong>${state.energy.truth}</strong> | 群众路线 <strong>${state.energy.mass}</strong> | 独立自主 <strong>${state.energy.indep}</strong>`;
  showScreen('gameover');
}

function restartGame() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
  Object.assign(state, {
    energy: { truth: 0, mass: 0, indep: 0 }, round: 0, allocA: null, allocB: null,
    defenseAttr: null, villainPeeked: false,
    heroAPush: null, heroBPush: null, villainDamage: null,
    heroABonus: 0, heroBBonus: 0, villainBonus: 0,
    roundStartEnergy: { truth: 0, mass: 0, indep: 0 },
    usedSingle: [], usedFill: [], usedMulti: [],
    history: [], _result: null, timerSeconds: 30,
  });
  ['A', 'B'].forEach(p => {
    ATTR_KEYS.forEach(a => { $(`alloc-${p}-${a}`).textContent = '0'; });
    $(`alloc-${p}-remain`).textContent = '5';
    $(`btn-setup-${p}-confirm`).disabled = true;
    const s = $(`screen-setup-${p}`);
    if (s._alloc) { s._alloc.truth = 0; s._alloc.mass = 0; s._alloc.indep = 0; }
  });
  randomAssignChars();
  showScreen('title');
}

document.addEventListener('DOMContentLoaded', init);

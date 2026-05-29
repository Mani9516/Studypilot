/**
 * Hindi-subject quiz: questions and options fully in Hindi.
 */
import { refineMcqOptions } from '../utils/quizOptionQuality'

function rotateOptions(options, correctIndex, seed) {
  const tagged = options.map((text, i) => ({ text, isCorrect: i === correctIndex }))
  const n = tagged.length
  const start = Math.abs(seed) % n
  const rotated = [...tagged.slice(start), ...tagged.slice(0, start)]
  return {
    options: rotated.map((x) => x.text),
    correctIndex: rotated.findIndex((x) => x.isCorrect),
  }
}

function poolAt(spec, level) {
  return (
    spec.levels[level] ??
    spec.levels[3] ??
    spec.levels[2] ??
    spec.levels[1] ??
    Object.values(spec.levels).flat()
  )
}

function allHindiItems(spec) {
  if (!spec?.levels) return []
  const seen = new Set()
  const out = []
  for (const items of Object.values(spec.levels)) {
    for (const item of items) {
      const key = item.prompt
      if (!seen.has(key)) {
        seen.add(key)
        out.push(item)
      }
    }
  }
  return out
}

function pick(spec, topic, level, variant) {
  const pool = allHindiItems(spec)
  const fallback = poolAt(spec, level)
  const list = pool.length ? pool : fallback
  if (!list.length) return null
  const item = list[(variant + level) % list.length]
  const rotated = rotateOptions(item.options, item.correctIndex, variant + level)
  return {
    prompt: item.prompt.replace(/\{topic\}/g, topic),
    options: rotated.options,
    correctIndex: rotated.correctIndex,
  }
}

/** @type {Record<string, { levels: Record<number, Array<{prompt:string,options:string[],correctIndex:number}> }>}> */
const HINDI_BY_TITLE = {
  'स्वर और व्यंजन': {
    levels: {
      1: [{
        prompt: '“{topic}” में हम क्या सीखते हैं?',
        options: ['हिंदी के स्वर (अ, आ, इ…) और व्यंजन (क, ख, ग…)', 'केवल अंग्रेज़ी अक्षर', 'गणित के भिन्न', 'नक्शे की दिशाएँ'],
        correctIndex: 0,
      }],
      2: [{
        prompt: 'व्यंजन “क” में कौन-सा स्वर मिलाने पर “का” बनता है?',
        options: ['अ', 'ई की मात्रा', 'ऊ की मात्रा', 'कोई मात्रा नहीं'],
        correctIndex: 0,
      }],
    },
  },
  मात्राएँ: {
    levels: {
      1: [{
        prompt: '“{topic}” से हम सीखते हैं कि मात्राएँ:',
        options: ['स्वर की ध्वनि बदलती हैं (जैसे क + ई = की)', 'अक्षर गायब कर देती हैं', 'केवल संख्या लिखती हैं', 'व्याकरण नहीं बदलती'],
        correctIndex: 0,
      }],
    },
  },
  'शब्द निर्माण': {
    levels: {
      1: [{
        prompt: '“{topic}” का अर्थ है:',
        options: ['अक्षर मिलाकर छोटे-बड़े शब्द बनाना', 'केवल गिनती 1 से 10', 'नदियों के नाम', 'विज्ञान प्रयोग'],
        correctIndex: 0,
      }],
    },
  },
  'वाक्य निर्माण': {
    levels: {
      1: [{
        prompt: '“{topic}” में सही वाक्य कौन-सा है?',
        options: ['राम स्कूल जाता है।', 'स्कूल राम जाता है।', 'जाता राम स्कूल।', 'राम स्कूल।'],
        correctIndex: 0,
      }],
    },
  },
  संज्ञा: {
    levels: {
      2: [{
        prompt: '“{topic}” किस शब्द-भेद की पहचान कराती है?',
        options: ['नाम, व्यक्ति, स्थान या वस्तु का बोध', 'केवल काम करने वाले शब्द', 'केवल समय बताने वाले शब्द', 'केवल गिनती'],
        correctIndex: 0,
      }],
    },
  },
  सर्वनाम: {
    levels: {
      2: [{
        prompt: '“{topic}” में “वह”, “मैं”, “तुम” क्या हैं?',
        options: ['संज्ञा की जगह प्रयोग होने वाले शब्द', 'केवल रंग के नाम', 'केवल जानवरों के घर', 'केवल दिन के नाम'],
        correctIndex: 0,
      }],
    },
  },
  विशेषण: {
    levels: {
      2: [{
        prompt: '“{topic}” वाले शब्द किसका गुण बताते हैं?',
        options: ['संज्ञा की विशेषता (जैसे लाल, मीठा, बड़ा)', 'केवल क्रिया', 'केवल विराम चिह्न', 'केवल संख्या'],
        correctIndex: 0,
      }],
    },
  },
  क्रिया: {
    levels: {
      3: [{
        prompt: '“{topic}” से हम पहचानते हैं:',
        options: ['काम या अवस्था बताने वाले शब्द', 'केवल फल के नाम', 'केवल नदियों के नाम', 'केवल ग्रहों की दूरी'],
        correctIndex: 0,
      }],
    },
  },
  काल: {
    levels: {
      3: [{
        prompt: '“{topic}” क्रिया के साथ बताता है:',
        options: ['समय — भूत, वर्तमान या भविष्य', 'केवल रंग', 'केवल आकार', 'केवल दूरी'],
        correctIndex: 0,
      }],
    },
  },
  'पर्यायवाची शब्द': {
    levels: {
      3: [{
        prompt: '“{topic}” का मतलब है:',
        options: ['समान अर्थ वाले अलग-अलग शब्द', 'विपरीत अर्थ वाले शब्द', 'केवल मुहावरे', 'केवल संक्षेप'],
        correctIndex: 0,
      }],
    },
  },
  मुहावरे: {
    levels: {
      3: [{
        prompt: '“{topic}” क्या होते हैं?',
        options: ['मुहावरे — जिनका अर्थ शाब्दिक नहीं, लाक्षणिक होता है', 'केवल वर्णमाला', 'केवल गिनती', 'केवल नक्शा'],
        correctIndex: 0,
      }],
    },
  },
  'मुहावरे और लोकोक्तियाँ': {
    levels: {
      3: [{
        prompt: '“{topic}” पाठ में हम सीखते हैं:',
        options: ['मुहावरे और लोकोक्तियाँ — अर्थ समझकर प्रयोग', 'केवल गणित सूत्र', 'केवल विज्ञान प्रयोग', 'केवल अंग्रेज़ी वाक्य'],
        correctIndex: 0,
      }],
    },
  },
  'अपठित गद्यांश': {
    levels: {
      3: [{
        prompt: '“{topic}” हल करते समय पहले आप:',
        options: ['गद्यांश ध्यान से पढ़ते हैं', 'बिना पढ़े उत्तर लिखते हैं', 'केवल शीर्षक देखते हैं', 'दूसरे विषय की किताब खोलते हैं'],
        correctIndex: 0,
      }],
    },
  },
}

const HINDI_RULES = [
  [/स्वर|व्यंजन|वर्णमाला/i, () => HINDI_BY_TITLE['स्वर और व्यंजन']],
  [/मात्रा/i, () => HINDI_BY_TITLE['मात्राएँ']],
  [/शब्द निर्माण|शब्द और वाक्य/i, () => HINDI_BY_TITLE['शब्द निर्माण']],
  [/वाक्य/i, () => HINDI_BY_TITLE['वाक्य निर्माण']],
  [/संज्ञा/i, () => HINDI_BY_TITLE['संज्ञा']],
  [/सर्वनाम/i, () => HINDI_BY_TITLE['सर्वनाम']],
  [/विशेषण/i, () => HINDI_BY_TITLE['विशेषण']],
  [/क्रिया/i, () => HINDI_BY_TITLE['क्रिया']],
  [/काल/i, () => HINDI_BY_TITLE['काल']],
  [/पर्याय/i, () => HINDI_BY_TITLE['पर्यायवाची शब्द']],
  [/मुहावरे|लोकोक्ति/i, () => HINDI_BY_TITLE['मुहावरे और लोकोक्तियाँ']],
  [/अपठित/i, () => HINDI_BY_TITLE['अपठित गद्यांश']],
  [/कविता|कविताएँ|पद्य/i, {
    levels: {
      2: [{
        prompt: '“{topic}” पाठ का उद्देश्य है:',
        options: ['काव्य की सौंदर्य और भाव समझना', 'केवल गणित के सवाल', 'केवल नक्शा पढ़ना', 'केवल विज्ञान प्रयोग'],
        correctIndex: 0,
      }],
    },
  }],
  [/कहानी/i, {
    levels: {
      2: [{
        prompt: '“{topic}” से हम सीखते हैं:',
        options: ['कथा पढ़ना, समझना और लिखने की रूपरेखा', 'केवल संख्या जोड़ना', 'केवल तारों के नाम', 'केवल इतिहास की तिथि'],
        correctIndex: 0,
      }],
    },
  }],
  [/पत्र|निबंध|अनुच्छेद|संवाद|रचनात्मक|रिपोर्ट|आलोचना|विज्ञापन/i, {
    levels: {
      2: [{
        prompt: '“{topic}” में सही लेखन शैली है:',
        options: ['स्पष्ट भाषा, उचित संरचना और विषय से जुड़ी बात', 'बिना विषय के लिखना', 'केवल एक शब्द लिखना', 'अंग्रेज़ी में पूरा पत्र'],
        correctIndex: 0,
      }],
    },
  }],
  [/व्याकरण|भाषा/i, {
    levels: {
      2: [{
        prompt: '“{topic}” से हम मजबूत करते हैं:',
        options: ['हिंदी व्याकरण के नियम और उनका प्रयोग', 'केवल गणित के सूत्र', 'केवल भौतिकी', 'केवल नक्शा'],
        correctIndex: 0,
      }],
    },
  }],
  [/गद्य|साहित्य|वसंत/i, {
    levels: {
      2: [{
        prompt: '“{topic}” पाठ में मुख्य ध्यान है:',
        options: ['गद्य/साहित्य पढ़कर भाव और प्रश्न हल करना', 'केवल गिनती', 'केवल ज्यामिति', 'केवल रासायनिक सूत्र'],
        correctIndex: 0,
      }],
    },
  }],
  [/फल|सब्ज|त्योहार|जानवर|पक्षी|परिवार/i, {
    levels: {
      1: [{
        prompt: '“{topic}” पाठ में हम सीखते हैं:',
        options: ['संबंधित शब्द, वाक्य और सामान्य ज्ञान', 'केवल गणित के भिन्न', 'केवल विज्ञान के सूत्र', 'केवल अंग्रेज़ी वर्णमाला'],
        correctIndex: 0,
      }],
    },
  }],
  [/नाटक/i, {
    levels: {
      3: [{
        prompt: '“{topic}” में कौन-सी बात महत्वपूर्ण है?',
        options: ['संवाद, दृश्य और पात्रों की भूमिका', 'केवल गणित', 'केवल नक्शा', 'केवल तिथि याद करना'],
        correctIndex: 0,
      }],
    },
  }],
]

function genericHindi(topic, level, variant, slot = 0) {
  const templates = [
    {
      prompt: '“{topic}” पाठ से संबंधित सही बात कौन-सी है?',
      correct: `पाठ “${topic}” के मुख्य विचार और शब्दार्थ`,
      wrongs: [
        `अलग-अलग शब्द बिना संबंध — “${topic}” से`,
        `सही लगने वाली बात जो “${topic}” वीडियो में नहीं थी`,
        `आधा सही विचार पर “${topic}” की पूरी परिभाषा अधूरी`,
      ],
    },
    {
      prompt: '“{topic}” पढ़ने के बाद आपको याद रहना चाहिए:',
      correct: `वीडियो/पाठ में सिखाई गई मुख्य बातें`,
      wrongs: [
        `केवल पृष्ठ संख्या, “${topic}” का अर्थ नहीं`,
        `दूसरी इकाई का सूत्र जो “${topic}” से मेल नहीं खाता`,
        `नारा जो “${topic}” की व्याख्या में कभी नहीं आया`,
      ],
    },
    {
      prompt: 'हिंदी पाठ “{topic}” से आप मुख्यतः क्या सीखते हैं?',
      correct: `“${topic}” से जुड़े शब्द, अर्थ और नियम`,
      wrongs: [
        `केवल शीर्षक लिखना, भीतर की बात नहीं`,
        `मिलते-जुलते नाम वाले दूसरे विषय के उद्देश्य`,
        `सामान्य पढ़ने की सलाह जो “${topic}” के लक्ष्य नहीं बदलती`,
      ],
    },
    {
      prompt: '“{topic}” का सही अर्थ और प्रयोग कक्षा में:',
      correct: `शिक्षक और पाठ के उदाहरणों के अनुसार`,
      wrongs: [
        `हल किए उदाहरण के उलट निष्कर्ष — “${topic}”`,
        `पड़ोसी अध्याय की विधि जो इस “${topic}” प्रश्न में फिट नहीं`,
        `होमवर्क शॉर्टकट जो पुस्तक के चरण छोड़ दे — “${topic}”`,
      ],
    },
    {
      prompt: '“{topic}” पर अच्छा प्रदर्शन करने के लिए:',
      correct: `पाठ के शब्द और मुख्य बिंदु समझना`,
      wrongs: [
        `लंबे शब्द जो “${topic}” नोट्स में नहीं थे`,
        `केवल चित्र शीर्षक, पूरा खंड नहीं — “${topic}”`,
        `ऑनलाइन लेख जो आपकी पुस्तक से “${topic}” पर टकराता है`,
      ],
    },
    {
      prompt: '“{topic}” पर अभ्यास प्रश्न में प्रयोग हो:',
      correct: `पाठ में दिखाए गए तरीके`,
      wrongs: [
        `सोशल मीडिया का तरीका जो शिक्षक ने नहीं कहा`,
        `दूसरे विषय के चरण जो “${topic}” की तर्क तोड़ दें`,
        `केवल अनुमान — “${topic}” का कार्य छोड़कर`,
      ],
    },
    {
      prompt: '“{topic}” के बारे में सही कथन कौन-सा है?',
      correct: `यह आपके हिंदी पाठ्यक्रम का हिस्सा है`,
      wrongs: [
        `यह वैकल्पिक है जबकि पाठ्यक्रम में “${topic}” सूचीबद्ध है`,
        `हर अध्याय जैसा — “${topic}” नया कुछ नहीं जोड़ता`,
        `हिंदी से बाहर है जबकि शीर्षक “${topic}” है`,
      ],
    },
    {
      prompt: 'शिक्षक “{topic}” पूछें तो आप समझाएँ:',
      correct: `सही अवधारणा पाठ के शब्दों से`,
      wrongs: [
        `दूसरे अध्याय की कहानी से “${topic}” टालना`,
        `विश्वास बिना परिभाषा, उदाहरण या चरण — “${topic}”`,
        `दो अलग अर्थ मिलाकर “${topic}” की आधी याद`,
      ],
    },
    {
      prompt: '“{topic}” की कठिन कुशलता है:',
      correct: `नए उदाहरणों पर विचार लागू करना`,
      wrongs: [
        `“${topic}” का नाम लेना पर नया प्रश्न हल न कर पाना`,
        `नमूना उत्तर नकल करना बिना चरण समझे`,
        `“${topic}” को दूसरे पाठ से मिलाकर अस्पष्ट उत्तर देना`,
      ],
    },
    {
      prompt: '“{topic}” पढ़ा है — इसका संकेत:',
      correct: `पाठ की बातों से प्रश्न हल कर सकते हैं`,
      wrongs: [
        `पाठ का फॉन्ट पहचानना पर “${topic}” की बात नहीं`,
        `नाम मिलता-जुलता अध्याय से “${topic}” में भ्रम`,
        `असंबंधित उपलब्धियाँ बिना “${topic}” के सबूत`,
      ],
    },
    {
      prompt: '“{topic}” की प्रश्नपत्री में सही विकल्प:',
      correct: `अध्याय वीडियो और पाठ्यक्रम से मेल खाता है`,
      wrongs: [
        `दूसरे प्रकाशक की गाइड — आपकी “${topic}” कक्षा नहीं`,
        `अफवाह/मीम संस्कृति, “${topic}” नोट्स नहीं`,
        `पिछले टर्म का मसौदा जब “${topic}” अपडेट नहीं था`,
      ],
    },
    {
      prompt: '“{topic}” की कॉपी में होना चाहिए:',
      correct: `मुख्य बिंदु और उदाहरण`,
      wrongs: [
        `सजावटी सीमा बिना “${topic}” की परिभाषा या उदाहरण`,
        `दूसरे विषय की बिंदु सूची जहाँ “${topic}” नहीं`,
        `“${topic}” के लिए खाली जगह — बाद में भरने का वादा`,
      ],
    },
    {
      prompt: '“{topic}” में सिखाई गई बात नहीं है:',
      correct: `जो पाठ/वीडियो में कभी नहीं आई`,
      wrongs: [
        `जो वीडियो में थी`,
        `शिक्षक के उदाहरण`,
        `पाठ्यक्रम की पंक्ति के शब्द`,
      ],
    },
    {
      prompt: '“{topic}” की दोहराई (रिवीज़न) मतलब:',
      correct: `मुख्य बिंदु पढ़ें और समान प्रश्न करें`,
      wrongs: [
        `“${topic}” अस्पष्ट हो तो भी खंड न खोलना`,
        `केवल एक अनुच्छेद पढ़कर “${topic}” के अभ्यास छोड़ना`,
        `दूसरी किताब तेज़ी से जो आपके “${topic}” क्रम से नहीं मिलती`,
      ],
    },
    {
      prompt: '“{topic}” को जीवन से जोड़ने से:',
      correct: `पाठ याद रहता है और काम आता है`,
      wrongs: [
        `सटीक परिभाषाएँ छोड़कर “${topic}” पर धुंधली राय`,
        `वास्तविक कहानी को सबूत मानना जब वह “${topic}” से टकराए`,
        `केवल अनुभव — “${topic}” के अभ्यास प्रश्न नहीं`,
      ],
    },
    {
      prompt: '“{topic}” पर उन्नत जाँच — क्या कर सकते हैं?',
      correct: `सही शब्दों से दोस्त को समझाएँ`,
      wrongs: [
        `“${topic}” का शब्दजाल दोहराना बिना परिभाषा के`,
        `कठिन उदाहरण छोड़कर केवल आसान पंक्ति — “${topic}”`,
        `सरलीकृत संस्करण जो “${topic}” की मुख्य शर्त छोड़ दे`,
      ],
    },
  ]

  const t = templates[(variant + slot * 11 + level * 3) % templates.length]
  return {
    prompt: t.prompt.replace(/\{topic\}/g, topic),
    options: [t.correct, t.wrongs[0], t.wrongs[1], t.wrongs[2]],
    correctIndex: 0,
  }
}

/**
 * @param {string} topic
 * @param {number} level
 * @param {number} variant
 */
export function buildHindiTopicQuestion(topic, level, variant, slot = 0) {
  const mixVariant = variant + slot * 41
  if (HINDI_BY_TITLE[topic]) {
    const q = pick(HINDI_BY_TITLE[topic], topic, level, mixVariant + slot * 3)
    if (q) return q
  }
  for (const [re, specOrFn] of HINDI_RULES) {
    if (re.test(topic)) {
      const spec = typeof specOrFn === 'function' ? specOrFn() : specOrFn
      const q = pick(spec, topic, level, mixVariant + slot * 3)
      if (q) return q
    }
  }
  const g = genericHindi(topic, level, mixVariant, slot)
  const rotated = rotateOptions(g.options, g.correctIndex, variant + level * 3)
  return {
    prompt: g.prompt,
    options: rotated.options,
    correctIndex: rotated.correctIndex,
  }
}

export function normalizeHindiQuizItem(item, topic) {
  const t = topic || 'यह अध्याय'
  const prompt =
    item.prompt?.trim() || `“${t}” से संबंधित सही उत्तर कौन-सा है?`

  const raw = Array.isArray(item.options) ? item.options : []
  const options = raw.map((o) => String(o ?? '').trim()).filter(Boolean).slice(0, 4)

  const fillers = [
    `शिक्षक ने “${t}” से जो मुख्य बात जोड़ी`,
    `“${t}” वीडियो में न आई हुई सामान्य बात`,
    `आधा सही लेकिन “${t}” की परिभाषा अधूरी`,
    `हिंदी के दूसरे पाठ की सही बात, “${t}” के लिए नहीं`,
  ]
  while (options.length < 4) {
    options.push(fillers[options.length % fillers.length])
  }

  const correctIndex = Math.min(Math.max(0, item.correctIndex ?? 0), 3)
  const polished = refineMcqOptions(options, correctIndex, t, 'Hindi', 'hi')

  return {
    prompt,
    options: polished,
    correctIndex,
  }
}

export function getQuizUiLabels(subject) {
  if (subject === 'Hindi') {
    return {
      question: 'प्रश्न',
      options: 'विकल्प',
      lessonTopic: 'पाठ का विषय',
      difficulty: 'कठिनाई',
      adaptiveLevel: 'अनुकूल स्तर',
      score: 'अंक',
      correctNext: 'सही उत्तर — अगला प्रश्न थोड़ा कठिन होगा।',
      wrongNext: 'सही नहीं — अगला प्रश्न आसान होगा।',
      questionOf: (n, total) => `प्रश्न ${n} / ${total}`,
      quizComplete: 'प्रश्नपत्र पूरा',
      niceWork: 'बहुत अच्छे',
      returnCourse: 'पाठ्यक्रम पर वापस',
    }
  }
  return {
    question: 'Question',
    options: 'Options',
    lessonTopic: 'Lesson topic',
    difficulty: 'Difficulty',
    adaptiveLevel: 'Adaptive level',
    score: 'Score',
    correctNext: 'Correct — next question will be harder.',
    wrongNext: 'Not quite — next question will be easier.',
    questionOf: (n, total) => `Question ${n} of ${total}`,
    quizComplete: 'Quiz complete',
    niceWork: 'Nice work',
    returnCourse: 'Return to course',
  }
}

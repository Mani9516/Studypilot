/**
 * Eight fixed, distinct question frames per chapter quiz.
 * Used when the curated pool cannot supply 8 unique prompts.
 * Options are parallel in tone: each choice reads like a serious study answer.
 */

function enOptions(topic, subject, correct, wrongs) {
  return {
    options: [correct, wrongs[0], wrongs[1], wrongs[2]],
    correctIndex: 0,
  }
}

const EN_SLOTS = [
  {
    prompt: 'Your teacher explains “{topic}” in {subject}. The best summary is:',
    correct: (t) => `How the lesson connects definitions, examples, and practice for “${t}”`,
    wrongs: (t, s) => [
      `Only isolated terms from “${t}” with no link between them`,
      `A single warm-up example from “${t}” mistaken for the whole chapter`,
      `A valid ${s} idea that your book never tied to “${t}” in this unit`,
    ],
  },
  {
    prompt: 'The video for chapter “{topic}” mainly teaches students to:',
    correct: (t) => `Follow the reasoning and steps your book uses for “${t}”`,
    wrongs: (t) => [
      `Treat the chapter title “${t}” as the full answer without details`,
      `Skip examples and jump to unrelated drill sums or paragraphs`,
      `Study a different chapter that only sounds similar to “${t}”`,
    ],
  },
  {
    prompt: 'A class test on “{topic}” ({subject}) will usually check:',
    correct: (t) => `Whether you can explain and apply what “${t}” taught`,
    wrongs: (t) => [
      `Whether you can recall a random fact from another subject`,
      `Whether you can spell long words unrelated to “${t}”`,
      `Whether you memorised the video length instead of its ideas`,
    ],
  },
  {
    prompt: 'To revise “{topic}” before the quiz, you should:',
    correct: (t) => `Reread worked examples and redo similar questions on “${t}”`,
    wrongs: () => [
      `Only skim headings and skip every diagram and exercise`,
      `Reuse last year’s notes even if the chapter order changed`,
      `Avoid writing anything and rely on guesswork in the exam`,
    ],
  },
  {
    prompt: '“{topic}” is different from other chapters because it focuses on:',
    correct: (t) => `The specific outcomes listed for “${t}” in your syllabus`,
    wrongs: (t) => [
      `Repeating the exact same skills as every other chapter`,
      `Replacing all reading with unrelated games`,
      `Borrowing objectives from a topic that is not named “${t}”`,
    ],
  },
  {
    prompt: 'The main skill you build from “{topic}” in {subject} is:',
    correct: (t) => `Using the lesson method to solve or explain new “${t}” tasks`,
    wrongs: (t) => [
      `Naming “${t}” without being able to use it in a fresh problem`,
      `Copying a model answer without knowing why each step works`,
      `Blending “${t}” with another unit so the final reasoning is unclear`,
    ],
  },
  {
    prompt: 'Which example best fits what you learned in “{topic}”?',
    correct: (t) => `An example that matches the pattern the teacher modelled for “${t}”`,
    wrongs: (t) => [
      `An example that uses the right chapter title but the wrong method`,
      `An impressive fact that never appeared in your “${t}” materials`,
      `An example that argues the opposite conclusion to the lesson on “${t}”`,
    ],
  },
  {
    prompt: 'Which of these does NOT belong to the lesson “{topic}”?',
    correct: () => `A claim that your textbook never made in this chapter`,
    wrongs: (t) => [
      `A definition that was explicitly shown for “${t}”`,
      `A vocabulary item highlighted while studying “${t}”`,
      `A practice item assigned right after the “${t}” lesson`,
    ],
  },
]

const HI_SLOTS = [
  {
    prompt: 'शिक्षक “{topic}” समझाते हैं। सबसे सही सार:',
    correct: (t) => `“${t}” में परिभाषा, उदाहरण और अभ्यास कैसे जुड़ते हैं`,
    wrongs: (t) => [
      `केवल अलग-अलग शब्द बिना उनके बीच संबंध के — “${t}”`,
      `पाठ का पहला उदाहरण पूरा पाठ मान लेना — “${t}”`,
      `दूसरी इकाई की सही बात जो “${t}” से नहीं जोड़ी गई`,
    ],
  },
  {
    prompt: '“{topic}” का वीडियो मुख्यतः सिखाता है:',
    correct: (t) => `पुस्तक में दिखाए तर्क और चरण “${t}” के अनुसार`,
    wrongs: (t) => [
      `केवल शीर्षक “${t}” को उत्तर मान लेना`,
      `उदाहरण छोड़कर असंबंधित अभ्यास पर जाना`,
      `नाम मिलता-जुलता अध्याय पढ़कर “${t}” समझना`,
    ],
  },
  {
    prompt: '“{topic}” पर कक्षा परीक्षा में आमतौर पर:',
    correct: (t) => `“${t}” की बात समझकर लागू करने की क्षमता जाँची जाती है`,
    wrongs: (t) => [
      `दूसरे विषय की यादृच्छिक तथ्य याद करना`,
      `“${t}” से असंबंधित लंबे शब्द लिखना`,
      `वीडियो की अवधि याद करना, सामग्री नहीं`,
    ],
  },
  {
    prompt: '“{topic}” की तैयारी के लिए आपको चाहिए:',
    correct: (t) => `हल किए उदाहरण दोबारा पढ़ना और समान प्रश्न — “${t}”`,
    wrongs: () => [
      `केवल शीर्षक देखकर आरेख व अभ्यास छोड़ना`,
      `पिछले वर्ष की नोट्स बिना जाँच के इस्तेमाल करना`,
      `लिखे बिना केवल अनुमान पर निर्भर रहना`,
    ],
  },
  {
    prompt: '“{topic}” दूसरे अध्याय से अलग है क्योंकि:',
    correct: (t) => `पाठ्यक्रम में “${t}” के लिए निर्धारित उद्देश्य अलग हैं`,
    wrongs: () => [
      `हर अध्याय में बिल्कुल वही कौशल दोहराए जाते हैं`,
      `पढ़ाई की जगह असंबंधित खेल रखे जाते हैं`,
      `दूसरे विषय के उद्देश्य यहाँ थोपे जाते हैं`,
    ],
  },
  {
    prompt: '“{topic}” से मिलने वाली मुख्य कुशलता:',
    correct: (t) => `नए प्रश्न पर वही विधि लागू करना जो “${t}” में सिखाई गई`,
    wrongs: (t) => [
      `“${t}” का नाम लेना पर नया प्रश्न हल न कर पाना`,
      `नमूना उत्तर नकल करना बिना चरण समझे`,
      `“${t}” को दूसरे पाठ से मिलाकर अस्पष्ट उत्तर देना`,
    ],
  },
  {
    prompt: '“{topic}” में सिखाए गए उदाहरण से मेल:',
    correct: (t) => `वही ढाँचा जो शिक्षक ने “${t}” के लिए दिखाया`,
    wrongs: (t) => [
      `सही शीर्षक लेकिन गलत विधि — “${t}”`,
      `प्रभावशाली तथ्य जो “${t}” सामग्री में नहीं था`,
      `पाठ के विपरीत निष्कर्ष — “${t}”`,
    ],
  },
  {
    prompt: '“{topic}” पाठ में नहीं सिखाई गई बात कौन-सी?',
    correct: () => `वह दावा जो इस अध्याय की पुस्तक में नहीं है`,
    wrongs: (t) => [
      `जो परिभाषा “${t}” में स्पष्ट दिखाई गई`,
      `जो शब्द “${t}” पढ़ते समय चुना गया`,
      `“${t}” पाठ के तुरंत बाद दिया गया अभ्यास`,
    ],
  },
]

/**
 * @param {string} topic
 * @param {string} subject
 * @param {number} slot 0–7
 */
export function buildEnglishSlotQuestion(topic, subject, slot) {
  const s = EN_SLOTS[slot % EN_SLOTS.length]
  const t = topic || 'this chapter'
  const correct = s.correct(t, subject)
  const wrongs = s.wrongs(t, subject)
  return {
    prompt: s.prompt.replace(/\{topic\}/g, t).replace(/\{subject\}/g, subject),
    ...enOptions(t, subject, correct, wrongs),
  }
}

/** @param {string} topic @param {number} slot 0–7 */
export function buildHindiSlotQuestion(topic, slot) {
  const s = HI_SLOTS[slot % HI_SLOTS.length]
  const t = topic || 'यह अध्याय'
  const correct = s.correct(t)
  const wrongs = s.wrongs(t)
  return {
    prompt: s.prompt.replace(/\{topic\}/g, t),
    options: [correct, wrongs[0], wrongs[1], wrongs[2]],
    correctIndex: 0,
  }
}

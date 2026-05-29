/**
 * Sharpen MCQ options: dedupe distractors and swap weak duplicates for
 * subject-aware, topic-grounded alternatives.
 */

function normKey(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** @param {string} topic @param {string} subject */
export function englishExtraDistractors(topic, subject) {
  const t = topic || 'this chapter'
  const s = subject || 'this subject'
  return [
    `A ${s} fact that is generally true but was not taught under “${t}”`,
    `Correct-looking steps that belong to a different unit than “${t}”`,
    `A half-remembered rule from another chapter with a similar name to “${t}”`,
    `The right vocabulary from “${t}” but paired with the wrong definition`,
    `A shortcut that skips the method the lesson used for “${t}”`,
    `An example from social media, not from your class video on “${t}”`,
    `Mixing two ideas from the same book that do not combine in “${t}”`,
    `Repeating only the first sentence of the lesson as if it were the full idea`,
    `A formula or pattern that applies to homework from another topic`,
    `Choosing the longest option because it “sounds smart”, not because it matches “${t}”`,
    `Confusing the chapter title “${t}” with a topic that only rhymes or sounds alike`,
    `Using yesterday’s revision notes for a different chapter instead of “${t}”`,
  ]
}

/** @param {string} topic */
export function hindiExtraDistractors(topic) {
  const t = topic || 'यह अध्याय'
  return [
    `सामान्य ज्ञान की बात जो “${t}” पाठ में नहीं थी`,
    `दूसरे अध्याय का सही नियम, पर “${t}” के लिए गलत`,
    `“${t}” के शब्द गलत अर्थ के साथ प्रयोग`,
    `पाठ का पहला वाक्य पूरा पाठ मान लेना`,
    `इंटरनेट पर मिली बात जो कक्षा के “${t}” वीडियो से मेल नहीं`,
    `सही व्याकरण लेकिन गलत पाठ — “${t}” से बाहर`,
    `पिछले साल की किताब की परिभाषा जो इस वर्ष के “${t}” से अलग है`,
    `दो अलग अध्यायों की बातें मिलाकर “${t}” जैसा दिखाना`,
    `केवल शीर्षक याद करके विवरण न समझना — “${t}” के लिए`,
    `सही लगने वाला लेकिन पाठ के उदाहरणों से मेल न खाने वाला उत्तर`,
    `दूसरे विषय की सही बात जो हिंदी के “${t}” से संबंधित नहीं`,
    `लंबा वाक्य चुनना बिना पाठ की जाँच किए — “${t}”`,
  ]
}

/**
 * @param {string[]} options length 4
 * @param {number} correctIndex 0–3
 * @param {string} topic
 * @param {string} subject
 * @param {'en'|'hi'} locale
 */
export function refineMcqOptions(options, correctIndex, topic, subject, locale = 'en') {
  const out = options.map((o) => String(o ?? '').trim()).filter(Boolean)
  while (out.length < 4) out.push('')
  const extras = locale === 'hi' ? hindiExtraDistractors(topic) : englishExtraDistractors(topic, subject)
  let fill = 0
  const seen = new Set()

  const correctText = out[correctIndex] || ''
  if (correctText) seen.add(normKey(correctText))

  for (let i = 0; i < 4; i += 1) {
    let text = out[i] || ''
    const k = normKey(text)
    if (i === correctIndex) {
      if (!text) {
        text = locale === 'hi' ? `“${topic || 'पाठ'}” की मुख्य सही बात` : `The main point taught for “${topic || 'this chapter'}”`
        out[i] = text
      }
      seen.add(normKey(text))
      continue
    }
    if (!text || seen.has(k)) {
      let rep = ''
      let guard = 0
      while (guard < 30) {
        rep = extras[fill % extras.length]
        fill += 1
        guard += 1
        if (!seen.has(normKey(rep))) break
      }
      out[i] = rep
      seen.add(normKey(rep))
    } else {
      seen.add(k)
    }
  }
  return out.slice(0, 4)
}

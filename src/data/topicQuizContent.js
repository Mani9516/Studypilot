/**
 * Topic-specific MCQ prompts and answer options (all four choices relate to the chapter).
 */
import { refineMcqOptions } from '../utils/quizOptionQuality'
import {
  buildHindiTopicQuestion,
  normalizeHindiQuizItem,
  getQuizUiLabels,
} from './hindiQuizContent'

export { getQuizUiLabels }

function norm(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .trim()
}

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

/** @returns {{ prompt: string, options: string[], correctIndex: number } | null} */
function poolForLevel(spec, level) {
  if (!spec?.levels) return []
  return (
    spec.levels[level] ??
    spec.levels[3] ??
    spec.levels[2] ??
    spec.levels[1] ??
    spec.levels[4] ??
    spec.levels[5] ??
    Object.values(spec.levels).flat()
  )
}

function allSpecItems(spec) {
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

function fromSpec(spec, topic, level, variant) {
  if (!spec) return null
  const pool = allSpecItems(spec)
  const fallback = poolForLevel(spec, level)
  const list = pool.length ? pool : fallback
  if (!list?.length) return null
  const item = list[variant % list.length]
  const { options, correctIndex } = rotateOptions(item.options, item.correctIndex, variant + level)
  return {
    prompt: item.prompt.replace(/\{topic\}/g, topic),
    options,
    correctIndex,
  }
}

/** Exact chapter title → question specs by difficulty level */
const BY_TITLE = {
  // —— Class 1 Maths ——
  'Numbers 1–100': {
    levels: {
      1: [
        {
          prompt: '“{topic}” teaches counting and writing numbers up to which range?',
          options: ['1 to 100', '1 to 10 only', '1000 to 5000', 'Only odd numbers above 200'],
          correctIndex: 0,
        },
        {
          prompt: 'On a number line for “{topic}”, which number comes just after 49?',
          options: ['50', '48', '40', '59'],
          correctIndex: 0,
        },
      ],
      3: [
        {
          prompt: 'Which pair is correctly ordered smallest to largest for “{topic}”?',
          options: ['23, 45, 67', '67, 45, 23', '45, 45, 20', '100, 99, 98, 50'],
          correctIndex: 0,
        },
      ],
    },
  },
  Addition: {
    levels: {
      1: [
        {
          prompt: 'In “{topic}”, when you add 4 + 3, you are finding:',
          options: ['The total of both numbers', 'How much bigger 4 is than 3 only', 'The shape with 4 sides', 'The time after 3 o’clock'],
          correctIndex: 0,
        },
      ],
      3: [
        {
          prompt: 'Riya has 15 marbles and gets 8 more. Which operation fits “{topic}”?',
          options: ['15 + 8 = 23 marbles', '15 − 8 = 7 marbles', '15 × 8 marbles', '15 ÷ 8 marbles'],
          correctIndex: 0,
        },
      ],
    },
  },
  Subtraction: {
    levels: {
      1: [
        {
          prompt: '“{topic}” helps you find:',
          options: ['How much is left after taking away', 'The sum of two numbers', 'The name of a shape', 'How plants make food'],
          correctIndex: 0,
        },
      ],
      3: [
        {
          prompt: 'You had 20 stickers and gave away 7. For “{topic}” we write:',
          options: ['20 − 7 = 13', '20 + 7 = 27', '20 × 7 = 140', '7 − 20 = 13'],
          correctIndex: 0,
        },
      ],
    },
  },
  Shapes: {
    levels: {
      1: [
        {
          prompt: 'In “{topic}”, a square has:',
          options: ['4 equal sides and 4 corners', '3 sides only', 'No corners', 'Only curved edges'],
          correctIndex: 0,
        },
      ],
      2: [
        {
          prompt: 'Which object is most like a circle from “{topic}”?',
          options: ['A coin', 'A book (flat rectangle)', 'A dice (cube)', 'A ladder'],
          correctIndex: 0,
        },
      ],
    },
  },
  'My Body': {
    levels: {
      1: [
        {
          prompt: '“{topic}” includes learning that we breathe using our:',
          options: ['Lungs', 'Hair', 'Finger nails only', 'Shoes'],
          correctIndex: 0,
        },
      ],
      2: [
        {
          prompt: 'Which sense organ helps you see, as in “{topic}”?',
          options: ['Eyes', 'Ears', 'Skin only for taste', 'Elbows'],
          correctIndex: 0,
        },
      ],
    },
  },
  'Plants Around Us': {
    levels: {
      1: [
        {
          prompt: 'In “{topic}”, green plants mostly make food using:',
          options: ['Sunlight, water, and air', 'Only rocks and sand', 'Plastic and metal', 'Darkness only'],
          correctIndex: 0,
        },
      ],
      2: [
        {
          prompt: 'Which part of a plant is usually under the soil in “{topic}”?',
          options: ['Roots', 'Flowers only', 'Fruits in the sky', 'Leaves on clouds'],
          correctIndex: 0,
        },
      ],
    },
  },
  Water: {
    levels: {
      1: [
        {
          prompt: '“{topic}” is important because living things need water to:',
          options: ['Drink and stay healthy', 'Replace air in the sky', 'Make rocks grow bigger', 'Stop seasons from changing'],
          correctIndex: 0,
        },
      ],
      2: [
        {
          prompt: 'Which is a source of fresh water in “{topic}”?',
          options: ['River, well, or rain', 'Only salt from the sea for drinking', 'Fire and smoke', 'Plastic bottles only'],
          correctIndex: 0,
        },
      ],
    },
  },
  Air: {
    levels: {
      1: [
        {
          prompt: 'In “{topic}”, air is needed for:',
          options: ['Breathing and fire to burn', 'Making water disappear forever', 'Growing stones', 'Stopping sound from moving'],
          correctIndex: 0,
        },
      ],
      2: {
        prompt: 'Which shows that air takes up space in “{topic}”?',
        options: [
          'An inverted glass in water keeps water out of the cup',
          'Rocks float in air like boats',
          'Air is heavier than iron',
          'Plants do not use air',
        ],
        correctIndex: 0,
      },
    },
  },
  Fractions: {
    levels: {
      2: [
        {
          prompt: 'In “{topic}”, 1/2 of a pizza means:',
          options: ['One part out of two equal parts', 'Two whole pizzas', 'Half is bigger than the whole', 'Zero parts'],
          correctIndex: 0,
        },
      ],
      4: [
        {
          prompt: 'Which fraction is the largest for “{topic}”?',
          options: ['3/4', '1/4', '1/8', '2/10'],
          correctIndex: 0,
        },
      ],
    },
  },
  'Knowing Our Numbers': {
    levels: {
      2: [
        {
          prompt: '“{topic}” includes reading and comparing large numbers using:',
          options: ['Place value (ones, tens, hundreds…)', 'Only shapes', 'Plant parts', 'Letter writing'],
          correctIndex: 0,
        },
      ],
    },
  },
  Integers: {
    levels: {
      3: [
        {
          prompt: 'In “{topic}”, −3 is:',
          options: ['Less than 0', 'Greater than 5', 'The same as 3/4', 'A type of plant root'],
          correctIndex: 0,
        },
      ],
    },
  },
  'French Revolution': {
    levels: {
      3: [
        {
          prompt: 'The “{topic}” began mainly in which country?',
          options: ['France', 'India', 'Japan', 'Brazil'],
          correctIndex: 0,
        },
      ],
      4: [
        {
          prompt: 'A key idea of the “{topic}” was:',
          options: ['Liberty, equality, and challenging the old monarchy', 'Building pyramids in Egypt', 'Inventing the steam engine only', 'Planting only one crop worldwide'],
          correctIndex: 0,
        },
      ],
    },
  },
  'Chemical Reactions': {
    levels: {
      3: [
        {
          prompt: 'In “{topic}”, a chemical reaction means:',
          options: ['Substances change into new substances with different properties', 'Ice melts but stays H₂O only (physical change)', 'Paper is cut into pieces', 'Water evaporates with no new substance'],
          correctIndex: 0,
        },
      ],
    },
  },
  'Machine Learning': {
    levels: {
      3: [
        {
          prompt: '“{topic}” means computers learn from:',
          options: ['Data and examples, not only fixed rules', 'Only handwriting practice', 'Maps of rivers', 'Poetry rhymes alone'],
          correctIndex: 0,
        },
      ],
    },
  },
}

// Fix Air level 2 - I made a syntax error with object instead of array
BY_TITLE.Air.levels[2] = [
  {
    prompt: 'Which shows that air takes up space in “{topic}”?',
    options: [
      'An inverted glass in water keeps water out of the cup',
      'Rocks float in air like boats',
      'Air is heavier than iron',
      'Plants do not use air',
    ],
    correctIndex: 0,
  },
]

/** Regex rules per subject: [pattern, spec-like item factory] */
const RULES = {
  Mathematics: [
    [/addition/i, () => BY_TITLE.Addition],
    [/subtraction/i, () => BY_TITLE.Subtraction],
    [/fraction/i, () => BY_TITLE.Fractions],
    [/integer/i, () => BY_TITLE.Integers],
    [/number|counting|digit|place value/i, () => BY_TITLE['Numbers 1–100']],
    [/shape|geometry|angle|quadrilateral|mensuration|perimeter|area|volume/i, {
      levels: {
        1: [{
          prompt: '“{topic}” is mainly about:',
          options: ['Shapes, sizes, and measurements', 'Only grammar rules', 'Plant roots', 'Historical dates'],
          correctIndex: 0,
        }],
      },
    }],
    [/multiplication|division|percentage|decimal|ratio|proportion|algebra|polynomial|equation|trigonometry|calculus|matrix|vector|probability|statistics/i, {
      levels: {
        2: [{
          prompt: 'Which skill is central to “{topic}”?',
          options: ['Using the right operation or formula for the problem', 'Memorising unrelated poems', 'Drawing political maps only', 'Labelling animal parts only'],
          correctIndex: 0,
        }],
        4: [{
          prompt: 'A word problem on “{topic}” should start by:',
          options: ['Listing what is given and what to find', 'Writing the answer first', 'Ignoring units', 'Using a rule from another chapter'],
          correctIndex: 0,
        }],
      },
    }],
  ],
  Science: [
    [/plant/i, () => BY_TITLE['Plants Around Us']],
    [/water/i, () => BY_TITLE.Water],
    [/^air$|air and|water and air/i, () => BY_TITLE.Air],
    [/body|digestive|respiration|coordination|life process/i, () => BY_TITLE['My Body']],
    [/food|nutrition/i, {
      levels: {
        1: [{
          prompt: '“{topic}” teaches that healthy food should be:',
          options: ['Balanced with nutrients like carbohydrates, proteins, vitamins', 'Only sweets and sugar', 'Avoiding all fruits', 'Eating once a month'],
          correctIndex: 0,
        }],
      },
    }],
    [/electric|magnetic|circuit|current/i, {
      levels: {
        3: [{
          prompt: 'In “{topic}”, current flows when:',
          options: ['There is a complete conducting path (circuit)', 'Wire is broken with a gap', 'Only plastic connects cells', 'No voltage difference exists'],
          correctIndex: 0,
        }],
      },
    }],
    [/force|motion|pressure|gravitation|energy|machine/i, {
      levels: {
        3: [{
          prompt: '“{topic}” explains how objects move or interact using:',
          options: ['Forces, energy, and scientific laws', 'Only spelling rules', 'River names on maps', 'Poetry metre'],
          correctIndex: 0,
        }],
      },
    }],
    [/cell|microorganism|tissue|reproduction|genetic|atom|molecule|matter|acid|base|chemical|combustion|light|sound|environment|pollution|solar|season|weather/i, {
      levels: {
        2: [{
          prompt: 'The lesson “{topic}” focuses on understanding:',
          options: ['Scientific facts and processes in nature', 'Only dates in history', 'English letter formats', 'Multiplication tables only'],
          correctIndex: 0,
        }],
      },
    }],
  ],
  English: [
    [/alphabet|vowel|consonant|phonics/i, {
      levels: {
        1: [{
          prompt: '“{topic}” helps you learn:',
          options: ['Letters and their sounds for reading', 'Only multiplication', 'Plant types', 'Map scales'],
          correctIndex: 0,
        }],
      },
    }],
    [/noun|pronoun|verb|tense|grammar|adjective|adverb|voice|speech/i, {
      levels: {
        2: [{
          prompt: 'In “{topic}”, you practise using words correctly in:',
          options: ['Sentences with proper grammar', 'Only maths sums', 'Chemical equations', 'Map directions only'],
          correctIndex: 0,
        }],
      },
    }],
    [/comprehension|reading/i, {
      levels: {
        2: [{
          prompt: 'For “{topic}”, you should find answers:',
          options: ['From the passage itself', 'By guessing without reading', 'From another subject’s book', 'Only from the title'],
          correctIndex: 0,
        }],
      },
    }],
    [/writing|essay|paragraph|letter|story|poem|poetry|rhyme|vocabulary|creative/i, {
      levels: {
        2: [{
          prompt: '“{topic}” improves your ability to:',
          options: ['Express ideas clearly in English', 'Solve physics numericals only', 'Measure land area only', 'Name bones only'],
          correctIndex: 0,
        }],
      },
    }],
  ],
  Hindi: [
    [/स्वर|व्यंजन|वर्णमाला|मात्रा/i, {
      levels: {
        1: [{
          prompt: '“{topic}” में हम सीखते हैं:',
          options: ['हिंदी अक्षरों की ध्वनि और लेखन', 'गणित के सूत्र', 'विज्ञान के प्रयोग', 'नक्शे की दिशाएँ'],
          correctIndex: 0,
        }],
      },
    }],
    [/संज्ञा/i, {
      levels: {
        2: [{
          prompt: '“{topic}” किस शब्द-भेद से related है?',
          options: ['नाम वाली वस्तु, व्यक्ति या स्थान (संज्ञा)', 'क्रिया (काम करना)', 'केवल विराम चिह्न', 'गणित की संख्या'],
          correctIndex: 0,
        }],
      },
    }],
    [/सर्वनाम/i, {
      levels: {
        2: [{
          prompt: '“{topic}” में “वह”, “मैं” जैसे शब्द:',
          options: ['संज्ञा की जगह प्रयोग होते हैं', 'केवल संख्या हैं', 'रंग के नाम हैं', 'जानवरों के घर हैं'],
          correctIndex: 0,
        }],
      },
    }],
    [/क्रिया|काल/i, {
      levels: {
        3: [{
          prompt: '“{topic}” से हम पहचानते हैं:',
          options: ['काम या अवस्था बताने वाले शब्द', 'केवल फल के नाम', 'नदियों के नाम', 'ग्रहों की दूरी'],
          correctIndex: 0,
        }],
      },
    }],
    [/कविता|कहानी|पत्र|निबंध|मुहावरे|पर्याय|अपठित|वाक्य|शब्द/i, {
      levels: {
        2: [{
          prompt: '“{topic}” पाठ का मुख्य लक्ष्य है:',
          options: ['हिंदी पढ़ना, लिखना और समझना', 'अंग्रेज़ी वर्णमाला', 'भौतिकी के नियम', 'इतिहास की तिथि'],
          correctIndex: 0,
        }],
      },
    }],
  ],
  'Social Science': [
    [/history|revolution|nationalism|heritage|medieval|constitution|democracy|government|federal|party|politic/i, {
      levels: {
        3: [{
          prompt: '“{topic}” in Social Science deals with:',
          options: ['People, power, and change over time', 'Chemical bonding', 'Trigonometry ratios', 'Hindi matras'],
          correctIndex: 0,
        }],
      },
    }],
    [/geography|map|landform|climate|resource|agriculture|industry|population|urban|rural/i, {
      levels: {
        3: [{
          prompt: '“{topic}” helps you understand:',
          options: ['Places, environment, and how people use resources', 'Only poetry rhyme', 'Electric circuits', 'Fractions'],
          correctIndex: 0,
        }],
      },
    }],
    [/economics|money|credit|market|global|poverty|trade/i, {
      levels: {
        3: [{
          prompt: '“{topic}” is about:',
          options: ['How people earn, spend, and trade', 'Plant photosynthesis only', 'Verb tenses only', 'Shapes only'],
          correctIndex: 0,
        }],
      },
    }],
  ],
  AI: [
    [/ai|machine learning|neural|deep learning|data science|python|nlp|vision|robot|ethic|algorithm|generative/i, {
      levels: {
        3: [{
          prompt: '“{topic}” in AI teaches that smart systems use:',
          options: ['Data, patterns, and careful design', 'Only paper maps', 'Ancient poetry forms', 'Plant roots only'],
          correctIndex: 0,
        }],
        5: [{
          prompt: 'Responsible “{topic}” should consider:',
          options: ['Privacy, fairness, and safe use of technology', 'Sharing all data without consent', 'Hiding every error', 'Ignoring biased results'],
          correctIndex: 0,
        }],
      },
    }],
  ],
}

for (const sub of ['Physics', 'Chemistry', 'Biology']) {
  RULES[sub] = RULES.Science
}

function matchRules(topic, subject) {
  const t = norm(topic)
  const list = RULES[subject] ?? RULES.Mathematics
  for (const [re, specOrFn] of list) {
    if (re.test(t) || re.test(topic)) {
      const spec = typeof specOrFn === 'function' ? specOrFn() : specOrFn
      return spec
    }
  }
  return null
}

function genericTopicQuestion(topic, subject, level, variant, slot = 0) {
  const templates = [
    {
      prompt: 'Which idea from the lesson on “{topic}” is correct?',
      correct: `The main ideas taught in “${topic}”`,
      wrongs: [
        `Loose keywords from “${topic}” with no clear link between them`,
        `A true ${subject} statement that your lesson never connected to “${topic}”`,
        `Half of the right idea, but missing the defining condition for “${topic}”`,
      ],
    },
    {
      prompt: 'After watching the video on “{topic}”, you should remember:',
      correct: `Key facts and skills from “${topic}”`,
      wrongs: [
        `Only the chapter number and page list, not what “${topic}” means`,
        `A formula or rule that belongs to a different unit than “${topic}”`,
        `A catchy slogan that never appeared in the “${topic}” explanation`,
      ],
    },
    {
      prompt: '“{topic}” in your syllabus mainly teaches:',
      correct: `Concepts and practice tied to “${topic}”`,
      wrongs: [
        `How to spell the title while skipping the ideas inside “${topic}”`,
        `Objectives copied from another subject with a similar-sounding name`,
        `General study tips that replace the specific goals of “${topic}”`,
      ],
    },
    {
      prompt: 'Which answer best matches “{topic}” from class?',
      correct: `What your teacher and video explained for “${topic}”`,
      wrongs: [
        `The opposite conclusion to the worked line of reasoning for “${topic}”`,
        `A neighbouring chapter’s method that does not match this “${topic}” task`,
        `A homework shortcut that skips the steps your book shows for “${topic}”`,
      ],
    },
    {
      prompt: 'To do well on “{topic}”, you need to understand:',
      correct: `The lesson vocabulary and main ideas of “${topic}”`,
      wrongs: [
        `Long words from ${subject} that never appeared in the “${topic}” notes`,
        `Only a diagram caption without reading the full “${topic}” section`,
        `An online article that contradicts your textbook on “${topic}”`,
      ],
    },
    {
      prompt: 'A practice question on “{topic}” should use:',
      correct: `Methods shown in the “${topic}” lesson`,
      wrongs: [
        `A clever trick from social media that your teacher did not endorse`,
        `Steps that work for another topic but break the logic of “${topic}”`,
        `Pure guessing because the working for “${topic}” was skipped`,
      ],
    },
    {
      prompt: 'Which statement about “{topic}” is true?',
      correct: `It is part of your Class ${subject} course and was in the lesson`,
      wrongs: [
        `It is optional revision even though the syllabus lists “${topic}”`,
        `It is identical to every other chapter so “${topic}” adds nothing new`,
        `It is unrelated to ${subject} even though the lesson title is “${topic}”`,
      ],
    },
    {
      prompt: 'When your teacher asks about “{topic}”, you explain:',
      correct: `The correct concept using words from the lesson`,
      wrongs: [
        `A polished story from another chapter that avoids “${topic}” itself`,
        `Vague confidence with no definition, example, or step for “${topic}”`,
        `A half-remembered rule that mixes two different meanings of “${topic}”`,
      ],
    },
    {
      prompt: 'The hardest useful skill from “{topic}” is:',
      correct: `Applying “${topic}” ideas to new examples`,
      wrongs: [
        `Reciting the title of “${topic}” without solving a fresh question`,
        `Copying a model solution while skipping why each line follows`,
        `Blending “${topic}” with another unit until the reasoning no longer fits`,
      ],
    },
    {
      prompt: 'Which option shows you studied “{topic}”?',
      correct: `You can answer questions using lesson facts about “${topic}”`,
      wrongs: [
        `You recognise the font of the textbook but not the ideas in “${topic}”`,
        `You swap “${topic}” with a chapter that only sounds alike`,
        `You list unrelated achievements instead of evidence from “${topic}”`,
      ],
    },
    {
      prompt: 'In the quiz on “{topic}”, the right choice is:',
      correct: `Aligned with the chapter video and syllabus`,
      wrongs: [
        `Aligned with a different publisher’s guide, not your class on “${topic}”`,
        `Aligned with rumour or meme culture instead of your “${topic}” notes`,
        `Aligned with last term’s draft syllabus before “${topic}” was updated`,
      ],
    },
    {
      prompt: 'Your class notes on “{topic}” should include:',
      correct: `Main points and examples from the lesson`,
      wrongs: [
        `Decorative borders without any definition or example for “${topic}”`,
        `Bullet points copied from another subject that never mention “${topic}”`,
        `Blank space saved for “later” so nothing about “${topic}” is written`,
      ],
    },
    {
      prompt: 'Which is NOT part of “{topic}” as taught?',
      correct: `Ideas that never appeared in the lesson`,
      wrongs: [
        `Ideas that were in the video`,
        `Examples the teacher gave`,
        `Words from the syllabus line`,
      ],
    },
    {
      prompt: 'Revision for “{topic}” means:',
      correct: `Re-read key points and try similar questions`,
      wrongs: [
        `Never reopen the section even if “${topic}” still feels unclear`,
        `Only reread a single paragraph and ignore exercises for “${topic}”`,
        `Speed-read another book that does not follow your “${topic}” sequence`,
      ],
    },
    {
      prompt: 'Connecting “{topic}” to real life helps you:',
      correct: `Remember and use what the lesson taught`,
      wrongs: [
        `Replace precise definitions with vague opinions about “${topic}”`,
        `Treat every real-life story as proof even if it contradicts “${topic}”`,
        `Assume daily experience alone replaces practice questions on “${topic}”`,
      ],
    },
    {
      prompt: 'An expert check on “{topic}” asks if you can:',
      correct: `Teach the idea to a friend using correct terms`,
      wrongs: [
        `Repeat jargon from “${topic}” without being able to define it`,
        `Skip the hardest example and only describe the easy line about “${topic}”`,
        `Teach a simplified version that drops a key condition from “${topic}”`,
      ],
    },
  ]

  const t = templates[(variant + slot * 11 + level * 3) % templates.length]
  const promptText = t.prompt.replace(/\{topic\}/g, topic)
  return {
    prompt: promptText,
    options: [t.correct, t.wrongs[0], t.wrongs[1], t.wrongs[2]],
    correctIndex: 0,
  }
}

/**
 * @param {string} topic chapter title
 * @param {string} subject
 * @param {number} level 1–5
 * @param {number} variant
 */
export function buildTopicQuestion(topic, subject, level, variant, slot = 0) {
  if (subject === 'Hindi') {
    return buildHindiTopicQuestion(topic, level, variant, slot)
  }

  const mixVariant = variant + slot * 41
  const exact = BY_TITLE[topic]
  const spec = exact ?? matchRules(topic, subject)
  if (spec) {
    const built = fromSpec(spec, topic, level, mixVariant + slot * 3)
    if (built?.prompt && built.options?.length >= 4) return built
  }

  const generic = genericTopicQuestion(topic, subject, level, mixVariant, slot)
  const rotated = rotateOptions(
    generic.options,
    generic.correctIndex,
    variant + level * 3,
  )
  return {
    prompt: generic.prompt,
    options: rotated.options,
    correctIndex: rotated.correctIndex,
  }
}

/** Guarantees prompt + exactly 4 non-empty options */
export function normalizeQuizItem(item, topic, subject) {
  if (subject === 'Hindi') {
    return normalizeHindiQuizItem(item, topic)
  }

  const t = topic || 'this chapter'
  const prompt =
    item.prompt?.trim() ||
    `About “${t}” (${subject}), which answer is correct?`

  const raw = Array.isArray(item.options) ? item.options : []
  const options = raw
    .map((o) => String(o ?? '').trim())
    .filter(Boolean)
    .slice(0, 4)

  const fillers = [
    `The definition your teacher linked to “${t}” in this lesson`,
    `A ${subject} idea that never appeared in the “${t}” video`,
    `Half-right wording that leaves out the key step for “${t}”`,
    `A neighbour topic in ${subject} that is not the focus of “${t}”`,
  ]
  while (options.length < 4) {
    options.push(fillers[options.length % fillers.length])
  }

  const correctIndex = Math.min(Math.max(0, item.correctIndex ?? 0), 3)
  const polished = refineMcqOptions(options, correctIndex, t, subject, 'en')

  return { prompt, options: polished, correctIndex }
}

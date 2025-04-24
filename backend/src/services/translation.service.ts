import { pipeline } from '@xenova/transformers'

let translator: any

export async function translateToEnglish(
  text: string,
  lang: string
): Promise<string> {
  if (!translator) {
    translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M')
  }

  const result = await translator(text, {
    src_lang: lang, // ex: 'ron_Latn' pentru română
    tgt_lang: 'eng_Latn', // engleză
  })

  return result[0].translation_text
}

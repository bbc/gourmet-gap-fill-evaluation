import * as uuidv1 from 'uuid/v1';

class SentenceSet {
  public setId: string;

  constructor(
    public name: string,
    public sourceLanguage: Language,
    public targetLanguage: Language,
    public sentenceIds?: Set<string>,
    setId?: string,
    public evaluatorIds?: Set<string>
  ) {
    this.setId = setId === undefined ? uuidv1() : setId;
  }
}

class Sentence {
  public sentenceId: string;

  constructor(
    public original: string,
    public reference: string,
    public translation: string,
    public keys: string[],
    public sourceLanguage: Language,
    public targetLanguage: Language,
    sentenceId?: string
  ) {
    this.sentenceId = sentenceId === undefined ? uuidv1() : sentenceId;
  }
}

enum Language {
  BULGARIAN = 'bg',
  GUJARATI = 'gu',
  SWAHILI = 'sw',
  ENGLISH = 'en',
}

export { SentenceSet, Sentence, Language };

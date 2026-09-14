/**
 * Prompt for the TalkItOver button.
 *
 * Taken verbatim from the content-type prompts on
 * https://raifdmueller.github.io/talkitover/prompts/ and inserted here at
 * commit time. They are not fetched at runtime: a button must not stop working
 * because another site is down.
 *
 * Buttons carry the version as data-prompt="<type>@<n>" so a later update can
 * find them. Nothing reads that attribute at runtime.
 */

/**
 * katalog@4 — an index the reader wants to find their way through.
 *
 * The prompt names the site's own pages instead of leaving them to the index.
 * Measured on 2026-09-13: the reader's LLM fetches a URL that stood in the
 * message it was given, and refuses one it only found inside a document it
 * fetched — "not in any prior search or fetch result", for text/plain,
 * text/markdown and HTML alike. An index of links alone therefore opens
 * nothing. Whatever the prompt names is reachable; whatever it omits may not be.
 *
 * Searching was the other way in, and it failed on measurement: four searches
 * against this site returned five of its 459 pages, no anchor among them, and
 * answered the question from heise and two unrelated blogs instead.
 *
 * What @4 learned over @3: the rule "do not answer from memory and do not go
 * looking elsewhere" was meant as *invent nothing about this site*. A reader
 * read it as a gag order on the whole conversation. He asked whether "OWASP
 * Top 10 (2026)" exists at all — a question about the world, not about this
 * site — and was told our prompt forbids looking it up. That costs exactly
 * what this site is for: a reader who can check whether our entries still hold.
 *
 * In its place stands a duty to attribute. All three sources are welcome —
 * this site, something looked up elsewhere, the model's own knowledge. The one
 * thing forbidden is one passing for another.
 */
export function catalogPrompt({ docPages, bundles, contractsUrl, fullTextUrl }) {
  return [
    'Load {url}. It is the index of one site: it names everything published',
    'there and holds none of it.',
    '',
    'Every URL you need is here in my message, so you never have to follow one',
    'out of a document you fetched — some tools refuse that, and we do not know',
    'which one you are.',
    '',
    'Pages about the project. A question about a workflow or a method is',
    'usually answered here, not by a single term:',
    '',
    ...docPages.map((page) => `- ${page.title}: ${page.url}`),
    '',
    'The named terms by category, each file holding its terms in full. Where a',
    'category is split, the terms say which part holds what:',
    '',
    ...bundles.map((bundle) =>
      bundle.terms?.length
        ? `- ${bundle.title}: ${bundle.url}\n  ${bundle.terms.join(', ')}`
        : `- ${bundle.title}: ${bundle.url}`
    ),
    '',
    `All the contracts in one file: ${contractsUrl}`,
    `Everything at once, large and likely cut short: ${fullTextUrl}`,
    '',
    'Use the index to find a term\'s category, then fetch that category above.',
    'If a fetch is refused, say so and ask me to paste the URL.',
    '',
    'When I ask for a link, give me the page a person can open — each bundle',
    'names it under the term — never the text file you read from.',
    '',
    'Ask what I am looking for before you fetch anything. Then fetch what',
    'matches, read it, and answer from what you read. Keep it short.',
    '',
    'Say where every answer comes from, every time. Three kinds of source, kept',
    'strictly apart:',
    '',
    '  this site          name the page or entry you read it in',
    '  somewhere else     name what you looked at',
    '  your own knowledge say that it is yours, and say when you are unsure',
    '',
    'Bring all three when they help — your own knowledge is welcome, and so is',
    'looking something up. What must never happen is one passing for another: an',
    'answer that sounds like this site but came from your training is exactly the',
    'failure this whole setup exists to prevent.',
    '',
    'If this site does not cover my question, say that first. Then answer from the',
    'other two if you can.',
  ].join('\n')
}

export const CATALOG_VERSION = 'katalog@4'

/**
 * The seam between the generated manifest and the prompt.
 *
 * The generator names things the way a generated file does, the prompt the way
 * a prompt does. Mapping them in one place keeps a rename in the generator from
 * reaching into the prompt text.
 */
export function fromManifest(manifest) {
  return {
    docPages: manifest.DOC_PAGES,
    bundles: manifest.BUNDLES,
    contractsUrl: manifest.CONTRACTS_URL,
    fullTextUrl: manifest.FULL_TEXT_URL,
  }
}

/**
 * Serialise a prompt for an HTML attribute.
 *
 * A blank line inside an attribute value ends the HTML block in kramdown and in
 * most template pipelines, which tears the page apart at exactly that spot. The
 * newlines therefore travel as &#10; — the browser decodes them back before the
 * component ever reads the attribute.
 */
export function promptAttribute(prompt) {
  return String(prompt).replace(/\n/g, '&#10;')
}

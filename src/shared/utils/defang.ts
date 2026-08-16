/**
 * Defanging for reported content.
 *
 * A crowdsourced report points at something the reporter believes is harmful —
 * a scam, a phishing page, a malware drop. Rendering that as a live link hands
 * every reader a one-click path to the thing being reported, and the people
 * most likely to click are the ones investigating it.
 *
 * So reported URLs are shown in the convention security teams already use:
 * `https://evil.com/x` → `hxxps://evil[.]com/x`. The value stays intact in the
 * database and in the API — moderators and the AI verification service need the
 * real URL — but nothing in the UI turns it into an anchor.
 */

/** Matches an explicit http(s) URL, or a bare `www.` host, inside free text. */
const URL_IN_TEXT = /\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi;

/**
 * Neutralises a single URL. Accepts anything — a full URL, a bare host, or
 * junk — and never throws, because this runs on unvalidated user input.
 */
export function defangUrl(value: string | null | undefined): string {
    const raw = (value ?? '').trim();
    if (!raw) return '';

    // Split scheme from the rest so only the host's dots are bracketed.
    const schemeMatch = /^([a-z][a-z0-9+.-]*):\/\//i.exec(raw);
    const scheme = schemeMatch ? schemeMatch[1] : '';
    const rest = schemeMatch ? raw.slice(schemeMatch[0].length) : raw;

    const separator = rest.search(/[/?#]/);
    const host = separator === -1 ? rest : rest.slice(0, separator);
    const path = separator === -1 ? '' : rest.slice(separator);

    const defangedHost = host.replace(/\./g, '[.]');
    const defangedScheme = scheme ? `${defangScheme(scheme)}://` : '';

    return `${defangedScheme}${defangedHost}${path}`;
}

/** `http` → `hxxp`, `https` → `hxxps`; anything else is bracketed instead. */
function defangScheme(scheme: string): string {
    const lower = scheme.toLowerCase();
    if (lower === 'http' || lower === 'https') {
        return `hxxp${lower.slice(4)}`;
    }
    return `${scheme}[:]`.replace('[:]', '');
}

/**
 * Defangs every URL inside a block of free text, leaving the prose untouched.
 *
 * Only schemed URLs and `www.` hosts are rewritten: matching bare domains would
 * mangle ordinary sentences ("no medical evidence.The post claims…").
 */
export function defangText(value: string | null | undefined): string {
    const raw = value ?? '';
    if (!raw) return '';

    return raw.replace(URL_IN_TEXT, (match) => {
        // Trailing sentence punctuation is prose, not part of the URL.
        const trailing = /[.,;:!?]+$/.exec(match)?.[0] ?? '';
        const url = trailing ? match.slice(0, -trailing.length) : match;
        return `${defangUrl(url)}${trailing}`;
    });
}

/** True when the text contains something that would read as a link. */
export function containsUrl(value: string | null | undefined): boolean {
    if (!value) return false;
    URL_IN_TEXT.lastIndex = 0; // the regex is global; reset before testing
    return URL_IN_TEXT.test(value);
}

import sanitizeHtml from 'sanitize-html'

export default function sanitizeOrderComment(comment = '') {
    return sanitizeHtml(comment, {
        allowedTags: [
            'b',
            'strong',
            'i',
            'em',
            'u',
            'p',
            'br',
            'ul',
            'ol',
            'li',
        ],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
    })
}

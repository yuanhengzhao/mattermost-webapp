// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as TextFormatting from 'utils/text_formatting.jsx';

describe('TextFormatting.mentionHighlighting', () => {
    const tests = [{
        name: 'no mentions',
        input: 'These are words',
        mentionKeys: [],
        expected: '<p>These are words</p>',
    }, {
        name: 'not an at-mention',
        input: 'These are words',
        mentionKeys: [{key: 'words'}],
        expected: '<p>These are <span class="mention--highlight">words</span></p>',
    }, {
        name: 'at-mention without highlight',
        input: 'This is @user',
        mentionKeys: [{key: '@words'}],
        expected: '<p>This is <span data-mention="user">@user</span></p>',
    }, {
        name: 'at-mention',
        input: 'These are @words',
        mentionKeys: [{key: '@words'}],
        expected: '<p>These are <span class="mention--highlight"><span data-mention="words">@words</span></span></p>',
    }, {
        name: 'at-mention and non-at-mention for same word',
        input: 'These are @words',
        mentionKeys: [{key: '@words'}, {key: 'words'}],
        expected: '<p>These are <span class="mention--highlight"><span data-mention="words">@words</span></span></p>',
    }, {
        name: 'case insensitive mentions',
        input: 'These are words and Words and wORDS',
        mentionKeys: [{key: 'words'}],
        expected: '<p>These are <span class="mention--highlight">words</span> and <span class="mention--highlight">Words</span> and <span class="mention--highlight">wORDS</span></p>',
    }, {
        name: 'case sensitive mentions',
        input: 'These are words and Words and wORDS',
        mentionKeys: [{key: 'Words', caseSensitive: true}],
        expected: '<p>These are words and <span class="mention--highlight">Words</span> and wORDS</p>',
    }, {
        name: 'at mention linking disabled, mentioned by non-at-mention',
        input: 'These are @words',
        atMentions: false,
        mentionKeys: [{key: 'words'}],
        expected: '<p>These are @<span class="mention--highlight">words</span></p>',
    }, {
        name: 'at mention linking disabled, mentioned by at-mention',
        input: 'These are @words',
        atMentions: false,
        mentionKeys: [{key: '@words'}],
        expected: '<p>These are <span class="mention--highlight">@words</span></p>',
    }, {
        name: 'mention highlighting disabled',
        input: 'These are words',
        mentionHighlight: false,
        mentionKeys: [{key: 'words'}],
        expected: '<p>These are words</p>',
    }, {
        name: 'mention highlighting and at mention linking disabled',
        input: 'These are @words',
        atMentions: false,
        mentionHighlight: false,
        mentionKeys: [{key: '@words'}],
        expected: '<p>These are @words</p>',
    }, {
        name: 'bold',
        input: 'These are **words** in a sentence',
        mentionKeys: [{key: 'words'}],
        expected: '<p>These are <strong><span class="mention--highlight">words</span></strong> in a sentence</p>',
    }, {
        name: 'italics',
        input: 'These _are words in_ a sentence',
        mentionKeys: [{key: 'words'}],
        expected: '<p>These <em>are <span class="mention--highlight">words</span> in</em> a sentence</p>',
    }, {
        name: 'code span',
        input: 'These are `words`',
        mentionKeys: [{key: 'words'}],
        expected: '<p>These are <span class="codespan__pre-wrap"><code>words</code></span></p>',
    }, {
        name: 'code block',
        input: '```\nThese are\nwords\n```',
        mentionKeys: [{key: 'words'}],
        expected:
            '<div class="post-code post-code--wrap">' +
                '<code class="hljs">' +
                    'These are\nwords\n' +
                '</code>' +
            '</div>',
    }, {
        name: 'link text',
        input: 'These are [words words](https://example.com)',
        mentionKeys: [{key: 'words'}],
        expected: '<p>These are <a class="theme markdown__link" href="https://example.com" rel="noreferrer" target="_blank"><span class="mention--highlight">words</span> <span class="mention--highlight">words</span></a></p>',
    }, {
        name: 'link url',
        input: 'This is [a link](https://example.com/words)',
        mentionKeys: [{key: 'example'}, {key: 'com'}, {key: 'https'}, {key: 'words'}],
        expected: '<p>This is <a class="theme markdown__link" href="https://example.com/words" rel="noreferrer" target="_blank">a link</a></p>',
    }, {
        name: 'autolinked url',
        input: 'https://example.com/words',
        mentionKeys: [{key: 'example'}, {key: 'com'}, {key: 'https'}, {key: 'words'}],
        expected: '<p><a class="theme markdown__link" href="https://example.com/words" rel="noreferrer" target="_blank">https://example.com/words</a></p>',
    }];

    for (const test of tests) {
        it(test.name, () => {
            const options = {
                atMentions: 'atMentions' in test ? test.atMentions : true,
                mentionHighlight: 'mentionHighlight' in test ? test.mentionHighlight : true,
                mentionKeys: test.mentionKeys,
            };
            const output = TextFormatting.formatText(test.input, options).trim();

            expect(output).toEqual(test.expected);
        });
    }
});

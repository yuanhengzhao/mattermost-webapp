// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as TextFormatting from 'utils/text_formatting.jsx';

describe('TextFormatting.searchHighlighting', () => {
    describe('with client performing highlighting (using searchTerm)', () => {
        const tests = [{
            name: 'no highlighting',
            input: 'These are words in a sentence.',
            searchTerm: '',
            expected: '<p>These are words in a sentence.</p>',
        }, {
            name: 'regular words',
            input: 'These are words in a sentence.',
            searchTerm: 'words sentence',
            expected: '<p>These are <span class="search-highlight">words</span> in a <span class="search-highlight">sentence</span>.</p>',
        }, {
            name: 'quoted phrase',
            input: 'These are words in a sentence. This is a sentence with words.',
            searchTerm: '"words in a sentence"',
            expected: '<p>These are <span class="search-highlight">words in a sentence</span>. This is a sentence with words.</p>',
        }, {
            name: 'empty quoted phrase',
            input: 'These are words in a sentence. This is a sentence with words.',
            searchTerm: '""',
            expected: '<p>These are words in a sentence. This is a sentence with words.</p>',
        }, {
            name: 'search flags',
            input: 'These are words in a sentence.',
            searchTerm: 'words in:sentence',
            expected: '<p>These are <span class="search-highlight">words</span> in a sentence.</p>',
        }, {
            name: 'at mentions',
            input: 'These are @words in a @sentence.',
            searchTerm: '@words sentence',
            expected: '<p>These are <span class="search-highlight"><span data-mention="words">@words</span></span> in a <span class="search-highlight"><span data-mention="sentence.">@sentence.</span></span></p>',
        }, {
            name: 'bold',
            input: 'These are **words in a sentence**.',
            searchTerm: 'words sentence',
            expected: '<p>These are <strong><span class="search-highlight">words</span> in a <span class="search-highlight">sentence</span></strong>.</p>',
        }, {
            name: 'italics',
            input: 'These are _words in a sentence_.',
            searchTerm: 'words sentence',
            expected: '<p>These are <em><span class="search-highlight">words</span> in a <span class="search-highlight">sentence</span></em>.</p>',
        }, {
            name: 'code span',
            input: 'These are `words in a sentence`.',
            searchTerm: 'words',
            expected: '<p>These are <span class="codespan__pre-wrap"><code><span class="search-highlight">words</span> in a sentence</code></span>.</p>',
        }, {
            name: 'code block',
            input: '```\nwords in a sentence\n```',
            searchTerm: 'words',
            expected:
                '<div class="post-code post-code--wrap">' +
                    '<code class="hljs">' +
                        '<div class="post-code__search-highlighting">' +
                            '<span class="search-highlight">words</span> in a sentence\n' +
                        '</div>' +
                        'words in a sentence\n' +
                    '</code>' +
                '</div>',
        }, {
            name: 'link text',
            input: 'These are [words in a sentence](https://example.com).',
            searchTerm: 'words',
            expected: '<p>These are <a class="theme markdown__link" href="https://example.com" rel="noreferrer" target="_blank"><span class="search-highlight">words</span> in a sentence</a>.</p>',
        }, {
            name: 'link url',
            input: 'These are [words in a sentence](https://example.com).',
            searchTerm: 'example',
            expected: '<p>These are <a class="theme markdown__link search-highlight" href="https://example.com" rel="noreferrer" target="_blank">words in a sentence</a>.</p>',
        }, {
            name: 'autolinked url',
            input: 'https://example.com/words',
            searchTerm: 'example words',
            expected: '<p><a class="theme markdown__link search-highlight" href="https://example.com/words" rel="noreferrer" target="_blank">https://example.com/words</a></p>',
        }];

        for (const test of tests) {
            it(test.name, () => {
                const options = {
                    atMentions: true,
                    searchTerm: test.searchTerm,
                };
                const output = TextFormatting.formatText(test.input, options).trim();

                expect(output).toEqual(test.expected);
            });
        }
    });

    describe('with server performing highlighting (using searchMatches)', () => {
        const tests = [{
            name: 'no highlighting',
            input: 'These are words in a sentence.',
            searchMatches: [],
            expected: '<p>These are words in a sentence.</p>',
        }, {
            name: 'regular words',
            input: 'These are words in a sentence.',
            searchMatches: ['words', 'sentence'],
            expected: '<p>These are <span class="search-highlight">words</span> in a <span class="search-highlight">sentence</span>.</p>',
        }, {
            name: ' quoted phrase',
            input: 'These are words in a sentence. This is a sentence with words.',
            searchMatches: ['words in a sentence'],
            expected: '<p>These are <span class="search-highlight">words in a sentence</span>. This is a sentence with words.</p>',
        }, {
            name: 'at mentions',
            input: 'These are @words in a @sentence.',
            searchMatches: ['@words', 'sentence'],
            expected: '<p>These are <span class="search-highlight"><span data-mention="words">@words</span></span> in a <span class="search-highlight"><span data-mention="sentence.">@sentence.</span></span></p>',
        }, {
            name: 'bold',
            input: 'These are **words in a sentence**.',
            searchMatches: ['words', 'sentence'],
            expected: '<p>These are <strong><span class="search-highlight">words</span> in a <span class="search-highlight">sentence</span></strong>.</p>',
        }, {
            name: 'italics',
            input: 'These are _words in a sentence_.',
            searchMatches: ['words', 'sentence'],
            expected: '<p>These are <em><span class="search-highlight">words</span> in a <span class="search-highlight">sentence</span></em>.</p>',
        }, {
            name: 'code span',
            input: 'These are `words in a sentence`.',
            searchMatches: ['words'],
            expected: '<p>These are <span class="codespan__pre-wrap"><code><span class="search-highlight">words</span> in a sentence</code></span>.</p>',
        }, {
            name: 'code block',
            input: '```\nwords in a sentence\n```',
            searchMatches: ['words'],
            expected:
                '<div class="post-code post-code--wrap">' +
                    '<code class="hljs">' +
                        '<div class="post-code__search-highlighting">' +
                            '<span class="search-highlight">words</span> in a sentence\n' +
                        '</div>' +
                        'words in a sentence\n' +
                    '</code>' +
                '</div>',
        }, {
            name: 'link text',
            input: 'These are [words in a sentence](https://example.com).',
            searchMatches: ['words'],
            expected: '<p>These are <a class="theme markdown__link" href="https://example.com" rel="noreferrer" target="_blank"><span class="search-highlight">words</span> in a sentence</a>.</p>',
        }, {
            name: 'link url',
            input: 'These are [words in a sentence](https://example.com).',
            searchMatches: ['example'],
            expected: '<p>These are <a class="theme markdown__link search-highlight" href="https://example.com" rel="noreferrer" target="_blank">words in a sentence</a>.</p>',
        }, {
            name: 'autolinked url',
            input: 'https://example.com/words',
            searchMatches: ['example', 'words'],
            expected: '<p><a class="theme markdown__link search-highlight" href="https://example.com/words" rel="noreferrer" target="_blank">https://example.com/words</a></p>',
        }];

        for (const test of tests) {
            it(test.name, () => {
                const options = {
                    atMentions: true,
                    searchMatches: test.searchMatches,
                };
                const output = TextFormatting.formatText(test.input, options).trim();

                expect(output).toEqual(test.expected);
            });
        }
    });

    it('wildcard highlighting', () => {
        assertTextMatch('foobar', 'foo*', 'foo', 'bar');
        assertTextMatch('foo1bar', 'foo1*', 'foo1', 'bar');
        assertTextMatch('foo_bar', 'foo_*', 'foo_', 'bar');
        assertTextMatch('foo.bar', 'foo.*', 'foo.', 'bar');
        assertTextMatch('foo?bar', 'foo?*', 'foo?', 'bar');
        assertTextMatch('foo bar', 'foo*', 'foo', ' bar');
        assertTextMatch('foo bar', 'foo *', 'foo', ' bar');
        assertTextMatch('foo⺑bar', 'foo⺑*', 'foo⺑', 'bar');

        function assertTextMatch(input, search, expectedMatch, afterMatch) {
            expect(TextFormatting.formatText(input, {searchTerm: search}).trim()).
                toEqual(`<p><span class="search-highlight">${expectedMatch}</span>${afterMatch}</p>`);
        }
    });
});

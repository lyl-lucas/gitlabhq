require('~/extensions/array');
require('~/filtered_search/filtered_search_token_keys');
require('~/filtered_search/filtered_search_tokenizer');

(() => {
  describe('Filtered Search Tokenizer', () => {
    describe('processTokens', () => {
      it('returns for input containing only search value', () => {
        const results = gl.FilteredSearchTokenizer.processTokens('searchTerm');
        expect(results.searchToken).toBe('searchTerm');
        expect(results.tokens.length).toBe(0);
        expect(results.lastToken).toBe(results.searchToken);
      });

      it('returns for input containing only tokens', () => {
        const results = gl.FilteredSearchTokenizer
          .processTokens('author:@root label:~"Very Important" milestone:%v1.0 assignee:none');
        expect(results.searchToken).toBe('');
        expect(results.tokens.length).toBe(4);
        expect(results.tokens[3]).toBe(results.lastToken);

        expect(results.tokens[0].key).toBe('author');
        expect(results.tokens[0].value).toBe('root');
        expect(results.tokens[0].symbol).toBe('@');

        expect(results.tokens[1].key).toBe('label');
        expect(results.tokens[1].value).toBe('"Very Important"');
        expect(results.tokens[1].symbol).toBe('~');

        expect(results.tokens[2].key).toBe('milestone');
        expect(results.tokens[2].value).toBe('v1.0');
        expect(results.tokens[2].symbol).toBe('%');

        expect(results.tokens[3].key).toBe('assignee');
        expect(results.tokens[3].value).toBe('none');
        expect(results.tokens[3].symbol).toBe('');
      });

      it('returns for input starting with search value and ending with tokens', () => {
        const results = gl.FilteredSearchTokenizer
          .processTokens('searchTerm anotherSearchTerm milestone:none');
        expect(results.searchToken).toBe('searchTerm anotherSearchTerm');
        expect(results.tokens.length).toBe(1);
        expect(results.tokens[0]).toBe(results.lastToken);
        expect(results.tokens[0].key).toBe('milestone');
        expect(results.tokens[0].value).toBe('none');
        expect(results.tokens[0].symbol).toBe('');
      });

      it('returns for input starting with tokens and ending with search value', () => {
        const results = gl.FilteredSearchTokenizer
          .processTokens('assignee:@user searchTerm');

        expect(results.searchToken).toBe('searchTerm');
        expect(results.tokens.length).toBe(1);
        expect(results.tokens[0].key).toBe('assignee');
        expect(results.tokens[0].value).toBe('user');
        expect(results.tokens[0].symbol).toBe('@');
        expect(results.lastToken).toBe(results.searchToken);
      });

      it('returns for input containing search value wrapped between tokens', () => {
        const results = gl.FilteredSearchTokenizer
          .processTokens('author:@root label:~"Won\'t fix" searchTerm anotherSearchTerm milestone:none');

        expect(results.searchToken).toBe('searchTerm anotherSearchTerm');
        expect(results.tokens.length).toBe(3);
        expect(results.tokens[2]).toBe(results.lastToken);

        expect(results.tokens[0].key).toBe('author');
        expect(results.tokens[0].value).toBe('root');
        expect(results.tokens[0].symbol).toBe('@');

        expect(results.tokens[1].key).toBe('label');
        expect(results.tokens[1].value).toBe('"Won\'t fix"');
        expect(results.tokens[1].symbol).toBe('~');

        expect(results.tokens[2].key).toBe('milestone');
        expect(results.tokens[2].value).toBe('none');
        expect(results.tokens[2].symbol).toBe('');
      });

      it('returns for input containing search value in between tokens', () => {
        const results = gl.FilteredSearchTokenizer
          .processTokens('author:@root searchTerm assignee:none anotherSearchTerm label:~Doing');
        expect(results.searchToken).toBe('searchTerm anotherSearchTerm');
        expect(results.tokens.length).toBe(3);
        expect(results.tokens[2]).toBe(results.lastToken);

        expect(results.tokens[0].key).toBe('author');
        expect(results.tokens[0].value).toBe('root');
        expect(results.tokens[0].symbol).toBe('@');

        expect(results.tokens[1].key).toBe('assignee');
        expect(results.tokens[1].value).toBe('none');
        expect(results.tokens[1].symbol).toBe('');

        expect(results.tokens[2].key).toBe('label');
        expect(results.tokens[2].value).toBe('Doing');
        expect(results.tokens[2].symbol).toBe('~');
      });

      it('returns search value for invalid tokens', () => {
        const results = gl.FilteredSearchTokenizer.processTokens('fake:token');
        expect(results.lastToken).toBe('fake:token');
        expect(results.searchToken).toBe('fake:token');
        expect(results.tokens.length).toEqual(0);
      });

      it('returns search value and token for mix of valid and invalid tokens', () => {
        const results = gl.FilteredSearchTokenizer.processTokens('label:real fake:token');
        expect(results.tokens.length).toEqual(1);
        expect(results.tokens[0].key).toBe('label');
        expect(results.tokens[0].value).toBe('real');
        expect(results.tokens[0].symbol).toBe('');
        expect(results.lastToken).toBe('fake:token');
        expect(results.searchToken).toBe('fake:token');
      });

      it('returns search value for invalid symbols', () => {
        const results = gl.FilteredSearchTokenizer.processTokens('std::includes');
        expect(results.lastToken).toBe('std::includes');
        expect(results.searchToken).toBe('std::includes');
      });
    });
  });
})();

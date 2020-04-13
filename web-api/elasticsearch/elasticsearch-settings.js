// eslint-disable-next-line spellcheck/spell-checker
/*
considerations:
  possibly customize the stop-word list to exclude words like "tax", "court", "irs"?
  utilize word-stemming so that a search for "beginning" stems to "begin" which would match "begins", "beginner", "began" etc?
  special tokenizer that can identify and match exact docket numbers so that "193-22" is treated as a single searchable token

  https://stackoverflow.com/questions/30517904/elasticsearch-exact-matches-on-analyzed-fields?rq=1
  https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html

  Provide 'slop' as a proximity query. 
  https://www.elastic.co/guide/en/elasticsearch/guide/current/_closer_is_better.html  

  Stop-words
  https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stop-analyzer.html

  Combine stemming with exact search:
  https://www.elastic.co/guide/en/elasticsearch/reference/current/mixing-exact-search-with-stemming.html

  simple_query_string syntax (for future queries):
  https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html

*/
module.exports = {
  index: {
    analysis: {
      analyzer: {
        ShingleAnalyzer: {
          filter: ['lowercase', 'snowball', 'filter_stemmer', 'filter_shingle'],
          tokenizer: 'standard',
        },
        ustc_analyzer: {
          default: {
            type: 'simple',
          },
          default_search: {
            type: 'stop',
          },
          filter: ['lowercase', 'asciifolding', 'english', 'ustc_stop'],
          tokenizer: 'standard',
        },
      },
      filter: {
        english: { stopwords: '_english_', type: 'stop' },
        filter_shingle: {
          max_shingle_size: 10,
          min_shingle_size: 2,
          output_unigrams: true,
          type: 'shingle',
        },
        filter_stemmer: {
          language: '_english_',
          type: 'porter_stem',
        },
        ustc_stop: {
          stopwords: [
            'tax',
            'court',
            'alwaysskipthisword',
            'alwaysskipthistoo',
          ],
          type: 'stop',
        },
      },
    },
    'mapping.total_fields.limit': '4000',
    mappings: {
      test: {
        properties: {
          analyzer: 'ShingleAnalyzer',
          fields: {
            word_count: {
              analyzer: 'ShingleAnalyzer',
              store: 'yes',
              type: 'token_count',
            },
          },
          type: 'string',
        },
      },
    },
    number_of_replicas: 1,
    number_of_shards: 5,
  },
};

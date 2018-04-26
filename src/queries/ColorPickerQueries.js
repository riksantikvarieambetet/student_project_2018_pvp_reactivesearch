export function colorPickerDefaultQuery(options) {
  return (
    {
      "query": {
        "bool": {
          "must": options.musts
        }
      },
      "size": 10000,
      "aggs": {
        "colors": {
          "nested": {
            "path": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors"
          },
          "aggs": {
            "h": {
              "terms": {
                "field": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.h"
              },
              "aggs": {
                "s": {
                  "terms": {
                    "field": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.s"
                  }
                }
              }
            }
          }
        }
      }
    }
  )
}

export function componentQuery(options) {
  return (
    {
      "query": {
        "bool": {
          "must": options.musts
        }
      }
    }
  )
}

export function partialComponentQuery(options) {
  return (
    {
      "nested": {
        "path": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors",
        "query": {
          "bool": {
            "must": [
              { "range": { "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.h": { "gte": options.h - options.h_Treshold, lte: options.h + options.h_Treshold } } },
              { "range": { "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.s": { "gte": options.s - options.s_Treshold, lte: options.s + options.s_Treshold } } },
              { "range": { "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.l": { "gte": options.l - options.l_Treshold, lte: options.l + options.l_Treshold } } }
            ]
          }
        }
      }
    }
  )
}


export function testQuery(options) {
  return (
    {
      'size': 30,
      'query': {
        "function_score": {
          "boost_mode": "replace",
          "query": {
            "nested": {
              "path": "color",
              "query": {
                "function_score": {
                  "score_mode": "multiply",
                  "boost_mode": "sum",
                  "functions": [
                    {
                      "exp": {
                        "H": {
                          "origin": 0.1,
                          "offset": 0.05,
                          "scale": 0.15
                        }
                      }
                    },
                    {
                      "exp": {
                        "S": {
                          "origin": 0.2,
                          "offset": 0.1,
                          "scale": 0.15
                        }
                      }
                    },
                    {
                      "exp": {
                        "V": {
                          "origin": 190,
                          "offset": 10,
                          "scale": 15
                        }
                      }
                    },
                    {
                      "linear": {
                        "percent": {
                          "origin": 15,
                          "offset": 5,
                          "scale": 10
                        }
                      }
                    },
                    {
                      "filter": {
                        'term': { 'color.styles.id': 2 }
                      },
                      'boost_factor': 1
                    },

                    {
                      "filter": {
                        'not': { 'term': { 'color.styles.id': 2 } }
                      },
                      'boost_factor': 0.5
                    }
                  ]
                },
              },
              "score_mode": "sum",
            }
          },
          "functions": [
            {
              "script_score": {
                "script": "_score",
                "lang": "groovy"
              }
            }
          ]
        },
      }
    }
  )
}
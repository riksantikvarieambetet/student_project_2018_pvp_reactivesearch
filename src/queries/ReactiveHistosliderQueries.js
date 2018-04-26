export function reactiveHistosliderDefaultQuery(options) {
  if (options.labels.length === 0) {
    return (
      {
        "size": 0,
        "aggs": {
          "labelAnnotations": {
            "nested": {
              "path": "googleVision.responses.labelAnnotations"
            },
            "aggs": {
              "score": {
                "histogram": {
                  "field": "googleVision.responses.labelAnnotations.score",
                  "interval": 5,
                  "extended_bounds": {
                    "min": 0,
                    "max": 95
                  }
                }
              }
            }
          }
        }
      }
    )
  } else {
    return (
      {
        "query": {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "query": {
              "bool": {
                "filter": [
                  {
                    "terms": {
                      "googleVision.responses.labelAnnotations.description.keyword": options.labels
                    }
                  }
                ]
              }
            },
            "inner_hits": {}
          }
        },
        "aggs": {
          "labelAnnotations": { // name of aggregated field 
            "nested": {
              "path": "googleVision.responses.labelAnnotations"
            },
            "aggs": {
              "inner": {
                "filter": {
                  "terms": {
                    "googleVision.responses.labelAnnotations.description.keyword": options.labels
                  }
                },
                "aggs": {
                  "score": {
                    "histogram": {
                      "field": "googleVision.responses.labelAnnotations.score",
                      "interval": 5,
                      "extended_bounds": {
                        "min": 0,
                        "max": 95
                      }
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
}

// klipt från labels
export function componentQuery(options) {
  return (
    {
      "query": {
        "bool": {
          "must": options.musts
        }
      }
    }
  );
}

// klippt från labelanolist 
export function partialComponentQuery(options) {
  return (
    {
      "nested": {
        "path": "googleVision.responses.labelAnnotations",
        "query": {
          "bool": {
            "must": [
              { "term": { "googleVision.responses.labelAnnotations.description.keyword": options.label } },
              {
                "range": {
                  "googleVision.responses.labelAnnotations.score": {
                    "lte": options.lte,
                    "gte": options.gte
                  }
                }
              }
            ]
          }
        }
      }
    }
  );
}
/// TODO fixa nycklarna för labels i modalen de är namn och ibland är de dubbla kör på index 
export function componentSansLabelQuery(options) {
  return (
    {
      "query": {
        "bool": {
          "must_not": {
            "nested": {
              "path": "googleVision.responses.labelAnnotations",
              "query": {
                "bool": {
                  "must_not": [
                    {
                      "range": {
                        "googleVision.responses.labelAnnotations.score": {
                          "lte": options.lte,
                          "gte": options.gte
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  );
}

/* 
export function OLDcomponentQuery(options) {
  return (
    {
      "query": {
        "nested": {
          "path": "googleVision.responses.labelAnnotations",
          "query": {
            "bool": {
              "must": {
                "range": {
                  "googleVision.responses.labelAnnotations.score": {
                    "gte": options.gte,
                    "lte": options.lte
                  }
                }
              }
            }
          }
        }
      }
    }
  );
} */
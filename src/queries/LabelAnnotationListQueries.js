export function labelAnnotationListDefaultQuery(options) {
  return (
    {
      "query": {
        "bool": {
          "must": options.labels
        }
      },
      "size": 0,
      "aggs": {
        "googleVision": {
          "nested": {
            "path": "googleVision.responses.labelAnnotations"
          },
          "aggs": {
            "filterd": {
              "filter": {
                "range": {
                  "googleVision.responses.labelAnnotations.score": {
                    "lte": options.lte,
                    "gte": options.gte
                  }
                }
              },
              "aggs": {
                "labels": {
                  "terms": {
                    "field": "googleVision.responses.labelAnnotations.description.keyword",
                    "order": { "_count": "desc" },
                    "size": 100000
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
      },
      value: options.url // behövs endast för routing
    }
  );
}

export function partialComponentLabelsQuery(options) {
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

export function partialComponentSansLabelsQuery(options) {
  return (
    {
      "nested": {
        "path": "googleVision.responses.labelAnnotations",
        "query": {
          "bool": {
            "must": [
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

/* 
export function partialComponentLabelsQuery(options) {
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

export function partialComponentSansLabelsQuery(options) {
  return (
    {
      "nested": {
        "path": "googleVision.responses.labelAnnotations",
        "query": {
          "bool": {
            "must": [
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
} */
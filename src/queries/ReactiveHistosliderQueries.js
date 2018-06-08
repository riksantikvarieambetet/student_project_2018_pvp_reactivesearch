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
                "must": [
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

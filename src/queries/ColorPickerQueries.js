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
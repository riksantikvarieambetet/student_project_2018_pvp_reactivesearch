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
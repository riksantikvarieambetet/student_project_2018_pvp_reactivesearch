export function textFieldQuery(value) {
  if (value === "") {
    return (
      {
        "query": {
          "match_all": {}
        }
      }
    );
  }
  else {
    return (
      {
        "query": {
          "bool": {
            "should": [
              {
                "multi_match": {
                  "fields": ["description", "tag", "organizationShort", "organization", "service", "itemLabel"],
                  "query": value,
                  "type": "most_fields",
                  "fuzziness": "AUTO"
                }
              }
            ]
          }
        }
      }
    );
  }
}
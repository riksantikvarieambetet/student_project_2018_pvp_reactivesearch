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
          "multi_match": {
            "fields": ["description", "tag"],
            "query": value,
            "type": "most_fields",
            "fuzziness": "AUTO"
          }
        }
      }
    );
  }
}
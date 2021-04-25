GET hello_world/_search
{
    "query": {
        "match_phrase": {"text_entry": "the fool doth think"}
    },
    "highlight": {
        "fields": {
            "text_entry": {}
        }
    }
}
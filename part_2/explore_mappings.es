PUT hello_world/_doc/1
{
    "type": "line",
    "line_id": 18122,
    "play_name": "As you like it",
    "speech_number": 19,
    "line_number": "5.1.28",
    "speaker": "TOUCHSTONE",
    "text_entry": "The fool doth think he is wise, but the wise man knows himself to be a fool."
}

GET hello_world/_mappings


GET hello_world/_search
{
    "query": {  
        "range": {
            "speech_number": {
                "gt": 5,
                "lt": 10
            }
        }
    }
}

DELETE hello_world

// create the index
PUT hello_world

PUT hello_world/_mappings
{
    "properties" : {
        "type": {"type": "keyword"},
        "line_id" : {"type": "integer"},
        "play_name" : {"type": "keyword"},
        "line_number": {"type": "keyword"},
        "speech_number" : {"type":  "integer"},
        "speaker" : {"type": "keyword"},
        "text_entry": {"type": "text"}
    }
}

GET hello_world/_mappings

PUT hello_world/_doc/1
{
    "type": "line",
    "line_id": 18122,
    "play_name": "As you like it",
    "speech_number": 19,
    "line_number": "5.1.28",
    "speaker": "TOUCHSTONE",
    "text_entry": "The fool doth think he is wise, but the wise man knows himself to be a fool."
}

PUT _ingest/pipeline/add-timestamp
{
    "description" : "Add a timestamp to each document",
    "processors" : [
        {
            "set" : {
                "field" : "_source.@timestamp",
                "value" : "{{_ingest.timestamp}}"
            }
        }
    ]
}

PUT hello_world/_settings
{
    "index" : {
        "default_pipeline" : "add-timestamp"
    }
}

PUT hello_world/_doc/2
{
    "type":"line",
    "line_id":18123,
    "play_name":"As you like it",
    "speech_number":19,
    "line_number":"5.1.29",
    "speaker":"TOUCHSTONE",
    "text_entry":"knows himself to be a fool. The heathen"
}

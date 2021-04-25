DELETE hello_world

PUT hello_world
{
    "mappings" : {
        "properties" : {
            "line_id" : {"type": "integer"},
            "line_number": {"type": "keyword"},
            "play_name" : {"type": "keyword"},
            "speaker" : {"type": "keyword"},
            "speech_number" : {"type": "integer"},
            "text_entry": {"type": "text"},
            "type": {"type": "keyword"}
        }
    }
}

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

// will this retreive our document?
GET hello_world/_search
{
    "query": {
        "term": {"speaker": "touchstone"}
    }
}

// only exact matches will be returned
GET hello_world/_search
{
    "query": {
        "term": {"speaker": "TOUCHSTONE"}
    }
}

// no results b/c speaker is a keyword field. 
GET hello_world/_search
{
    "query": {
        "term": {"speaker": "tOuChStOnE"}
    }
}

// this query finds results b/c text_entry is a text field
GET hello_world/_search
{
    "query": {
        "match": {"text_entry": "fool"}
    },
    "highlight": {
        "fields": {
            "text_entry": {}
        }
    }
}

// this query doesn't find anything b/c play_name is keyword. Partial matches will not result in hits
GET hello_world/_search
{
    "query": {
        "match": {"play_name": "you like"}
    }
}

// other cool things we can do with text queries (autocomplete)
GET hello_world/_search
{
    "query": {
        "match_phrase_prefix": {"text_entry": "wise ma"}
    },
    "highlight": {
        "fields": {
            "text_entry": {}
        }
    }
}


// integer datatype
GET hello_world/_search
{
    "query": {
        "range": {
            "line_id": {"gte": 18122}
        }
    }
}


// date datatype
PUT hello_world/_mappings
{
    "properties": {
        "date_indexed": {"type": "date"}
    }
}

// let's add a doc that has a date_indexed timestamp
PUT hello_world/_doc/2
{
    "date_indexed": "2021-05-01T12:00:00",
    "type": "line",
    "line_id": 10022,
    "play_name": "Romeo and juliet",
    "speech_number": 2,
    "line_number": "2.5.16",
    "speaker": "ROMEO",
    "text_entry": "Where for art thou Juliet?"
}

// can perform "most recent" date queries (super powerful)
GET hello_world/_search
{
    "query": {
        "range": {
            "date_indexed": {"gte": "now-1d"}
        }
    }
}

// object data types
PUT hello_world/_mappings
{
    "properties": {
        "acted_by": {
            "type": "object",
            "properties": {
                "name": {"type": "keyword"},
                "age": {"type": "integer"}
            }
        }
    }
}

PUT hello_world/_doc/3
{
    "acted_by": {
        "name": "Hadassah Lionel",
        "age": 25
    },
    "date_indexed": "2021-05-02T12:00:00",
    "type": "line",
    "line_id": 10023,
    "play_name": "Romeo and juliet",
    "speech_number": 3,
    "line_number": "2.5.17",
    "speaker": "JULIET",
    "text_entry": "I amst here, my love"
}

GET hello_world/_search
{
    "query": {
        "term": {
            "acted_by.name": "Hadassah Lionel"
        }
    }
}

// lets use the flattened datatype to prevent mappings explosions
PUT hello_world/_mappings
{
    "properties": {
        "tags": {"type": "flattened"}
    }
}

PUT hello_world/_doc/4
{
    "tags": {
        "positive_sentiment_score": 0.000112,
        "negative_sentiment_score": 0.24,
        "comments": [
            "I really love this line",
            "Seems kinda outdated"
        ],
        "quoted_in": {
            "citation": "https://www.wikipedia.com/",
            "date_quoted": "2020-21-01T12:00:00"
        }
    }
}

// the mappings aren't mangled!
GET hello_world/_mappings

// and it still lets us do powerful queries
GET hello_world/_search
{
    "query": {
        "range": {
            "tags.positive_sentiment_score": {
                "gte": 0.0,
                "lte": 0.5
            }
        }
    }
}
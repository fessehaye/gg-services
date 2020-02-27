@app
align-lby

@static

@http
get /
get /gg_info
get /gg_set
get /challonge/:slug

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

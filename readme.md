# Poetry
Out-of-the-box framework for NodeJS Microservices


## Edito
> _Todo_


## CLI
> _Todo_


## API
### Web routing (hapi)
#### Poetry.route(_object_ `routeOptions`, _function_ `handler`)
Register a new route handled by the MicroService. The `routeOptions` are used by the web server ([HAPI](http://hapijs.com/)) to route HTTP(s) requests to the `handler` function. They can contain :
> * `path` _(required)_
> * `method`
> * `vhost`
> * [`config`](http://hapijs.com/api#route-options)
>    * `description`
>    * `notes`
>    * `tags`
>    * `payload`
>    * `validation`
>    * […](http://hapijs.com/api#route-options)

Everything's given to the local microservice HAPI web server, and sent for registration to the Web Gateway. If more than one microservice listen the same route, they will be equally balanced.

### ORM (Promised Mongo)
#### Collection

#####`db.collection.aggregate([pipeline], callback)`

#####`db.collection.count([query], callback)`

#####`db.collection.createIndex(keys, options, [callback])`

#####`db.collection.distinct(field, query, callback)`

#####`db.collection.drop([callback])`

#####`db.collection.dropIndex(index, [callback])`

#####`db.collection.dropIndexes([callback])`

#####`db.collection.ensureIndex(keys, options, [callback])`

#####`db.collection.find([criteria], [projection], [callback])`

This function applies a query to a collection. You can get the return value, which is a cursor, or pass a callback
as the last parameter. Said callback receives `(err, documents)`

#####`db.collection.findOne([criteria], [projection], callback)`

Apply a query and get one single document passed as a callback. The callback receives `(err, document)`

#####`db.collection.findAndModify(document, callback)`

#####`db.collection.getIndexes(callback)`

#####`db.collection.group(document, callback)`

#####`db.collection.insert(docOrDocs, callback)`

#####`db.collection.isCapped(callback)`

#####`db.collection.mapReduce(map, reduce, options, callback)`

#####`db.collection.reIndex(callback)`

#####`db.collection.remove(query, [justOne], [callback])`

#####`db.collection.runCommand(command, callback)`

#####`db.collection.save(doc, callback)`

#####`db.collection.stats(callback)`

#####`db.collection.update(query, update, [options], callback)`

#### Cursor

#####`cursor.batchSize(size, [callback])`

#####`cursor.count(callback)`

#####`cursor.explain(callback)`

#####`cursor.forEach(function)`

#####`cursor.limit(n, [callback])`

#####`cursor.map(function, [callback])`

#####`cursor.next(callback)`

#####`cursor.skip(n, [callback])`

#####`cursor.sort(sortOptions, [callback])`

#####`cursor.toArray(callback)`


### Logging (winston)
#### Poetry.log.silly(_..._ `message`)
#### Poetry.log.debug(_..._ `message`)
#### Poetry.log.verbose(_..._ `message`)
#### Poetry.log.info(_..._ `message`)
#### Poetry.log.warn(_..._ `message`)
#### Poetry.log.error(_..._ `message`)
#### Poetry.log(_..._ `message`)
Alias for `Poetry.log.debug()`.

### Event messaging
#### Poetry.emit(_string_ `eventName`, _object_ `message`)
#### Poetry.on(_string_ `eventName`, _object_ `pattern`, _function_ `callback`)

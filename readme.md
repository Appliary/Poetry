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

### ORM (waterline)
#### Poetry.model(_string_ `modelName`, _function_ `callback`)
Give access to the [Waterline](https://github.com/balderdashy/waterline-docs) model specified in `modelName` as an argument to the `callback`.

#### Poetry.models(_array_ `modelNames`, _function_ `callback`)
> _Todo_

#### Poetry.save(_string_ `modelName`, _string_ `object`, _function_ `callback`)
Create or update an item on the `modelName` DB collection. If the `object.id` is defined and found on the DB, it will update the existing item. Otherwise, it will be created as a new one.

#### Poetry.delete(_string_ `modelName`, _string_ `object`, _function_ `callback`)
> _Todo_
#### Poetry.get(_string_ `modelName`, _string_ `object`, _function_ `callback`)
> _Todo_
#### Poetry.list(_string_ `modelName`, _string_ `object`, _function_ `callback`)
> _Todo_

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

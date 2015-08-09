# taxy
Taxy is an extension of [galaxy](https://github.com/bjouhier/galaxy) that adds additional functionality similar to that of .NET. Taxy inherits the entire set of functionality provided by galaxy in addition to its own.

NOTE: node must be run with `--harmony`. In order to use taxy as it uses ES6 features.

## Classes
### `taxy.completion`
A class that creates a `future` that returns when the `complete` method is called. Comparable to .NET's `TaskCompletionSource`.

#### Usage
code

```javascript
var taxy = require('taxy');

taxy.main(function* () {

  var completion = new taxy.completion();

  console.log(new Date());
  setTimeout(function () {
    completion.complete();
  }, 2000);

  yield completion.future();
  console.log(new Date());

});
```

output

```
Sat Aug 08 2015 19:19:35 GMT-0700 (Pacific Daylight Time)
Sat Aug 08 2015 19:19:37 GMT-0700 (Pacific Daylight Time)
```

## API
### `taxy.delay(ms)`
Returns after the specified interval. Based on `setTimeout()`. Comparable to  .NET's `Task.Delay`.

#### Parameters
- `ms`: The number of milliseconds to delay.

#### Usage
  code

```javascript
var taxy = require('taxy');

taxy.main(function* () {

  console.log(new Date());
  yield taxy.delay(2000);
  console.log(new Date());

});
```

output

```
Sat Aug 08 2015 19:10:11 GMT-0700 (Pacific Daylight Time)
Sat Aug 08 2015 19:10:13 GMT-0700 (Pacific Daylight Time)
```

### `taxy.rest()`
Pauses execution and resumes after the functions currently in the queue have finished. This is based on `setImmediate` and allows a lengthy operation to execute without strangling the thread.

#### Usage
code

```javascript
var taxy = require('taxy');

taxy.main(function* () {

  console.log('Before');
  yield taxy.rest();
  console.log('After');

});
```

output

```
Before
After
```

### `taxy.whenAll(futures)`
Returns after all given `future` objects have completed. Comparable to  .NET's `Task.WhenAll`.

#### Return value
An array consisting of the results of all of the given futures.

#### Parameters
- `futures`: an array of `future` objects to be yielded.

#### Usage

```javascript
var taxy = require('taxy');

var foo = function* () {
  yield taxy.delay(200);
  console.log('foo');
  return 'foo';
};

var bar = function* () {
  yield taxy.delay(300);
  console.log('bar');
  return 'bar';
};

taxy.main(function* () {

  var fooFuture = taxy.spin(foo());
  var barFuture = taxy.spin(bar());

  var result = yield taxy.whenAll([fooFuture, barFuture]);
  console.log('whenAll completed. Result: ' + result);

});
```

output

```
foo
bar
whenAll completed. Result: foo,bar
```

### `taxy.whenAny(futures)`
Returns after the first of the given `future` objects has completed. Comparable to  .NET's `Task.WhenAny`.

#### Return value
The result of the first future to complete.

#### Parameters
- `futures`: an array of `future` objects to be yielded.

```javascript
var taxy = require('taxy');

var foo = function* () {
  yield taxy.delay(200);
  console.log('foo');
  return 'foo';
};

var bar = function* () {
  yield taxy.delay(300);
  console.log('bar');
  return 'bar';
};

taxy.main(function* () {

  var fooFuture = taxy.spin(foo());
  var barFuture = taxy.spin(bar());

  var result = yield taxy.whenAny([fooFuture, barFuture]);
  console.log('whenAny completed. Result: ' + result);

});
```

output

```
foo
whenAny completed. Result: foo
bar
```

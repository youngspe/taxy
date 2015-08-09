var galaxy = require('galaxy');

module.exports = function () {
    //cloning an object per http://stackoverflow.com/a/3774429
    var clone = (function () {
        return function (obj) { Clone.prototype = obj; return new Clone() };
        function Clone() { }
    }());
    
    var taxy = clone(galaxy);
    
    taxy.rest = taxy.star(setImmediate);
    
    taxy.delay = taxy.star(function (ms, callback) {
        setTimeout(function () {
            callback();
        }, ms);
    }
    );
    
    taxy.whenAll = function* (futures) {
        var results = [];
        yield futures.forEachStar(function*(future) {
            results.push(yield future());
        });
        return results;
    };
    
    taxy.completion = function () {
        var _callback;
        this.future = taxy.spin(
            taxy.star(
                function (cb) {
                    _callback = cb;
                }
            )()
        );
        var _isComplete = false;
        this.isComplete = function () {
            return _isComplete;
        }
        this.complete = function () {
            if (_isComplete) {
                return;
            }
            _isComplete = true;
            _callback.apply(null, arguments);
        }
    };
    
    taxy.whenAny = function* (futures) {
        var completion = new taxy.completion();
        futures.forEach(function (future) {
            taxy.unstar(
                function* () {
                    return yield future();
                }
            )(completion.complete);
        });
        return yield completion.future();
    };
    return taxy;
} ();
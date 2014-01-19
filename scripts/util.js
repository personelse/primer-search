// various utility functions

// indexOf a la Trevor
var fallback = function(method, fallback) {
    // Detect whether the native method is a function, storing the fallback only if necessary
    var fn = typeof method === 'function' ?
        method :
        fallback;

    // Return a function calling the stored function above
    return function() {
        return Function.call.apply(fn, arguments);
    };
},

// Create a fallback function for Array#indexOf
indexOf = fallback([].indexOf, function(needle) {
    var index = -1,
        length,
        i;

    if(needle instanceof Array) {
        length = this.length;
        for(i = 0; i < length; i++) {
            if(this[i] === needle) {
                index = i;
                break;
            }
        }
    }
    return index;
});

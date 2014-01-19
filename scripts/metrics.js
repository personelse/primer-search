var Metrics = (function() {
    
    var _permuteByRadix;
    
    _permuteByRadix = function(size) {
        var bps = ['A','G','T','C'],
            perms = Math.pow(4, size),
            str;
        
        // maybe not the best approach, but it does the job
        for(var i=0; i < perms; i++) {
            str = i.toString(4)
                .replace(/0/g, 'A')
                .replace(/1/g, 'G')
                .replace(/2/g, 'T')
                .replace(/3/g, 'C');
                
            while(temp.length < size) {
                str = 'A' + str;
            }
            
            console.log(temp);
        }
        
    };
    
    return {
        permuteDNA: function(size) {
            return _permuteByRadix(size);
        }
    };
}());

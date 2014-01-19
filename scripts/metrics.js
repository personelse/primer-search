var Metrics = (function() {
    
    var _permuteByRadix,
        _collectInstanceCounts,
        DNA = [],
        resultsBySpecies = [],
        // resultsByPermutation = [],
        resultsByPermutationObj = {};
    
    _collectInstanceCounts = function(str) {
        var regex = new RegExp(str, 'g'),
            instances = [],
            distribution = [];
            
        for(var d=0; d < DNA.length; d++) {
            instances = DNA[d].match(regex);
            if(!instances) {
                instances = [];
            }
            resultsBySpecies[d].push(instances.length);
            distribution[d] = instances.length;
        }
        
        var byPermutation = {
            'string': str,
            'distribution': distribution
        };
        
        // resultsByPermutation.push(byPermutation);
        resultsByPermutationObj[str] = distribution;
    };
    
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
                
            while(str.length < size) {
                str = 'A' + str;
            }
            
            _collectInstanceCounts(str);
            // console.log(str);
        }
        
        return {
            resultsBySpecies: resultsBySpecies,
            // resultsByPermutation: resultsByPermutation,
            resultsByPermutationObj: resultsByPermutationObj,
        };
    };
    
    return {
        permuteDNA: function(DNAin, size) {
            DNA = DNAin;
            for(var d=0; d < DNAin.length; d++) {
                resultsBySpecies.push([]);
            }
            return _permuteByRadix(size);
        }
    };
}());

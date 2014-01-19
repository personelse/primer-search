var Metrics = (function() {
    
    var _permuteByRadix,
        _collectInstanceCounts,
        _collectInstanceIndices,
        DNA = [],
        countsBySpecies = [],
        countsByPermutation = {},
        indicesBySpecies = [],
        indicesByPermutation = {};
    
    _collectInstanceCounts = function(str) {
        var regex = new RegExp(str, 'g'),
            instances = [],
            distribution = [];
            
        // iterate through species
        for(var d=0; d < DNA.length; d++) {
            instances = DNA[d].match(regex);
            if(!instances) {
                instances = [];
            }
            countsBySpecies[d].push(instances.length);
            distribution[d] = instances.length;
        }
        
        countsByPermutation[str] = distribution;
    };
    
    _collectInstanceIndices = function(str) {
        var matches = [],
            distribution = [];
            
        // iterate through species
        for(var d=0; d < DNA.length; d++) {
            matches = [];
            
            // traverse DNA for matches
            for(var b=0; b < DNA[d].length - str.length + 1; b++) {
                if(DNA[d].slice(b, b+str.length) === str) {
                    matches.push(b);
                }
            }
            
            indicesBySpecies[d].push(matches);
            distribution[d] = matches;
        }
        
        indicesByPermutation[str] = distribution;
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
            _collectInstanceIndices(str);
            // console.log(str);
        }
        
        return {
            countsBySpecies: countsBySpecies,
            countsByPermutation: countsByPermutation,
            indicesBySpecies: indicesBySpecies,
            indicesByPermutation: indicesByPermutation,
        };
    };
    
    return {
        permuteDNA: function(DNAin, size) {
            DNA = DNAin;
            for(var d=0; d < DNAin.length; d++) {
                countsBySpecies.push([]);
                indicesBySpecies.push([]);
            }
            return _permuteByRadix(size);
        }
    };
}());

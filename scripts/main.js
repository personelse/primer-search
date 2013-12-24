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

// my stuff
var Main = (function() {
    
    var getDNA,
        getSettings,
        collectFeasibleSets,
        compareAll,
        testPermutationDistributions,
        primerMetrics;
        
    getDNA = function() {
        var seqs = UI.getDNA();
        console.log(seqs.length + ' species');
        return seqs;
    };
    
    getSettings = function() {
        var settings = UI.getSettings();
        return settings;
    };
    
    return {
        run: function() {
            var DNA = getDNA(),
                settings = getSettings();
            
            // primerMetrics(DNA, settings);
            // Metrics.permuteDNA(5);
            
            UI.updateStatus('All done');
            // collectFeasibleSets(settings , DNA);
        },
        evaluateDNA: function(DNA) {
            // test if empty
            if (DNA === '') {
                return {status: 'empty', valid: false};
            }
            
            // test for valid basepairs
            if (/^[AGCTagct\s]+$/g.test(DNA)) {
                return {status: 'ready', valid: true, size: DNA.length};
            } else {
                return {status: 'invalid', valid: false};
            }
        },
        checkForDuplicates: function() {
            console.log('checkForDuplicates');
            var allDNA = UI.getDNA();
            var duplicates = [];
            // collect duplicates' indices
            for (var i=0; i < allDNA.length - 1; i++) {
                for (var k=i+1; k < allDNA.length; k++) {
                    if (allDNA[i] === allDNA[k]) {
                        duplicates.push(i);
                        duplicates.push(k);
                    }
                }
            }
            if (!!duplicates.length) console.log(duplicates);
            // reset rows if no duplicates found
            if (duplicates.length === 0) {
                $('.row.duplicate').each(function() {
                    UI.updateSpeciesStatus(this);
                });
            } else {
                for (var j=0; j < duplicates.length; j++) {
                    var row = $('.row.ready, .row.duplicate').eq(duplicates[j]);
                    UI.updateRow(row, 'duplicate', 'Duplicate DNA!');
                }
            }
        }
    };
    
}());


/*

gather DNA
gather settings

metrics
    per-species primer indices
    per-species primer count
    all-species primer indices
    all-species primer count
    
analysis
    collect per-species primers
*/


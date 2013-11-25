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
    
    // metrics
    
    // count unique primers per seq
    countPrimers = function(DNA, primerLength) {
        
    };
    
    // collect primers
    runAnalysis = function(forward_length, reverse_length, ampliconMin, ampliconMin) {
        
    };
    
    primerMetrics = function(DNA, settings) {
        if (DNA.length === 0) {
            console.log('no sequences collected!');
            return false;
        }
        // console.log('input:', DNA.length, settings);
        UI.updateStatus('Gathering metrics');
        
        var allPrimers = [];
        // var primerCounts = [];
        var primers = [];
        var results = [];
        var globalMatches = 0;
        // traverse species list
        for (t=0; t < DNA.length; t++) {
            var seq = DNA[t];
            console.log('species', t);
            
            // traverse mtdna
            var startTime = new Date().getTime();
            
            var dist = seq.length - settings.primer_forward;
            var len = settings.primer_forward;
            var currentPrimer = '';
            console.log(seq.length);
            primers = [];
            for (i=0; i < dist; i++) {
                currentPrimer = seq.slice(i, i + len);
                
                // with _.contains
                // if (!_.contains(allPrimers, currentPrimer)) {
                //     allPrimers.push(currentPrimer);
                // } else {
                //     globalMatches++;
                // }
                
                // a la Trevor
                if (allPrimers.indexOf(currentPrimer) === -1) {
                    allPrimers.push(currentPrimer);
                } else {
                    globalMatches++;
                }
                
                // with _.indexOf
                // if (_.indexOf(allPrimers, currentPrimer) > -1) {
                //     globalMatches++;
                // } else {
                //     allPrimers.push(currentPrimer);
                // }
                
                // with jquery
                // if ($.inArray(currentPrimer, allPrimers) === -1) {
                //     allPrimers.push(currentPrimer);
                // } else {
                //     globalMatches++;
                // }
                
                // if (!_.contains(primers, currentPrimer)) {
                //     primers.push(currentPrimer);
                // }
            }
            
            console.log(primers.length);
            console.log(seq.length - primers.length);
            
            var endTime = new Date().getTime();
            var time = endTime - startTime;
            console.log('Execution time: ' + time);
            
            results[t] = primers.length;
        }
        
        results.push(allPrimers.length);
        console.log('Global matches:', globalMatches);
        
        UI.updateStatus('Done gathering metrics');
        
        console.log(results);
        return results;
    };
    
    testPermutationDistributions = function() {
        
        
    };
    
    collectFeasibleSets = function(DNA, settings) {
        if (DNA.length === 0) {
            console.log('no sequences collected!');
            return false;
        }
        
        var results = [];
        // traverse species list
        for (t=0; t < DNA.length; t++) {
            var seq = DNA[t];
            // console.log('Species ' + t);
            
            // traverse mtdna
            // console.log(seq.length - settings.amp_min);
            for (i=0; i < seq.length - settings.amp_min; i++) {
                if (i===0) results[t] = [];
                
                // get distance to end of DNA to prevent amplicon max length from overflowing over the end of the DNA sequence
                var distToEnd = seq.length - i;
                var end_buffer = settings.amp_max > distToEnd ? distToEnd : settings.amp_max;
                
                // span length of amplicon, min to max
                for (l=settings.amp_min; l <= end_buffer; l++) {
                    if (l===settings.amp_min) results[t][i] = [];
                    
                    var amplicon = seq.slice(i, i + l),
                        forward = amplicon.slice(0, settings.primer_forward),
                        reverse = amplicon.slice(0, -settings.primer_reverse);
                        
                    results[t][i][l] = {
                        amplicon: amplicon,
                        start: forward,
                        end: reverse
                    };
                }
            }
        }
        
        console.log(results);
        return results;
    };
    
    compareAll = function(DNA, settings) {
        if (DNA.length === 0) {
            console.log('no sequences collected!');
            return false;
        }
        
        var results = [];
        // traverse species list
        for (t=0; t < DNA.length; t++) {
            var seq = DNA[t];
            // console.log('Species ' + t);
            
            // traverse mtdna
            // console.log(seq.length - settings.amp_min);
            for (i=0; i < seq.length - settings.amp_min; i++) {
                if (i===0) results[t] = [];
                
                // get distance to end of DNA to prevent amplicon max length from overflowing over the end of the DNA sequence
                var distToEnd = seq.length - i;
                var end_buffer = settings.amp_max > distToEnd ? distToEnd : settings.amp_max;
                
                // span length of amplicon, min to max
                for (l=settings.amp_min; l <= end_buffer; l++) {
                    if (l===settings.amp_min) results[t][i] = [];
                    
                    var amplicon = seq.slice(i, i + l),
                        forward = amplicon.slice(0, settings.primer_forward),
                        reverse = amplicon.slice(0, -settings.primer_reverse);
                        
                    results[t][i][l] = {
                        amplicon: amplicon,
                        start: forward,
                        end: reverse
                    };
                }
            }
        }
        
        console.log(results);
        return results;
    };
    
    return {
        run: function() {
            var DNA = getDNA(),
                settings = getSettings();
            
            primerMetrics(DNA, settings);
            
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


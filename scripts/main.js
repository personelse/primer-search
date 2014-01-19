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
            
            var metr = Metrics.permuteDNA(DNA, 5);
            console.log(metr);
            
            // UI.updateStatus('All done');
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

var Main = (function() {
    
    var getDNA, getSettings, collectFeasibleSets;
        
    getDNA = function() {
        var seqs = UI.getDNA();
        console.log(seqs.length + ' species');
        return seqs;
    };
    
    getSettings = function() {
        var settings = UI.getSettings();
        return settings;
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
            
            // traverse mtdna length
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

            // collectFeasibleSets(DNA, settings);
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

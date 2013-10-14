var Main = (function() {
    
    var seqs, settings,
        getDNA, getSettings;
        
    getDNA = function() {
        seqs = UI.getDNA();
        console.log(seqs.length + ' species');
    };
    
    getSettings = function() {
        settings = UI.getSettings();
    };
    
    return {
        run: function() {
            getDNA();
            getSettings();
            
        },
        evaluateDNA: function(DNA) {
            // remove whitespace
            // var that = DNA.replace(/\s+/g, ' ');
            
            // capitalize all chars
            // DNA.toUpperCase();
            
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

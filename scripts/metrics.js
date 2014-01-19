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
    
    
    
    // old stuff
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
}());

var UI = (function() {
    
    var speciesCount = 0,
        speciesMin = 2,
        speciesMax = 10,
        updateStatus,
        runStatus = $('.run-status');
    
    return {
        readyToRun: function() {
            var state = {};
            state.state = true;
            // TODO: collect and display notifications
            return state;
        },
        getDNA: function() {
            var sequences = [];
            $('.row.ready, .row.duplicate').each(function() {
                var seq = $('[name=sequence]', this).val().toUpperCase().replace(/\s+/g, '');
                sequences.push(seq);
            });
            return sequences;
        },
        getSettings: function() {
            var settings = {};
            $('.settings input').each(function() {
                if ($(this).attr('type') === 'checkbox') {
                    settings[$(this).attr('name')] = this.checked;
                } else {
                    settings[$(this).attr('name')] = $(this).val();
                }
            });
            console.log('Settings:', settings);
            return settings;
        },
        displayFirstPass: function(results) {
            var species = results.countsBySpecies,
                counts,
                $tree = $('<div>', {class: 'first-pass'});
            
            // iterate through species
            for(var s=0; s < species.length; s++) {
                counts = species[s];
                var $list = $('<div>', {class: 'species-histogram'}),
                title = '';
                
                // iterate through counts
                for(var c=0; c < counts.length; c++) {
                    titlee = counts[c]['size'] + ' - ' +counts[c]['perm'];
                    var $bar = $('<div>', {height: counts[c]['size'] + 'px', title: titlee})
                        .css({left: c});
                    $list.append($bar);
                }
                $tree.append($list);
            }
            $('.results').append($tree);
            
        },
        updateTableButtons: function() {
            var rowCount = $('.species-list .row').size();
            
            // add
            if(rowCount > speciesMin) {
                $('.species-list').addClass('removable');
            }
            if(rowCount === speciesMax) {
                $('#add_species').slideUp(250);
            }
            // remove
            if(rowCount === speciesMin) {
                $('.species-list').removeClass('removable');
            }
            if(rowCount < speciesMax) {
                $('#add_species').slideDown(250);
            }
        },
        updateRow: function(row, status, message) {
            // console.log('Row Update:', status.toUpperCase());
            $(row).removeClass('ready empty invalid duplicate')
                .addClass(status)
                .find('.status')
                .text(message);
        },
        updateSpeciesStatus: function(row) {
            var dna = $('[name=sequence]', row).val().replace(/\s+/g, '');
            var sequence = Main.evaluateDNA(dna);
            switch (sequence.status) {
                case 'ready':
                    UI.updateRow(row, 'ready', 'Ready - ' + sequence.size.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' base pairs');
                    break;
                case 'invalid':
                    UI.updateRow(row, 'invalid', 'Invalid DNA!');
                    break;
                case 'empty':
                    UI.updateRow(row, '', '');
                    break;
            }
        },
        updateStatus: function(str) {
            runStatus.append('<li>' + str + '...</li>');
        },
        displayError: function(exception) {
            console.log(exception);
        },
        init: function() {
            $('#run_test').on('click', function() {
                var readyStatus = UI.readyToRun();
                if(readyStatus.state === true) {
                    Main.run();
                } else {
                    UI.displayError(readyStatus.exception);
                }
            });

            $('#add_species').on('click', function() {
                
                var newRow = $('<div class="row"><input class="sequence" type="text" name="sequence" /><input class="name" type="text" name="name" /><span class="status"></span><button class="remove-species" type="button">x</button></div>');
                
                // var newRow = $('<tr class="species-row"><td><input type="text" name="sequence" /></td><td><input type="text" name="label" /></td><td><span class="status"></span></td><td><button class="remove-species" type="button">x</button></td></tr>');
                newRow.hide();
                $('.species-list').append(newRow);
                newRow.slideDown(250);
                UI.updateTableButtons();
            });

            $('.species-list').on('click', '.remove-species', function() {
                var currentRow = $(this).parent();
                // console.log(currentRow);
                
                $('.confirm-remove-species').modal({
                    clickClose: false,
                    fadeDuration: 150
                });
                
                $('.confirm-remove').on('click', function() {
                    $(currentRow).hide(function() {
                        $(this).remove();
                        UI.updateTableButtons();
                        Main.checkForDuplicates();
                    });
                    $.modal.close();
                });
            });

            $('.cancel-remove').on('click', function() {
                $('.confirm-remove').off('click');
                $.modal.close();
            });
            
            $('.species-list').on('input key*', '.row', function() {
                console.log('KEYUP');
                UI.updateSpeciesStatus(this);
                Main.checkForDuplicates();
            });
            
            $('.species-list .row').each(function() {
                UI.updateSpeciesStatus(this);
            });
            
            UI.updateTableButtons();
        }
    };
}());

$(function() {
    UI.init();
});

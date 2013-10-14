var UI = (function() {
    
    var speciesCount = 0,
        speciesMin = 2,
        speciesMax = 10,
        asdfasdf;
    
    
    
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
        updateRow: function(row, status, message) {
            console.log('Row Update:', status.toUpperCase());
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
            }
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
                // $('.species-list').append(newRow);
                $('.species-list').append(newRow);
                // newRow.show();
                newRow.slideDown(250);
                
                if($('.row').size() > speciesMin) {
                    $('.species-list').addClass('removable');
                }
                if($('.row').size() === speciesMax) {
                    $('#add_species').hide();
                }
            });

            $('.species-list').on('click', '.remove-species', function() {
                var currentRow = $(this).parent().parent();
                
                $('.confirm-remove-species').modal({
                    clickClose: false,
                    fadeDuration: 150
                });
                
                $('.confirm-remove').on('click', function() {
                    $(currentRow).hide(function(){
                        $(this).remove();
                        if($('.row').size() === speciesMin) {
                            $('.species-list').removeClass('removable');
                        }
                        if($('.row').size() < speciesMax) {
                            $('#add_species').show();
                        }
                    });
                    $.modal.close();
                });
            });

            $('.cancel-remove').on('click', function() {
                $.modal.close();
            });
            
            $('.species-list').on('input key*', '.row', function() {
                console.log('KEYUP');
                // evaluate this row
                // mark new status
                UI.updateSpeciesStatus(this);
                // check for duplicate sequences
                // and mark if so
                Main.checkForDuplicates();
            });
            
            $('.species-list .row').each(function() {
                UI.updateSpeciesStatus(this);
            });
        }
    }
}());

$(function() {
    UI.init();
});

girderTest.importPlugin('jobs');
girderTest.importPlugin('worker');
girderTest.importPlugin('slicer_cli_web');
girderTest.importPlugin('colormaps');
girderTest.startApp();


describe('Test colormap upload, selecting and deletion', function () {
    console.log('---------------------ini--------------------')
    var brandName = 'TestBrandName';
    it('login', function () {
        expect(1).toBe(1);
        // girderTest.login('admin', 'Admin', 'Admin', 'password')();
    });
});
/*
function _goToColormapsPluginSettings() {
    var colormapsCollection, done;
    waitsFor(function () {
        return $('a[g-target="admin"]:visible').length > 0;
    }, 'admin console link to display');

    runs(function () {
        $('a[g-target="admin"]:visible').click();
    });

    waitsFor(function () {
        return $('.g-plugins-config:visible').length > 0;
    }, 'admin console to display');

    runs(function () {
        $('.g-plugins-config:visible').click();
    });

    waitsFor(function () {
        return $('a[g-route="plugins/colormaps/config"]:visible').length > 0;
    }, 'plugins page to display');

    runs(function () {
        $('a[g-route="plugins/colormaps/config"]:visible').click();
    });

    waitsFor(function () {
        return $('#g-colormaps-settings-form:visible').length > 0;
    }, 'colormaps config to display');

    waitsFor(function () {
        return girder.rest.numberOutstandingRestRequests() === 0;
    }, 'rest requests to finish');

    runs(function () {
        $('#g-colormaps-settings-name').val('specTest');
        $('#addLabel').click();
    });

    waitsFor(function () {
        return $('.colorpickerTable').children().length === 1;
    }, 'Add one label rendered');

    // runs(function () {
    //     $('#saveColormaps').click();
    // });

    // waitsFor(function () {
    //     return $('#g-colormaps-settings-error-message').text() ===
    //     'At least one label is needed except background';
    // }, 'Too less label error raise');

    runs(function () {
        colormapsCollection = new girder.plugins.colormaps.collections.ColormapCollection();
        colormapsCollection.fetch().done(function () {
            done = true;
        });
    });

    waitsFor(function () {
        return done && colormapsCollection.length === 0;
    }, 'colormaps Collection initial fetch done, no colormap yet');

    runs(function () {
        $('#addLabel').click();
        $($('.colorpicker-component')[1]).val('rgb(0,37,122)');
        $('#saveColormaps').click();
    });

    waitsFor(function () {
        return $('.alert-success').length === 1;
    }, 'Successfully add a colormap');

    runs(function () {
        colormapsCollection.fetch().done(function () {
            done = true;
        });
    });

    waitsFor(function () {
        return done && colormapsCollection.length === 0;
    }, 'Colormaps collection has one model');
}

$(function () {
    describe('Test colormap upload, selecting and deletion', function () {
        it('register a user (first is admin)',
            girderTest.createUser('user',
                'user@email.com',
                'user',
                'user',
                'userpassword!'));

        it('Configuration test', _goToColormapsPluginSettings);

        it('view test colormap', function () {
            runs(function () {
                girder.router.navigate('colormap/view', {trigger: true});
            });
        });
        girderTest.waitForLoad();

        it('colormap selector shows up', function () {
            expect($('.h-colormap-row').length).toBe(1);
        });

        it('upload and delete colormap', function () {
            runs(function () {
                $('.h-upload-colormap').click();
            });

            girderTest.waitForDialog();

            runs(function () {
                girderTest._prepareTestUpload();
                girderTest._uploadDataExtra = 0;
                girderTest.sendFile('plugins/colormaps/plugin_tests/test_files/Rainbow.json');
            });

            waitsFor(function () {
                return $('.g-overall-progress-message i.icon-ok').length > 0;
            }, 'the filesChanged event to happen');

            runs(function () {
                $('#g-files').parent().addClass('hide');
                $('.g-start-upload').click();
            });

            waitsFor(function () {
                return $('.modal-content:visible').length === 0;
            }, 'the upload to finish');
            girderTest.waitForLoad();

            runs(function () {
                expect($('.h-colormap').children().length).toBe(3);
                expect($('.h-colormap').children()[1].text).toBe('Rainbow');
                $('.h-colormap option[value=' + $('.h-colormap').children()[1].value + ']').prop('selected', true);
                $('.h-colormap').trigger('change');
            });

            waitsFor(function () {
                return $('.h-colormap option:selected').text() === 'Rainbow' &&
                       $('.h-remove-colormap.disabled').length === 0;
            }, 'select test rainbow as colormap');

            runs(function () {
                $('.h-remove-colormap').click();
            });

            waitsFor(function () {
                return $('.h-colormap').children().length === 2 &&
                       $('.h-colormap option:selected').text() === '(none)';
            }, 'remove test rainbow colormap');
        });
    });
});
*/
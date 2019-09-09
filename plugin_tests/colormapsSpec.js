girderTest.importPlugin('jobs');
girderTest.importPlugin('worker');
girderTest.importPlugin('slicer_cli_web');
girderTest.importPlugin('colormaps');
girderTest.startApp();

$(function () {
    describe('Test colormap upload, selecting and deletion', function () {
        it('register a user (first is admin)',
            girderTest.createUser('user',
                'user@email.com',
                'user',
                'user',
                'userpassword!'));

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
                expect($('.h-colormap').children().length).toBe(2);
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
                return $('.h-colormap').children().length === 1 &&
                       $('.h-colormap option:selected').text() === '(none)';
            }, 'remove test rainbow colormap');
        });
    });
});

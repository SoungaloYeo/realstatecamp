
(function() {
    'use strict';

    angular
        .module('assessoriaTorrellesApp')
        .controller('locationPropertyController', locationPropertyController);

    locationPropertyController.$inject = ['$timeout', '$scope', '$state' ,'$stateParams', '$q', 'DataUtils', 'Property', 'Location', 'User', 'Photo'];

    function locationPropertyController ($timeout, $scope, $state, $stateParams, $q, DataUtils, Property, Location, User, Photo) {
        var vm = this;
        //** GUARDA PROPERTY
        vm.property = {};
        vm.location = {};
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = saveStartLocation;
        vm.storedPhotos = null;
        vm.toUploadPhotos = [];
        var filesToUpload = [];

        if($stateParams.id!=null && $stateParams.id!=undefined){
            Property.get({id : $stateParams.id}, function (result) {
                vm.property = result;
                vm.location = result.location;
            })
            Photo.getPhotos({id : $stateParams.id}, function (result) {
                vm.storedPhotos = result;
            })
        }

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function saveProperty (result) {
            // vm.isSaving = true;

            console.log(result);
            vm.property.location = {id: result.id};
            if (vm.property.id !== null) {
                Property.update(vm.property, processFiles, onSaveError);
            } else {
                Property.save(vm.property, processFiles, onSaveError);
            }
        }

        function saveStartLocation() {
            console.log(vm.location);
            vm.isSaving = true;
            if (vm.location.id !== null) {
                Location.update(vm.location, saveProperty, onSaveError);
            } else {
                Location.save(vm.location, saveProperty, onSaveError);
            }
        }



        function onSaveSuccess (result) {
            $scope.$emit('assessoriaTorrellesApp:propertyUpdate', result);
            $state.go('dashboard-property.list', null, { reload: 'dashboard-property.list' });
            vm.isSaving = false;
            toastr.success('Success','The property has been saved correctly!');
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        /**OBETENER LOCATION Y GUARDAR LOCATION
         *
         */


        //vm.imageStrings = [];
        function processFiles(result){
            angular.forEach(filesToUpload, function(flowFile, i){
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    var uri = event.target.result;
                    var photo = {};
                    photo.image = uri;
                    vm.imageStrings = uri;
                    // console.log(uri);
                    var conType = uri.match(/data:(.*?);/);
                    var image = uri.match(/base64,(.*?)$/);
                    console.log(conType);
                    console.log(image);
                    Photo.insertPhoto({
                        id:result.id},
                        {
                        //PHOTO obj
                        "name": flowFile.name,
                        "created": "2017-02-25T13:56:06+01:00",
                        "image": image[1],
                        "imageContentType": conType[1],
                        "description": "PLEASE WORK BATCH",
                        "url": null,
                        "cover": false
                    }, onSaveSuccess, onSaveError);
                };
                fileReader.readAsDataURL(flowFile.file);
            });
        };

        // $scope.$watch('vm.toUploadPhotos', function() {
        //     vm.toUploadPhotos = filesToUpload;
        //     console.log(vm.toUploadPhotos);
        // });


        vm.addFiles = function(files) {

            filesToUpload = files;


            toastr.success('Success','Images added, please save to store the changes!');


        }

        vm.deletePhoto = function(){

        }


    }
})();

var mod = angular.module('mollerarkivet.common.validators', ['underscoreService']);

mod.factory('validatorService', ['_',validatorService]);

function validatorService(_) {

    var acceptedImageFileTypes = [
            "BMP", "bmp", "dcx", "DCX", "PCX", "pcx", "PNG", "png", "JP2", "jp2", "JPC", "jpg", "JPG", "jpeg", "JPEG", "JFIF", "jfif",
            "pdf", "PDF", "TIF", "tif", "TIFF", "tiff", "gif", "GIF", "djvu", "DJVU", "djv", "DJV", "jb2", "JB2"
        ];

    
    var acceptedDocumentTypes = [
            "docx", "DOCX", "doc", "DOC", "xls", "XLS", "XLSX", "xlsx", "ppt", "PPT", "pptx", "PPTX"
    ]; 
    return {

        //return the subtstring for the file
        getFileEnding: function(fileName){
            if (fileName == null) {
                return "";
            }
            var position = fileName.lastIndexOf(".");
            
            if (position == -1) {
                return "";
            }
            return fileName.substr( position + 1);
        },

        /*check if the list does not contain file types from both document list and image file types
            should return true if the the list is valid
        */
        checkFileList: function (fileList) {  
            //list is null return false
            if (fileList == null) {
                return false;
            }

            //variables to determined if the list contains both documents and images
            var containsImage = false;
            var numberOfDocuments = 0;
            var containsDocument = false;


            //bind this to self so that the this reference to getFilEnding is not getting lost in anonymous functions 
            var self = this;

            //loop through the filelist
            angular.forEach(fileList, function (file) {
                //check the file endings and 
                var fileEnding = self.getFileEnding(file.name);
                angular.forEach(acceptedImageFileTypes, function (fileType) {
                    //if the last substring with the file type 
                    if (fileEnding == fileType) {
                        containsImage = true;
                    }
                });

                angular.forEach(acceptedDocumentTypes, function (fileType) {
                    //if the last substring with the file type 
                    if (fileEnding == fileType) {
                        numberOfDocuments++;
                      containsDocument = true;
                    }
                });

            });
            if (numberOfDocuments > 1) {
                return false;
            }
            //return true if the list is empty
            if (!containsImage && !containsDocument) {
                return true;
            }

            return containsDocument != containsImage;
        },

        //validate and check if the file type is one of the accpeted file types
        checkFileType: function (fileName) {
            if (fileName == null) {
                return false;
            }

            var imageFile = false;
            var documentFile = false;
            //find the filenindg by using the substring
            var fileEnding = this.getFileEnding(fileName);

            //itereate over the accpeted image types and check if the file is an image
            angular.forEach(acceptedImageFileTypes, function (fileType) {
                //if the last substring with the file type 
                if ( fileEnding == fileType) {
                    imageFile = true;
                }
            });

            //iterate over the accpeted doucment types list to check the list for 
            angular.forEach(acceptedDocumentTypes, function (documentType) {
                if (fileEnding == documentType) {
                    documentFile = true;
                }
            });

            return imageFile || documentFile;
        },
        
        //document title
        documentTitle : function(title) {
            if (title && title.length > 0) {
                return true;
            }
            return false;
        },

        //email validator
        email: function(email) {
            var emailTester = /^\S+@\S+\.\S+$/;
            if (email === null || email ==="") {
                return false;
            }
            return emailTester.test(email);
        },

        //password validator
        password:  function (password) {
            var passwordTester = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,?!@#$%\-_])[0-9a-zA-Z.,?!@#$%\-_]{8,}/;
            return passwordTester.test(password);
        }

    };
}
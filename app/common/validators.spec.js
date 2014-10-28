describe("validators.js", function () {
    var validator;
    var _;
    beforeEach(module('mollerarkivet.common.validators'));
    beforeEach(module('underscoreService'));

    //inject the validatorservice from angular into the test suite
    beforeEach(inject(function (validatorService,___) {
        validator = validatorService;
        _ = ___; //recommended adding _ on both sides of the service. service is named _(underscoreService)
    }));

    afterEach(function () {
        validator = null;
    });

    // get file ending list
    describe("getFileEnding", function () {

        it("should be defined", function () {
            expect(validator.getFileEnding).toBeDefined();
        });

        it("should return empty string if file name is null", function () {
            //arrange
            var fileName = null;

            //act
            var result = validator.getFileEnding(fileName);

            //assert
            expect(result).toBe("");
        });

        it("should return empty string if file name is empty string", function () {
            //arrange
            var fileName = "";

            //act
            var result = validator.getFileEnding(fileName);

            //assert
            expect(result).toBe("");
        });

        it("should return empty string if file name does not contain a dot", function () {
            //arrange
            var fileName = "mollervedtekter";

            //act
            var result = validator.getFileEnding(fileName);

            //assert
            expect(result).toBe("");
        });

        it("should return empty string if file name contains nothing after the dot", function () {
            //arrange
            var fileName = "mollervedtekter.";

            //act
            var result = validator.getFileEnding(fileName);

            //assert
            expect(result).toBe("");
        });

        it("should return PNG if file name contains PNG after the dot", function () {
            //arrange
            var fileName = "mollervedtekter.PNG";

            //act
            var result = validator.getFileEnding(fileName);

            //assert
            expect(result).toBe("PNG");
        });

    });

    //check File List validator
    describe("checkFileList", function () {

        it("should be defined", function () {
            expect(validator.checkFileList).toBeDefined();
        });

        it("should return false if file list is null", function () {
            //arrange
            var fileList = null;

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(false);
        });

        it("should return true if file list is empty", function () {
            //arrange
            var fileList = [];

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(true);
        });

        it("should return true if file list contains one image", function () {
            //arrange
            var fileList = [{name:"mollervedtekter.PNG"}];

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(true);
        });

        it("should return true if file list contains two images", function () {
            //arrange
            var fileList = [{ name: "mollervedtekter.PNG" }, { name: "mollervedtekter.PNG" }];

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(true);
        });

        it("should return true if file list contains one document", function () {
            //arrange
            var fileList = [{ name: "mollervedtekter.DOCX" }];

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(true);
        });

        it("should return false if file list contains two documents", function () {
            //arrange
            var fileList = [{ name: "mollervedtekter.XLSX" }, { name: "mollervedtekter.ppt" }];

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(false);
        });

        it("should return false if file list contains one image and one document", function () {
            //arrange
            var fileList = [{ name: "mollervedtekter.PNG" }, { name: "mollervedtekter.XLSX" }];

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(false);
        });

        it("should return false if file list contains one image and two documents", function () {
            //arrange
            var fileList = [{ name: "mollervedtekter.XLSX" }, { name: "mollervedtekter.PNG" }, { name: "mollervedtekter.doc" }];

            //act
            var result = validator.checkFileList(fileList);

            //assert
            expect(result).toBe(false);
        });

    });

    //checkfiltype validator
    describe("checkFileType", function() {

        it("should be defined", function() {
            expect(validator.checkFileType).toBeDefined();
        });

        it("should return false if file is null", function () {
            //arrange
            var fileName = null;

            //act
            var result = validator.checkFileType(fileName);

            //assert
            expect(result).toBe(false);
        });

        it("should return false if file is empty string", function () {
            //arrange
            var fileName = "";

            //act
            var result = validator.checkFileType(fileName);

            //assert
            expect(result).toBe(false);
        });


        it("should return false if file  is missing ending", function () {
            //arrange
            var fileName = "mollervedtekter";

            //act
            var result = validator.checkFileType(fileName);

            //assert
            expect(result).toBe(false);
        });


        it("should return true if file type is an image type of PNG", function() {
            //arrange
            var fileName = "mollervedtekter.PNG";

            //act
            var result = validator.checkFileType(fileName);

            //assert
            expect(result).toBe(true);
        });

        it("should return false if file type is an image type of PGN", function () {
            //arrange
            var fileName = "mollervedtekter.PGN";

            //act
            var result = validator.checkFileType(fileName);

            //assert
            expect(result).toBe(false);
        });

        it("should return true if file type is an document type of docx", function () {
            //arrange
            var fileName = "mollervedtekter.docx";

            //act
            var result = validator.checkFileType(fileName);

            //assert
            expect(result).toBe(true);
        });

        it("should return false if file type is an document type of docxxxx", function () {
            //arrange
            var fileName = "mollervedtekter.docxxxx";

            //act
            var result = validator.checkFileType(fileName);

            //assert
            expect(result).toBe(false);
        });
    });

    //document validator
    describe("documentTitle validator", function() {

        it("should be defined", function() {
            expect(validator.documentTitle).toBeDefined();
        });

        it("should return false when title is null", function () {
            //arrange
            var title = null;

            //act
            var result = validator.documentTitle(title);

            //assert
            expect(result).toBe(false);
        });

        it("should return false when title is an empty string", function () {
            //arrange
            var title = "";

            //act
            var result = validator.documentTitle(title);

            //assert
            expect(result).toBe(false);
        });

        it("should return true when title is not empty", function () {
            //arrange
            var title = "1";

            //act
            var result = validator.documentTitle(title);

            //assert
            expect(result).toBe(true);
        });
    });

    //validator for email
    describe("email validator", function () {

        it("should be defined", function () {
            expect(validator.email).toBeDefined();
        });

        it("should return false when email is null", function () {
            //arrange
            var email = null;

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(false);
        });


        it("should return false when email contains an empty string", function () {
            //arrange
            var email = "";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(false);
        });

        it("should return false when email contains a string with no @ or dot", function () {
            //arrange
            var email = "testmollerno";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(false);
        });

        it("should return false when email contains a string with no @", function () {
            //arrange
            var email = "testmoller.no";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(false);
        });

        it("should return false when email contains a string with no dot", function () {
            //arrange
            var email = "test@mollerno";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(false);
        });

        it("should return false when email contains a dot before @ but not after", function () {
            //arrange
            var email = "test.test@mollerno";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(false);
        });

        it("should return true if the email is an correct email", function () {
            //arrange
            var email = "test@moller.no";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(true);
        });

        it("should return true if the email contains an underscore", function () {
            //arrange
            var email = "test_test@moller.no";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(true);
        });

        it("should return true if the email contains an # hash", function () {
            //arrange
            var email = "test#test@moller.no";

            //act
            var result = validator.email(email);

            //assert
            expect(result).toBe(true);
        });

    });

    //password validator
    describe("password validator", function () {

        it("should be defined", function () {
            expect(validator.password).toBeDefined();
        });

        it("should be return false when password is null", function () {
            //arrange
            var password = null;

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(false);
        });

        it("should be return false when password is empty", function () {
            //arrange
            var password = "";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(false);
        });

        it("should be return false when password is shorter than 8 chars", function () {
            //arrange
            var password = "abdder";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(false);
        });

        it("should be return false when password is is missing an upper case letter", function () {
            //arrange
            var password = "mollergruppen1.";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(false);
        });

        it("should be return false when password is is missing an lower case letter", function () {
            //arrange
            var password = "MOLLERGRUPPEN1.";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(false);
        });

        it("should be return false when password is is missing a number", function () {
            //arrange
            var password = "Mollergruppen.";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(false);
        });

        it("should be return false when password is is missing speical char", function () {
            //arrange
            var password = "Mollergruppen1";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(false);
        });

        it("should be return false when password contains of upper and lower case letters, a number, a speical char and longer than 8 char", function () {
            //arrange
            var password = "Mollergruppen1.";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(true);
        });

        it("should be return true when password contains of upper and lower case letters, a number, a speical char and longer than 8 char", function () {
            //arrange
            var password = "Mollergruppen1.";

            //act
            var result = validator.password(password);

            //assert
            expect(result).toBe(true);
        });
    });
});
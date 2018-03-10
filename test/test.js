var Nightmare = require("nightmare");
var expect = require("chai").expect;

describe("Sch00led", function() {

    //CHECKING STUDENT-POV
    //==================================================================

    //Checking to see if logging in displays correct information
    this.timeout(30000);
    it("should login to the right home page, displaying correct name", function(done) {
    Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/")
        .type("#enter_username", "brandonn3rd")
        .type("#enter_password", "111111")
        .click("#take_user")
        .wait(5000)
        .evaluate(function() {
            return document.querySelector("#mainHeading").innerText;
        })
        .then(function(text) {
            expect(text).to.equal("Welcome Brandon");
            done();
        });
    });

    //Checking that student-view is working properly
    this.timeout(30000);
    it("should go to correct class page in student view", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/welcome/brandonn3rd/")
        .click("#sClass1")
        .wait(5000)
        .evaluate(function() {
            return document.querySelector("#s-name-test").innerText;
        }).then(function(text) {
          expect(text).to.equal("Student: Brandon");
          done();
        });
    });

    //Checking that homework submission is working properly.
    this.timeout(30000);
    it("should view the correct last homework submission after a homework is submitted", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/welcome/brandonn3rd/")
        .click("#sClass1")
        .wait(5000)
        .click(".hwModalopen[data-hwid='1']")
        .wait(2000)
        .type("#hwLink", "www.google.com")
        .type("#hwComment", "The quick fox jumped over the lazy dog")
        .click("#submitHw")
        .wait(3000)
        .click(".lastHw[data-hwid='1']")
        .wait(2000)
        .evaluate(function() {
            return document.querySelector("#linksubtest").innerText;
        }).then(function(text) {
          expect(text).to.equal("Link: www.google.com");
          done();
        });
    });
    //CHECKING TEACHER-POV
    //Checking that teacher-view is working properly along with signing out.
    this.timeout(30000);
    it("should be able to sign in as a different user after signing out", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/classStudentview/brandonn3rd/1")
        .click("#sidebartest")
        .wait(1000)
        .click("#logouttest")
        .wait(1000)
        .type("#enter_username", "perlalala")
        .type("#enter_password", "111111")
        .click("#take_user")
        .wait(2000)
        .evaluate(function() {
            return document.querySelector("#mainHeading").innerText;
        }).then(function(text) {
          expect(text).to.equal("Welcome Perla");
          done();
        });
    });

    //Should be able to view homework submission done earlier by N3rd
    this.timeout(30000);
    it("should be able to check homework submissions as a teacher", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/welcome/perlalala/")
        .click("#tClass1")
        .wait(2000)
        .click("#see-submission-next-page")
        .wait(1000)
        .click("#button-for-collapse-1")
        .wait(1000)
        .evaluate(function() {
            return document.querySelector("#student-1-sublink-1");
        }).then(function(text) {
          expect(text).to.equal("www.google.com");
          done();
        });
    });
    //Should be able to grade homework submission
    this.timeout(30000);
    it("should be able to submit a grade", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/classTeacherview/grading/perlalala/1")
        .click("#button-for-collapse-1")
        .wait(1000)
        .click("#grade-1-grade-1")
        .wait(1000)
        .click("#select-class")
        .wait(500)
        .type("B")
        .click("#select-class")
        .click("#postGrade")
        .wait(2000)
        .click("#button-for-collapse-1")
        .evaluate(function() {
            return document.querySelector("#student-1-grade-1");
        }).then(function(text) {
          expect(text).to.equal("B");
          done();
        });
    });

    //Student should be able to view their grade given by teacher
    this.timeout(30000);
    it("should be able to view grade", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/classStudentview/brandonn3rd/1")
        .evaluate(function() {
            return document.querySelector("#your-grade-1").innerText;
        }).then(function(text) {
          expect(text).to.equal("B");
          done();
        });
    });

});

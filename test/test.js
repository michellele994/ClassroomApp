var Nightmare = require("nightmare");
var expect = require("chai").expect;

describe("Sch00led", function() {
  // The default tests in mocha is 2 seconds.
  // Extending it to 30 seconds to have time to load the pages

    this.timeout(30000);
    it("should login to the right home page, displaying correct name", function(done) {
    Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/")
        .type("#enter_username", "Test2")
        .type("#enter_password", "111111")
        .click("#take_user")
        .wait(5000)
        .evaluate(function() {
            return document.querySelector("#mainHeading").innerText;
        })
        .then(function(text) {
            expect(text).to.equal("Welcome Test2");
            done();
        });
    });
    it("should go to correct class page in teacher view", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/welcome/Test2/")
        .click("#tClass5")
        .wait(5000)
        .evaluate(function() {
            return document.querySelector("#teacherViewmainHeadings").innerText;
        }).then(function(text) {
          expect(text).to.equal("Class Taught By Test2");
          done();
        });
    });
    it("should go to correct class page in student view", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/welcome/Test2/")
        .click("#sClass1")
        .wait(5000)
        .evaluate(function() {
            return document.querySelector("#s-name-test").innerText;
        }).then(function(text) {
          expect(text).to.equal("Student: Test2");
          done();
        });
    });
    it("should view the correct last homework submission after a homework is submitted", function(done) {
    new Nightmare({ show: true })
        .goto("https://sch00led.herokuapp.com/welcome/Test2/")
        .click("#sClass1")
        .wait(5000)
        .click(".hwModalopen[data-hwid='1']")
        .wait(500)
        .type("#hwLink", "www.google.com")
        .type("#hwComment", "The quick fox jumped over the lazy dog")
        .click("#submitHw")
        .wait(2000)
        .click(".lastHw[data-hwid='1'")
        .evaluate(function() {
            return document.querySelector("#linksubtest").innerText;
        }).then(function(text) {
          expect(text).to.equal("Link: www.google.com");
          done();
        });
    });
});

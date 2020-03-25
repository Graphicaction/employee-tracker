const validation = require('../config/validations');

//Function to test the input is empty or not
describe('validateNames', () => {
    it(`should have function validateNames pass input that have valid characters`, () => {
        const input =  validation.validateNames("Rose J");
        expect(input).toBe(true);
    });
     
    it('should have function validateNames pass input that does not have valid characters', () => {
        const input = validation.validateNames("123");
        expect(input).toBe(false);
    });
  });

//Testing for the employee's role 
describe('validateNumbers', () => {
    it(`should have function validateNumbers pass input that is a number`, () => {
        const input =  validation.validateNumbers("4000");
        expect(input).toBe(true);
    });
      
    it('should have function validateNumbers pass input that is not a number', () => {
        const input = validation.validateNumbers("Abc")
        expect(input).toBe(false);
    });
  });
const assert = require('assert');
const Processor = require('../index')

describe('Library test', () => {
    it('should return a list of 10 elements', () => {
        let processor = Processor.createProcessor('-20.250055', '-40.269811');
        let result = processor.getPatientsList();
        assert.equal(result.length, 10);
    });
});
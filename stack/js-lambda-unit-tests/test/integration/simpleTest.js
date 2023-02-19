const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');

describe('When requesting data from BigQuery: return a list of jobs with query result', () => {
    before(async() => {

    });

    beforeEach(async() => {

    });

    after(async() => {

    });

    afterEach(async() => {

    });

    it('should return a 200 statusCode and array [] of jobs each having a data key equals array of [1]', async() => {
        const event = { 'configOverride': true,
            'jobs': [
                {
                    'name': 'get_bigquery_data',
                    'output': 's3',
                    'dryRun': false,
                    'disabled': false,
                },
            ],
        };
        const response = await app.handler(event);
        console.log(response);
        expect(response).to.have.property('statusCode');
        expect(response.statusCode).to.be.deep.equal(200);
        expect((response.data).length).to.equal(1);
        expect((response.data)[0]).to.have.keys('data', 'runTime', 'name');
        expect((response.data)[0].data).to.be.deep.equal([1]);

    });

});

const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');

describe('When transferring data from one cloud to another: return a list of jobs', () => {
    before(async() => {

    });

    beforeEach(async() => {

    });

    after(async() => {

    });

    afterEach(async() => {

    });

    it('should return a 200 statusCode and array [] of jobs each having a runTime key', async() => {
        const event = { 'configOverride': true,
            'jobs': [
                {
                    'name': 'gcp_to_s3',
                    'output': 's3',
                    'dryRun': true,
                    'disabled': false,
                    's3Key': 'gcs/',
                    's3Bucket': 'data-staging.avro.aws',
                    'sourceBucket': 'data-staging-gcs-avro',
                },
            ],
        };
        const response = await app.handler(event);
        console.log(response);
        expect(response).to.have.property('statusCode');
        expect(response.statusCode).to.be.deep.equal(200);
        expect((response.data).length).to.equal(1);
        expect((response.data)[0]).to.have.all.keys('name', 'runTime');

    });

});

const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');

describe('When transferring data from one cloud to another: return a response code', () => {
    before(async() => {

    });

    beforeEach(async() => {

    });

    after(async() => {

    });

    afterEach(async() => {

    });

    it('should return a 400 statusCode when Error', async() => {
        const event = { 'configOverride': true,
            'jobs': [
                {
                    'name_missing': 'gcp_to_s3',
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
        expect(response.statusCode).to.be.deep.equal(400);

    });

    it('should return a 200 statusCode when Succeed', async() => {
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

    });

});

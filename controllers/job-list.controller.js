const asyncHandler = require('express-async-handler')
const Airtable = require('airtable')


const apiKey = 'keyejkeuF9jspcPBZ'
const baseId = 'appB08jCuPXfk2n9Q'

const base = new Airtable({ apiKey: apiKey }).base(baseId)

const table = base('JobList')
const view = 'Grid view'

const getJobList = asyncHandler(async (req, res) => {

    await table
        .select({
            view,
            pageSize: 100,
        })
        .all()
        .then((records) => {
            const origins = Array.from(
                new Set(records.map((record) => record.fields['Origin']))
            ).map((origin) => ({
                originName: origin ,
                personnelCategories: Array.from(
                    new Set(
                        records
                            .filter((record) => record.fields['Origin'] === origin)
                            .map((record) => record.fields['Personnel category'])
                    )
                ).map((category) => ({
                    personnelCategory: category ,
                    personnelTypes: Array.from(
                        new Set(
                            records
                                .filter(
                                    (record) =>
                                        record.fields['Origin'] === origin &&
                                        record.fields['Personnel category'] === category
                                )
                                .map((record) => record.fields['Personnel type'])
                        )
                    ).map((type) => ({
                        personnelType: type,
                        jobs: Array.from(
                            new Set(
                                records
                                    .filter(
                                        (record) =>
                                            record.fields['Origin'] === origin &&
                                            record.fields['Personnel category'] === category &&
                                            record.fields['Personnel type'] === type
                                    )
                                    .map((record) => record.fields['Job category'])
                            )
                        ).map((job) => ({
                            jobCategory: job,
                            jobData: Array.from(
                                new Set(
                                    records
                                        .filter(
                                            (record) =>
                                                record.fields['Origin'] === origin &&
                                                record.fields['Personnel category'] === category &&
                                                record.fields['Personnel type'] === type &&
                                                record.fields['Job category'] === job
                                        )
                                        .map((record) => ({
                                            [record.fields['Job code 2']]: record.fields['Specialized field'] !== '-' ? record.fields['Specialized field'] : job,
                                            comment: record.fields['Comment']
                                        }))
                                )
                            )
                        }))
                    })),
                })),
            }));

            /* console.log(JSON.stringify(origins, null, 2)) */

            res.status(200).json(origins)
        })

})


module.exports = {
    getJobList
}
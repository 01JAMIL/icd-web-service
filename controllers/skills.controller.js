const asyncHandler = require('express-async-handler')
const Airtable = require('airtable')


const getJobList = asyncHandler(async (req, res) => {
    const apiKey = 'keyejkeuF9jspcPBZ'
    const baseId = 'appB08jCuPXfk2n9Q'

    const base = new Airtable({ apiKey: apiKey }).base(baseId)

    const table = base('JobList')
    const view = 'Grid view'


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
                originName: origin,
                personnelCategories: Array.from(
                    new Set(
                        records
                            .filter((record) => record.fields['Origin'] === origin)
                            .map((record) => record.fields['Personnel category'])
                    )
                ).map((category) => ({
                    personnelCategory: category,
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
                                            jobCode: record.fields['Job code 2'],
                                            jobName: record.fields['Specialized field'] !== '-' ? record.fields['Specialized field'] : job,
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


const getJobSkills = asyncHandler(async (req, res) => {
    const base = new Airtable({ apiKey: 'keygaICcTa39pAF3L' }).base('appyZ7I2KEOqvOl6o')

    const { jobCode } = req.params
    const field = await fetchFieldName(jobCode)
    let data = []

    await base('Job x Skill V4').select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {

        records.forEach(function (record, index) {
            if (index >= 3 && record.get(field) !== undefined) {
                data.push(record)
            }
        })
        fetchNextPage();
    })


    const tasks = Array.from(
        new Set(data.map(record => record.fields['Skill Category']))
    ).map(skillCategory => ({
        skillCategoryCode: Array.from(
            new Set(
                data
                    .filter(record => record.fields['Skill Category'] === skillCategory)
                    .map(record => record.fields['Skill Item Code'].substring(0, 2))
            )
        )[0],
        skillCategory: skillCategory,
        skillClassifications: Array.from(
            new Set(
                data
                    .filter(record => record.fields['Skill Category'] === skillCategory)
                    .map(record => record.fields['Skill Classification'])
            )
        ).map(skillClass => ({
            skillClassificationCode: Array.from(
                new Set(
                    data
                        .filter(record =>
                            record.fields['Skill Category'] === skillCategory &&
                            record.fields['Skill Classification'] === skillClass
                        )
                        .map(record => record.fields['Skill Item Code'].substring(0, 7))
                )
            )[0],
            skillClassification: skillClass,
            skillItems: Array.from(
                data
                    .filter(record =>
                        record.fields['Skill Category'] === skillCategory &&
                        record.fields['Skill Classification'] === skillClass
                    ).map(record => {
                        return {
                            [record.fields['Skill Item Code']] : record.fields['Skill Item']
                        }
                    })
            )
        }))
    }))

    /* const updatedStucture = tasks.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
    }, {}); */

    res.status(200).json(tasks)
})




const fetchFieldName = async (jobCode) => {
    const base = new Airtable({ apiKey: 'keygaICcTa39pAF3L' }).base('appyZ7I2KEOqvOl6o')
    let value = ''

    await base('Job x Skill V4').select({
        maxRecords: 3,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {

        records.forEach(function (record, index) {
            if (index === 2) {
                for (const item in record.fields) {

                    if (record.fields[item] === jobCode) {
                        value = item
                        break
                    }
                }
            }
        })


        fetchNextPage();
    })

    return value
}

module.exports = {
    getJobList,
    getJobSkills
}
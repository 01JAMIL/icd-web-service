const asyncHandler = require('express-async-handler')
const Airtable = require('airtable')


const getTaskList = asyncHandler(async (req, res) => {
    const base = new Airtable({ apiKey: 'keygaICcTa39pAF3L' }).base('app8oHwd6AghNx979')
    const table = base('Task List V4')
    const view = 'Grid view'

    await table.select({
        view,
        pageSize: 100,
    })
        .all()
        .then((records) => {
            const tasks = Array.from(
                new Set(records.map((record) => record.fields['Task Major Category Code']))
            ).map((categoryCode) => ({
                [categoryCode]: Array.from(
                    new Set(
                        records
                            .filter((record) => record.fields['Task Major Category Code'] === categoryCode)
                            .map((record) => record.fields['Task Major Category'])
                    )
                ).map((majorCategory) => ({
                    [majorCategory]: Array.from(
                        new Set(
                            records
                                .filter((record) =>
                                    record.fields['Task Major Category Code'] === categoryCode &&
                                    record.fields['Task Major Category'] === majorCategory)
                                .map((record) => record.fields['Task Middle Category Code'])
                        )
                    ).map((middleCategoryCode) => ({
                        [middleCategoryCode]: Array.from(
                            new Set(
                                records
                                    .filter((record) =>
                                        record.fields['Task Major Category Code'] === categoryCode &&
                                        record.fields['Task Major Category'] === majorCategory &&
                                        record.fields['Task Middle Category Code'] === middleCategoryCode)
                                    .map((record) => record.fields['Task Middle Category'])
                            )
                        ).map((middleCategory) => ({
                            [middleCategory]: Array.from(
                                new Set(
                                    records
                                        .filter((record) =>
                                            record.fields['Task Major Category Code'] === categoryCode &&
                                            record.fields['Task Major Category'] === majorCategory &&
                                            record.fields['Task Middle Category Code'] === middleCategoryCode &&
                                            record.fields['Task Middle Category'] === middleCategory)
                                        .map((record) => record.fields['Task Minor Category Code'])
                                )
                            ).map((minorCategoryCode) => ({
                                [minorCategoryCode]: Array.from(
                                    new Set(
                                        records
                                            .filter((record) =>
                                                record.fields['Task Major Category Code'] === categoryCode &&
                                                record.fields['Task Major Category'] === majorCategory &&
                                                record.fields['Task Middle Category Code'] === middleCategoryCode &&
                                                record.fields['Task Middle Category'] === middleCategory &&
                                                record.fields['Task Minor Category Code'] === minorCategoryCode)
                                            .map((record) => record.fields['Task Minor Category'])
                                    )
                                ).map((minorCategory) => ({
                                    [minorCategory]: Array.from(
                                        new Set(
                                            records
                                                .filter((record) =>
                                                    record.fields['Task Major Category Code'] === categoryCode &&
                                                    record.fields['Task Major Category'] === majorCategory &&
                                                    record.fields['Task Middle Category Code'] === middleCategoryCode &&
                                                    record.fields['Task Middle Category'] === middleCategory &&
                                                    record.fields['Task Minor Category Code'] === minorCategoryCode &&
                                                    record.fields['Task Minor Category'] === minorCategory)
                                                .map((record) => record.fields['Assessment item code'])
                                        )
                                    ).map((assessmentItemCode) => ({
                                        [assessmentItemCode]: records
                                            .filter((record) =>
                                                record.fields['Task Major Category Code'] === categoryCode &&
                                                record.fields['Task Major Category'] === majorCategory &&
                                                record.fields['Task Middle Category Code'] === middleCategoryCode &&
                                                record.fields['Task Middle Category'] === middleCategory &&
                                                record.fields['Task Minor Category Code'] === minorCategoryCode &&
                                                record.fields['Task Minor Category'] === minorCategory &&
                                                record.fields['Assessment item code'] === assessmentItemCode)
                                            .map((record) => record.fields['Assessment item'])[0]

                                    }))
                                }))
                            }))
                        }))
                    }))
                }))
            }))


            res.status(200).json(tasks)
        })

})


const getTaskProfleList = asyncHandler(async (req, res) => {
    
    const base = new Airtable({ apiKey: 'keygaICcTa39pAF3L' }).base('appLd3HgSoia1BfQ7')
    const table = base('Task Profile V4')
    const view = 'Grid view'

    await table
        .select({
            view,
            pageSize: 100
        }).all().then((records) => {
            const taskProfiles = Array.from(
                new Set(records.map((record) => record.fields['Task Profile Type']))
            ).map((taskProfileType) => ({
                [taskProfileType]: Array.from(
                    new Set(
                        records
                            .filter((record) => record.fields['Task Profile Type'] === taskProfileType)
                            .map((record) => record.fields['Task Profile Group'])
                    )
                ).map((taskProfileGroup) => ({
                    [taskProfileGroup]: Array.from(
                        new Set(
                            records
                                .filter((record) =>
                                    record.fields['Task Profile Type'] === taskProfileType &&
                                    record.fields['Task Profile Group'] === taskProfileGroup
                                ).map((record) => record.fields['Task Profile Code'])
                        )
                    ).map((taskProfileCode) => ({
                        [taskProfileCode]: Array.from(
                            new Set(
                                records
                                    .filter((record) =>
                                        record.fields['Task Profile Type'] === taskProfileType &&
                                        record.fields['Task Profile Group'] === taskProfileGroup &&
                                        record.fields['Task Profile Code'] === taskProfileCode
                                    ).map((record) => record.fields['Task Profile'])
                            )
                        ).map((taskProfile) => ({
                            [taskProfile]: records
                                .filter((record) =>
                                    record.fields['Task Profile Type'] === taskProfileType &&
                                    record.fields['Task Profile Group'] === taskProfileGroup &&
                                    record.fields['Task Profile Code'] === taskProfileCode &&
                                    record.fields['Task Profile'] === taskProfile
                                ).map((record) => record.fields['Description of Task Profile'])[0]
                        }))
                    }))
                }))
            }))

            res.status(200).json(taskProfiles)
        })

})

module.exports = {
    getTaskList,
    getTaskProfleList
}
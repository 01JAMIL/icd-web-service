const Airtable = require('airtable')
const asyncHandler = require('express-async-handler')

const getSkillsTasksMiddleCategory = asyncHandler(async (req, res) => {


    const apiKey = 'keygaICcTa39pAF3L'
    const baseId = 'appM0M0J8QrVCmIa8'

    const base = new Airtable({ apiKey: apiKey }).base(baseId)

    const table = base('TaskxSkillMC')
    const view = 'Grid view'

    const skillClassifications = req.body.data

    await table.select({
        view,
        pageSize: 100
    }).all().then(async (records) => {
        let result = []
        for (let index = 0; index < skillClassifications.length; index++) {
            const skillClassificationCode = skillClassifications[index]
            const skillCategory = records[0].fields[skillClassificationCode]
            const skillClassification = records[1].fields[skillClassificationCode]

            let skillClassificationData = []
            for (let recIndex = 2; recIndex < records.length; recIndex++) {
                if (records[recIndex].fields[skillClassificationCode] !== undefined) {
                    skillClassificationData.push(records[recIndex])
                }
            }


            const filtredSillClassificationData = Array.from(
                new Set(skillClassificationData.map(record => record.fields['Task Major Category']))
            ).map((taskMajorCategory) => ({
                [taskMajorCategory]: Array.from(
                    new Set(
                        skillClassificationData
                            .filter(record => record.fields['Task Major Category'] === taskMajorCategory)
                            .map(record => record.fields['Task Middle Category Code'])
                    )
                ).map((taskMiddleCategoryCode) => ({
                    [taskMiddleCategoryCode]: skillClassificationData
                        .filter(record =>
                            record.fields['Task Major Category'] === taskMajorCategory &&
                            record.fields['Task Middle Category Code'] === taskMiddleCategoryCode
                        ).map(record => record.fields['Task Middle Category'])[0]
                }))
            }))


            result.push({
                skillClassificationCode: skillClassificationCode,
                skillCategory: skillCategory,
                skillClassification: skillClassification,
                tasks: filtredSillClassificationData
            })

            /** Structure
             * {
             *      skillClassificationCode: '' ,
             *      skillCategory: '',
             *      skillClassification: '',
             *      tasks: [] // Linkage informations between Task middle category in Task dictionary and Skill Classification in Skill dictionary.
             * }
             */
        }

        res.status(200).json(result)

    })



})


const getSkillsTasksMinorCategory = asyncHandler(async (req, res) => {
    const apiKey = 'keygaICcTa39pAF3L'
    const baseId = 'appM0M0J8QrVCmIa8'

    const base = new Airtable({ apiKey: apiKey }).base(baseId)

    const table = base('Task x Skill V4')
    const view = 'Grid view'

    const skillItemsCodes = req.body.data


    await table.select({
        view,
        pageSize: 100
    }).all().then(async (records) => {
        let result = []

        for (let index = 0; index < skillItemsCodes.length; index++) {
            const skillItemCode = skillItemsCodes[index]
            const skillCategoryCode = skillItemsCodes[index].substring(0, 2)
            const skillClassificationCode = skillItemsCodes[index].substring(0, 7)
            const skillCategory = records[0].fields[skillItemCode]
            const skillClassification = records[1].fields[skillItemCode]
            const skillItem = records[2].fields[skillItemCode]

            let skillItemsData = []

            for (let recIndex = 3; recIndex < records.length; recIndex++) {
                if (records[recIndex].fields[skillItemCode] !== undefined) {
                    skillItemsData.push(records[recIndex])
                }
            }

            const filtredSkillItemsData = Array.from(
                new Set(skillItemsData.map(record => record.fields['Task Major Category']))
            ).map((taskMajorCategory) => ({
                [taskMajorCategory]: Array.from(
                    new Set(
                        skillItemsData
                            .filter(record => record.fields['Task Major Category'] === taskMajorCategory)
                            .map(record => record.fields['Task Middle Category'])
                    )
                ).map((taskMiddleCategory) => ({
                    [taskMiddleCategory]: Array.from(
                        new Set(
                            skillItemsData
                                .filter(record =>
                                    record.fields['Task Major Category'] === taskMajorCategory &&
                                    record.fields['Task Middle Category'] === taskMiddleCategory
                                ).map(record => record.fields['Task Minor Category Code'])
                        )
                    ).map((taskMinorCategoryCode) => ({
                        [taskMinorCategoryCode]: skillItemsData
                            .filter(record =>
                                record.fields['Task Major Category'] === taskMajorCategory &&
                                record.fields['Task Middle Category'] === taskMiddleCategory &&
                                record.fields['Task Minor Category Code'] === taskMinorCategoryCode
                            ).map(record => record.fields['Task Minor Category'])[0]
                    }))
                }))
            }))


            result.push({
                skillCategoryCode: skillCategoryCode ,
                skillCategory: skillCategory,
                skillClassificationCode: skillClassificationCode ,
                skillClassification: skillClassification,
                skillItemCode: skillItemCode,
                skillItem: skillItem,
                tasks: filtredSkillItemsData
            })
        }

        res.status(200).json(result)
    })
})

module.exports = {
    getSkillsTasksMiddleCategory,
    getSkillsTasksMinorCategory
}
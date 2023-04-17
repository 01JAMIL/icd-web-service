const Airtable = require('airtable')
const asyncHandler = require('express-async-handler')


const getFieldName = async (skillClassification) => {
    const base = new Airtable({ apiKey: 'keygaICcTa39pAF3L' }).base('appM0M0J8QrVCmIa8')
    let value = ''
    await base('TaskxSkillMC').select({
        maxRecords: 3,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {

        records.forEach(function (record, index) {
            if (index === 1) {
                for (const item in record.fields) {

                    if (record.fields[item] === skillClassification) {
                        value = item
                        break
                    }
                }
            }
        })

        fetchNextPage()
    })

    return value
}


const getSkillsTasks = asyncHandler(async (req, res) => {


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
            const fieldName = await getFieldName(skillClassifications[index])
            const skillCategory = records[0].fields[fieldName]

            let skillClassificationData = []
            for (let recIndex = 2; recIndex < records.length; recIndex++) {
                if (records[recIndex].fields[fieldName] !== undefined) {
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
                skillClassificationCode: fieldName ,
                skillCategory: skillCategory,
                skillClassification: skillClassifications[index],
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


module.exports = {
    getSkillsTasks
}
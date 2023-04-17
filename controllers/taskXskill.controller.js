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

    const skillClassifications = [
        '(Strategy) Market opportunity evaluation and selection',
        '(Strategy) Marketing',
        '(Strategy) Product and service strategy',
        '(Strategy) Sales strategy',
        '(Strategy) Product and service development strategy',
        '(Support) Change management methods',
        'Business industry',
        'Corporate activities'
    ]

    await table.select({
        view,
        pageSize: 100
    }).all().then(async (records) => {
        console.log(records.length)
        let result = []

        for (let index = 0; index < skillClassifications.length; index++) {
            const fieldName = await getFieldName(skillClassifications[index])
            let skillClassificationData = []
            for (let recIndex = 2; recIndex < records.length; recIndex++) {
                if (records[recIndex].fields[fieldName] !== undefined) {
                    skillClassificationData.push(records[recIndex].fields)
                }
            }

            result.push(skillClassificationData)
        }

        res.status(200).json(result)

    })



})


module.exports = {
    getSkillsTasks
}
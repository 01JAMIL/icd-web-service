const { Client } = require('@elastic/elasticsearch')
const axios = require('axios')
const asyncHandler = require('express-async-handler')

const client = new Client({
    cloud: {
        id: 'ICDDataBase:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRjNzUxMWVkODQ4ZTM0MDdjOTUwYzJhOTA0MDY0ZmU1NyQzMmM3NWJmNGQxNmU0NGRjYjhhOWUzNGZkNDc5M2RhNQ=='
    },

    auth: {
        apiKey: 'OXYtQjJZY0I4VUhub2FfMHdJRVI6MWhscEpNQWNUQk8wME84TGZOM0d1Zw=='
    }
})

const createDocument = async () => {
    const response = await client.cat.indices({
        format: 'json'
    })

    await client.indices.delete({ index: 'skills-by-job-code' })
    await sleep(3000)
    await client.indices.create({
        index: 'skills-by-job-code',
        body: {
            mappings: {
                properties: {
                    element: {
                        properties: {
                            skillCategoryCode: { type: 'keyword' },
                            skillCategory: { type: 'text' },
                            skillClassifications: {
                                type: 'nested',
                                properties: {
                                    skillClassificationCode: { type: 'keyword' },
                                    skillClassification: { type: 'text' },
                                    skillItems: {
                                        type: 'nested',
                                        properties: {
                                            skillItemCode: { type: 'keyword' },
                                            skillItem: { type: 'text' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });


}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const saveDataIntoDocument = asyncHandler(async (req, res) => {

    const { jobCode } = req.params
    await createDocument()
    const url = `https://test-web-service-3z32.onrender.com/api/skills/get-job-skill/${jobCode}`
    const response = await axios.get(url);
    const bulkBody = [];

    response.data.forEach((element, index) => {
        bulkBody.push({ index: { _index: 'skills-by-job-code', _id: index + 1 } })
        bulkBody.push({ element })
    });

    await client.bulk({
        body: bulkBody,
        refresh: true,
    })

    res.status(200).json({
        result: 'Data created successfully!'
    })
})

const search = asyncHandler(async (req, res) => {

    const { input } = req.body

    const response = await client.search({
        index: 'skills-by-job-code',
        body: {
            query: {
                nested: {
                    path: "element.skillClassifications",
                    query: {
                        nested: {
                            path: "element.skillClassifications.skillItems",
                            query: {
                                match_phrase_prefix: {
                                    'element.skillClassifications.skillItems.skillItem': input,
                                },
                            },
                        },
                    },
                },
            },
        }
    })


    const matchedSkillItems = response.hits.hits.flatMap(hit =>
        hit._source.element.skillClassifications.flatMap(classification => ({
            skillCategoryCode: hit._source.element.skillCategoryCode,
            skillCategory: hit._source.element.skillCategory,
            skillClassificationCode: classification.skillClassificationCode,
            skillClassification: classification.skillClassification,
            skillItems: classification.skillItems.filter(item => {
                const searchWords = input.toLowerCase().split(' ');
                return searchWords.every(word => item.skillItem.toLowerCase().includes(word));
            }).length > 0 ?
                classification.skillItems.filter(item => {
                    const searchWords = input.toLowerCase().split(' ');
                    return searchWords.every(word => item.skillItem.toLowerCase().includes(word));
                }) :
                0
        }))
    );

    res.status(200).json(matchedSkillItems)
})



module.exports = {
    saveDataIntoDocument,
    search
}



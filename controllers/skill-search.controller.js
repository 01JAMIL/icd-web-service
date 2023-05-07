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
    const indexExists = await client.indices.exists({ index: 'skills-by-job-code' })
    console.log(indexExists)
    if (indexExists) {
        await client.indices.delete({ index: 'skills-by-job-code' })
    }

    await client.indices.create({
        index: 'skills-by-job-code',
        body: {
            // Adding "wait_for_active_shards": "1" ensures that the index is ready before proceeding
            settings: {
                "index": {
                    "number_of_shards": 1,
                    "number_of_replicas": 1
                },
                "index.write.wait_for_active_shards": "1",
            },
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
    })
}


const saveDataIntoDocument = asyncHandler(async (req, res) => {

    const { jobCode } = req.params
    await createDocument()
    const url = `https://test-web-service-3z32.onrender.com/api/skills/get-job-skill/${jobCode}`;
    const response = await axios.get(url)
    const bulkBody = [];

    response.data.forEach((element, index) => {
        bulkBody.push({ index: { _index: 'skills-by-job-code' } })
        bulkBody.push({ element });
    })

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

    const response =
        !(!input || input === '') ? await client.search({
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
        }) :
            await client.search({
                index: 'skills-by-job-code'
            })


    const matchedSkillItems = response.hits.hits.flatMap(hit =>
        hit._source.element.skillClassifications.flatMap(classification => {
            const filteredSkillItems = classification.skillItems.filter(item => {
                const searchWords = input.toLowerCase().split(' ');
                return searchWords.every(word => item.skillItem.toLowerCase().includes(word));
            });
            return {
                skillCategoryCode: hit._source.element.skillCategoryCode, skillCategory: hit._source.element.skillCategory,
                skillClassificationCode: classification.skillClassificationCode,
                skillClassification: classification.skillClassification,
                skillItems: filteredSkillItems.length > 0 ? filteredSkillItems : '',
            };
        })
    )

    res.status(200).json(matchedSkillItems)
})



module.exports = {
    saveDataIntoDocument,
    search
}



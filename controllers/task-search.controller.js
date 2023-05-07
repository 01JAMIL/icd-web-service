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
    const indexExists = await client.indices.exists({ index: 'tasks-skill-items-code' })
    if (indexExists) {
        await client.indices.delete({ index: 'tasks-skill-items-code' })
    }

    await client.indices.create({
        index: 'tasks-skill-items-code',
        body: {
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
                            skillClassificationCode: { type: 'keyword' },
                            skillClassification: { type: 'text' },
                            skillItemCode: { type: 'keyword' },
                            skillItem: { type: 'text' },
                            tasks: {
                                type: 'nested',
                                properties: {
                                    taskMajorCategoryCode: { type: 'keyword' },
                                    taskMajorCategory: { type: 'text' },
                                    taskMiddleCategories: {
                                        type: 'nested',
                                        properties: {
                                            taskMiddleCategoryCode: { type: 'keyword' },
                                            taskMiddleCategory: { type: 'text' },
                                            taskMinorCategories: {
                                                type: 'nested',
                                                properties: {
                                                    taskMinorCategoryCode: { type: 'keyword' },
                                                    taskMinorCategory: { type: 'text' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

const saveDataIntoDocument = asyncHandler(async (req, res) => {

    const { data } = req.body
    await createDocument()
    const url = `https://test-web-service-3z32.onrender.com/api/tasksxskills/get-tasks-x-skills-minor`;
    const response = await axios.post(url, { data: data })
    const bulkBody = [];

    response.data.forEach((element) => {
        bulkBody.push({ index: { _index: 'tasks-skill-items-code' } })
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
    const response = await client.search({
        index: 'tasks-skill-items-code',
        query: {
            nested: {
                path: "element.tasks",
                query: {
                    nested: {
                        path: "element.tasks.taskMiddleCategories",
                        query: {
                            nested: {
                                path: "element.tasks.taskMiddleCategories.taskMinorCategories",
                                query: {
                                    match_phrase_prefix: {
                                        "element.tasks.taskMiddleCategories.taskMinorCategories.taskMinorCategory": input
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })


    const matchedTasks = response.hits.hits.flatMap(hit =>
        hit._source.element.tasks.flatMap(task => {

            const filteredSkillItems = task.taskMiddleCategories.map(taskMiddleCategory => {
                return taskMiddleCategory.taskMinorCategories.filter(minorCategory => {
                    const searchWords = input.toLowerCase().split(' ');
                    return searchWords.every(word => minorCategory.taskMinorCategory.toLowerCase().includes(word));
                })
            });
            const updatedTask = filteredSkillItems.filter(e => e.length > 0)[0] ? filteredSkillItems.filter(e => e.length > 0)[0] : ''

            if (updatedTask !== '') {
                updatedTask[0].taskMinorCategoryCode = updatedTask[0].taskMinorCategoryCode + '-' + hit._source.element.skillItemCode
            }
            return {
                skillCategoryCode: hit._source.element.skillCategoryCode,
                skillCategory: hit._source.element.skillCategory,
                skillClassificationCode: hit._source.element.skillClassificationCode,
                skillClassification: hit._source.element.skillClassification,
                skillItemCode: hit._source.element.skillItemCode,
                skillItem: hit._source.element.skillItem,
                taskMajorCategoryCode: task.taskMajorCategoryCode,
                taskMajorCategory: task.taskMajorCategory,
                tasks: updatedTask
            };
        })
    )

    res.status(200).json(matchedTasks)
})



module.exports = {
    saveDataIntoDocument,
    search
}
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJSONBodyParser from '@middy/http-json-body-parser';

const addTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {

  const { title, description } = event.body;
  const createdAt = new Date();
  const id = uuidv4();

  console.log("created id: ", id);

  const newTask = {
    id,
    title,
    description,
    createdAt,
    done: false,
  };

  console.log("task created: ", newTask);
  await dynamodb
    .put({
      TableName: "TaskTable",
      Item: newTask,
    })
    .promise();

  return {
    status: 200,
    body: JSON.stringify(newTask),
  };

} catch (error) {
  console.log('error: ', error);
}

};

export const handlerAddTask = middy(addTask).use(httpJSONBodyParser());


import 'source-map-support/register'
import { getAllGroups } from '../../businessLogic/groups';

import * as express from 'express';
import * as awsServerlessExpress from 'aws-serverless-express';

const app = express()

app.get('/groups', async (_req,res) => {
  const groups = await getAllGroups()

  res.header('Access-Control-Allow-Origin','*')
  res.json({
    items: groups
  })
})

//create express server
const server = awsServerlessExpress.createServer(app)

//pass api gateway events to the express server

exports.handler = (event,context) => {awsServerlessExpress.proxy(server,event,context)}


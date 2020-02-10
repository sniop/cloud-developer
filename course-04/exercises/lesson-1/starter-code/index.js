const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  // TODO: Use these variables to record metric values
  let latency
  let requestWasSuccessful = 0

  const startTime = timeInMs()
  try{
    const response= await axios.get(url);
    requestWasSuccessful = true;
    console.log("*** response *** "+response);
  }catch(error){
    requestWasSuccessful=false;
    console.error(error);
  }

  const latency = timeInMs() - startTime;

  //DONE: Record time it took to get a response
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Latency', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Milliseconds', // 'Count' or 'Milliseconds'
        Value: latency// Total value
      }
    ],
    Namespace: 'Udacity/Serveless'
  }).promise()

  //DONE: Record if a response was successful or not
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Successful', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Count', // 'Count' or 'Milliseconds'
        Value: requestWasSuccessful ? 1 : 0// Total value
      }
    ],
    Namespace: 'Udacity/Serveless'
  }).promise()
}

function timeInMs() {
  return new Date().getTime()
}

/**
 * Message Processing Logs - Last Hour Test
 * 
 * This script fetches message processing logs from the last hour
 * for a specific integration flow
 */

const SapClient = require('../dist').default;

// Name of the specific integration flow to filter for
const FLOW_NAME = 'Replicate_Person_Data_from_SuccessFactors_EC_to_SAP_ECC_ZPEX_PERS';

// Time window in hours to fetch logs for
const HOURS_AGO = 6;

/**
 * Format SAP OData date string to readable format
 * Converts "/Date(1744010643912)/" to a readable date string
 */


async function fetchLastHourLogs() {
  // Create the client
  const client = new SapClient({
    oauth: {
      url: process.env.SAP_OAUTH_TOKEN_URL,
      clientid: process.env.SAP_OAUTH_CLIENT_ID,
      clientsecret: process.env.SAP_OAUTH_CLIENT_SECRET,
    },
    apiUrl: process.env.SAP_BASE_URL,
  });
  
  // Calculate timestamp for the specific time window
  const endDate = new Date(); // Current time
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - HOURS_AGO);
  
  console.log(`Time window: ${startDate.toISOString()} to ${endDate.toISOString()}`);
  console.log(`Fetching message logs since: ${startDate.toLocaleString()}`);
  
  try {
    // Create a filter string - the client now automatically formats datetime values correctly
    const filter = `IntegrationFlowName eq '${FLOW_NAME}' and LogStart ge datetime'${startDate.toISOString()}'`;
    
    console.log(`Using filter: ${filter}`);
    
    // Get logs with explicit filter string - client handles datetime format automatically
    const { logs, count } = await client.messageProcessingLogs.getMessageProcessingLogs({
      filter: filter,
      orderby: ['LogEnd desc'],
      inlinecount: true
    });
    
    console.log(`Found ${count} message logs in the last ${HOURS_AGO} hour(s)`);
    
    if (logs.length > 0) {
      // Check the time range of returned logs
      const oldestLog = logs[logs.length - 1];
      const newestLog = logs[0];
      
      console.log(`Oldest log time: ${oldestLog.LogEnd instanceof Date ? oldestLog.LogEnd.toLocaleString() : 'Not a Date'}`);
      console.log(`Newest log time: ${newestLog.LogEnd instanceof Date ? newestLog.LogEnd.toLocaleString() : 'Not a Date'}`);
      
      // Print summary of logs - LogEnd is now a Date object
      logs.forEach((log, index) => {
        const logTime = log.LogEnd instanceof Date ? log.LogEnd.toLocaleString() : log.LogEnd;
        console.log(`[${index + 1}] ${log.MessageGuid} | Status: ${log.Status} | Flow: ${log.IntegrationFlowName} | End: ${logTime}`);
      });
    } else {
      console.log("No logs found in the specified time range");
    }
    
    return logs;
  } catch (error) {
    console.error('Error fetching message logs:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  fetchLastHourLogs()
    .then(() => console.log('Done'))
    .catch(err => {
      console.error('Script failed:', err);
      process.exit(1);
    });
}

module.exports = { fetchLastHourLogs };

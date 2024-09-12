/**
 * API CALLS
 */

export const fetchAllDocIds = async () => {
  let endpoint = `${process.env.REACT_APP_API_HOST}/document/all/ids`;
  try {
    const response = await fetch(endpoint);
    let docIdsArray = await response.json();
    return docIdsArray;
  } catch (err) {
    console.error('[FETCH ERROR] fetch doc ids failed: ', err);
    return [];
  }
};

export const fetchDocInitStateByDocId = async (docId) => {
  try {
    let endpoint = `${process.env.REACT_APP_API_HOST}/document/${docId}`;
    let response = await fetch(endpoint);
    let data = await response.json();
    const { state } = data;
    return state;
  } catch (err) {
    console.error('[FETCH ERROR]: init state fetch failed for docId: ', docId, { err });
    return null;
  }
};

/**
 * Api call which should be implemented for codox utilization during sync
 */
export const fetchStateWithTimestamp = async (docId) => {
  try {
    let endpoint = `${process.env.REACT_APP_API_HOST}/document/${docId}/state/latest`;
    const response = await fetch(endpoint);
    const { data, timestamp } = await response.json();
    return { data, timestamp };
  } catch (err) {
    console.error('[FETCH ERROR][fetchStateWithTimestamp]: fetch state with timestamp failed: ', docId, { err });
    throw err;
  }
};

// NOTE: ONLY FOR DEV - simulation of update endpoint call
export const updateServerState = async (docId, state) => {
  try {
    let endpoint = `${process.env.REACT_APP_API_HOST}/document/delta/content/updateClient`;
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // FOR TEST - session_time is set up here, instead of server time
        meta: { docId, timestamp: { session_time: new Date().getTime(), order: 569 } },
        data: {
          state,
        },
      }),
    });
  } catch (err) {
    console.error('[FETCH ERROR][updateServerState]: update server state with timestamp failed: ', docId, { err });
    throw err;
  }
};

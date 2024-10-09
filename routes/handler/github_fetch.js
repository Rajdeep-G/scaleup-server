import axios from 'axios';
import { DateTime } from 'luxon';
import fs from 'fs'; 




if (!TOKENS) {
    console.error("GitHub API token is missing.");
    process.exit(1);
}
const headers = { Authorization: `token ${TOKENS[0]}` };

const rotate_token = (headers) => {
    const token = TOKENS.shift();
    headers.Authorization = `token ${token}`;
    TOKENS.push(token);
}


async function fetchCommentsPerIssue(fullname) {
    const url = `https://api.github.com/repos/${fullname}/issues`;
    console.log(url);

    // try {
        const allIssueUrl = {};
        const n = 1000;

        for (let pageRagge = 1; pageRagge <= n; pageRagge++) {
            console.log(`Page: ${pageRagge}`);

            
            try{
                const response = await axios.get(url, {
                    headers: headers,
                    params: { page: pageRagge, per_page: 100, state: 'closed' }
                });   
                if (response.status === 403) {
                    throw new Error('403 Forbidden - Rate limit exceeded.');
                }     
            } catch(error) {
                if (error.response && error.response.status === 403) {
                    console.log('403 Forbidden - Rate limit exceeded. Retrying with token rotation.');
                    rotate_token(headers);
                    const retryInterval = getRandomInterval(1, 5) * 60 * 1000; // Random interval between 1 to 5 minutes
                    console.log(`Retrying after ${retryInterval / 60000} minutes.`);
                    await new Promise((resolve) => setTimeout(resolve, retryInterval));
                    pageRagge--;
                    continue;
                } else {
                    console.error('An error occurred:', error.message);
                    break;
                }
            }

            const data = response.data;
            console.log(data.length);
            if (data.length === 0) {
                console.log('breaking');
                break;
            }

            const temp = {};
            for (const issue of data) {
                const { comments_url, url: issueUrl, id, labels, created_at, closed_at } = issue;

                const timeA = DateTime.fromISO(created_at);
                const timeB = DateTime.fromISO(closed_at);
                const timeDifference = timeB.diff(timeA, ['seconds']).toObject();

                temp[id] = {
                    comments_url,
                    url: issueUrl,
                    labels,
                    created_at,
                    closed_at,
                    time_difference: {
                        total_seconds: timeDifference.seconds,
                        minutes: timeDifference.seconds / 60,
                        hours: timeDifference.seconds / 3600
                    }
                };
            }

            if (!allIssueUrl[fullname]) {
                allIssueUrl[fullname] = temp;
            } else {
                Object.assign(allIssueUrl[fullname], temp);
            }
        }

        return allIssueUrl;
    // } catch (error) {
    //     console.log(`Error fetching comments: ${error}`);
    //     return null;
    // }
}

// async function fetch(serial) {
//     const [startFrom, outerWrapper] = loadProgress(serial);
//     const data = fs.readFileSync(`names_${serial}.txt`, 'utf-8').split('\n').map(line => line.trim());
//     const total = data.length;

//     let counter = startFrom;
//     const alreadyDone = data.slice(0, startFrom);

//     for (const each of data.slice(startFrom)) {
//         counter++;
//         const subcount = Math.floor(counter / 500);
//         console.log(`[${counter}/${total}]`);
//         console.log(`Fetching for repo ${counter}: ${each}`);

//         if (alreadyDone.includes(each)) {
//             console.log('Already done.');
//             continue;
//         }

//         const allIssueUrl = await fetchCommentsPerIssue(each);

//         if (!allIssueUrl) {
//             continue;
//         }

//         Object.assign(outerWrapper, allIssueUrl);

//         if (counter % 10 === 0) {
//             await new Promise((resolve) => setTimeout(resolve, 5000)); // Sleep for 5 seconds
//             saveState(outerWrapper, serial, counter, subcount);
//         }
//     }

//     saveState(outerWrapper, serial, counter, Math.floor(counter / 500));
// }

// const serial = 5;
// fetch(serial);

export { fetchCommentsPerIssue };
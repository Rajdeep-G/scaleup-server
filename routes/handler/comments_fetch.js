import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const TOKENS=[process.env.GITHUB_API_TOKEN1,process.env.GITHUB_API_TOKEN2]

if (!TOKENS) {
  console.error("GitHub API token is missing.");
  process.exit(1);
}
const headers = { Authorization: `token ${TOKENS[0]}` };

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function decodeMsg(msg) {
  try {
    return decodeURIComponent(escape(msg));
  } catch {
    return "could not decode msg in utf-8";
  }
}
const rotate_token = (headers) => {
  const token = TOKENS.shift();
  headers.Authorization = `token ${token}`;
  TOKENS.push(token);
}

async function fetchComments(commentsUrl) {

  const url = commentsUrl.slice(0, -9);
  const response = await axios.get(url, { headers });
  const data = response.data;
  const issueBody = data.body || null;
  const commentsCount = data.comments || 0;

  const totalPages = Math.ceil(commentsCount / 100);
  const allComments = {};
  // const totalPages=100


  for (let page = 1; page <= totalPages; page++) {
    console.log(`Fetching page ${page} ${commentsUrl}`);

    try {
      const response = await axios.get(commentsUrl, {
        headers: headers,
        params: { page: page, per_page: 100 }
      });
      if (response.status === 403) {
        throw new Error('403 Forbidden - Rate limit exceeded.');
      }
      const data = response.data;
      console.log(data);
      if (!data.length) break;
      data.forEach(comment => {
        const { id, body, user, created_at, reactions } = comment;
        allComments[id] = {
          message: decodeMsg(body),
          user: user.login,
          created_at,
          reaction: reactions
        };
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('403 Forbidden - Rate limit exceeded. Retrying with token rotation.');
        rotate_token(headers);
        const retryInterval = getRandomInterval(1, 5) * 60 * 1000; // Random interval between 1 to 5 minutes
        console.log(`Retrying after ${retryInterval / 60000} minutes.`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        page--;
        continue;
      } else {
        console.error('An error occurred:', error.message);
        break;
      }
    }
    // const response = await axios.get(commentsUrl, {
    //       headers: headers,
    //       params: { page: page, per_page: 100 }
    //     });
    // const data = response.data;
    // console.log(data);
    // if (!data.length) break;


  }

  return { issueBody, commentsCount, allComments };

}


export { fetchComments };
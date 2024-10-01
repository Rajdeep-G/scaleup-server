import axios from 'axios';
const TOKEN = "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";
const headers = { Authorization: `token ${TOKEN}` };
const CUTOFF_TIME = 60 * 60 * 24 * 30 * 120; // 120 months = 10 years data

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function decodeMsg(msg) {
  try {
    return decodeURIComponent(escape(msg));
  } catch {
    return "could not decode msg in utf-8";
  }
}

async function fetchComments(commentsUrl) {

  const url=commentsUrl.slice(0, -9);
  const response = await axios.get(url, { headers });
  const data = response.data;
  const issueBody = data.body || null;
  const commentsCount = data.comments || 0;

  const totalPages = Math.ceil(commentsCount / 100);
  const allComments = {};


    for (let page = 1; page <= totalPages; page++) {
      console.log(`Fetching page ${page}`);
      let response = await axios.get(commentsUrl, {
        headers,
        params: { page, per_page: 100 }
      });

      if (response.status === 403) {
        console.log("403 Forbidden - Rate limit exceeded. Retrying after 15 minutes.");
        await delay(15 * 60 * 1000);
        return fetchComments(commentsUrl);
      }

      const data = response.data;
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
    }

    return {issueBody, commentsCount , allComments};
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return { allComments: {}, issueBody, commentsCount };
}


export { fetchComments };
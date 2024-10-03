import gplay from "google-play-scraper";

const fetchPlayReviewsWithTimeout = async (opts, timeout = 5000) => {
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), timeout)
    );

    return Promise.race([
        gplay.reviews(opts),
        timeoutPromise
    ]);
};

const get_reviews = async(appId, prev_pagination_token = null, paginate = true, num_of_reviews = 150) => {
    const opts = {}
    opts.appId = appId;
    opts.nextPaginationToken = prev_pagination_token;
    if(paginate === false) { opts.num = num_of_reviews; } else { opts.paginate = paginate; }
    opts.throttle = 5;

    const reviews = await fetchPlayReviewsWithTimeout(opts, 5*1000*60); // Timeout for 5 minutes
    return reviews;
}

export default get_reviews;
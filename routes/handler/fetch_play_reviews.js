import gplay from "google-play-scraper";

const get_reviews = async(appId, prev_pagination_token = null, paginate = true, num_of_reviews = 150) => {
    const opts = {}
    opts.appId = appId;
    opts.nextPaginationToken = prev_pagination_token;
    if(paginate === false) { opts.num = num_of_reviews; } else { opts.paginate = paginate; }
    opts.throttle = 5;

    const reviews = await gplay.reviews(opts);
    return reviews;
}

export default get_reviews;
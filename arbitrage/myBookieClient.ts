import cheerio from 'cheerio';
import express from 'express';
import require from "request-promise"; // This is now depricated, maybe should switch to axios or something


export const myBookieProps = (req: express.Request, res: express.Response) => {
    let options = {
        method: 'GET',
        url: "https://www.mybookie.ag/sportsbook/mlb",
    };
    return (require(options)
        .then(response => {

            let props = getMyBookieProps(response);

            res.send(response);
            // return JSON.parse(response);
        }).catch(e => {
            console.log(e);
            res.status(400).send({ "message": "Unable to get sportsbook data from MyBookie" });
        }));
};

const getMyBookieProps = (response) => {
    const $ = cheerio.load(response);

    const links: any = $("a");
    links.each((i, link) => {
        let text = $(link).text();
        if (text.includes("Props >")) {
            console.log($(link).text() + ':\n  ' + $(link).attr('href'));
        }
    })
    // console.log(games);
    return links;
}


GET / -- OK

GET /register -- OK

POST /register/auth -- OK

GET /login -- OK

POST /login -- OK

GET /home -- OK

GET /home/admin -- OK

POST /comment -- OK

GET /home/:cmId -- OK

PUT /home/:cmId -- OK

DELETE /home/:cmId -- OK

PUT /home/admin/:cmId

PUT /home/nickname -- OK

POST /logout -- OK

以index.js為例，query內應只處理將query結果回傳，其餘在controller處理

home.controller.js可以用同一個model，但controller內容則有不同。

index.controller.js
```js
import commentModel from '../models/comment.model';

const commentGet = (req, res) => {
    if ( req.session.loggedin ) {
        res.redirect( url.format({
            pathname: "/home",
            query: req.query
        }))
    } else {
        commentModel.showComment().then((results) => {
            let cmPerPage = 5;
            let totalPage = Math.ceil( results.length / cmPerPage);
            if ( !req.query.page ) {
                res.redirect('/?page=1');
            } else {
                if ( totalPage !== 0 && (req.query.page <1 || req.query.page > totalPage)) {
                    res.direct('/?page=1');
                } else {
                    res.render('index', {
                        results: results,
                        currentPage: req.query.page,
                        cmPerPage: cmPerPage,
                        totalPage: totalPage
                    })
                }
            }
        })
    }
}
```
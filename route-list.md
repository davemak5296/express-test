GET /

GET /register

POST /register/auth

GET /login

POST /login/auth

GET /home

POST /comment

GET /home/:cmId

PUT /home/:cmId

DELETE /home/:cmId

PUT /home/admin/:cmId

PUT /home/nickname

POST /logout

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
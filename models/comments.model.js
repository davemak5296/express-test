let mysql = require('mysql');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

const showCm = () => {
    return new Promise ((resolve, reject) => {
        connection.query('SELECT C.id, C.username, U.nickname, C.content, C.created_at, C.is_hide FROM comments_pspt as C LEFT JOIN users_pspt as U ON C.username = U.username WHERE is_hide = 0 ORDER BY C.created_at DESC', (error, results) => {
            if ( error ) {
                return reject(error);
            } else {
                return resolve( results );
            }
        })
    })
}

const postCm = ( session ) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            {
                sql: 'INSERT INTO comments_pspt(username, content) VALUES(?,?)',
                values: [
                    session.username,
                    session.content
                ]
            },
            (error, results) => {
                console.log(session.username);
                console.log(session.content);
                if (error) {
                    return reject(error);
                } else {
                    return resolve();
                }
            }
        )
    })
}

module.exports = {
    showCm,
    postCm
}
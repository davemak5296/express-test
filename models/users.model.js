let mysql = require('mysql');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

const createUser = ( body, hash, salt ) => {
    return new Promise (( resolve, reject ) => {
        connection.query(
            {
                sql: 'INSERT INTO users_pspt(name, nickname, username, email, hashed_password, salt) VALUES(?,?,?,?,?,?)',
                values: [
                    body.name,
                    body.nickname,
                    body.username,
                    body.email,
                    hash,
                    salt
                ]
            }
        , (error,results) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        })
    })
}

const showUserForReg = () => {
    return new Promise (( resolve, reject ) => {
        connection.query('SELECT nickname,username FROM users_pspt', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve( results );
            }
        })
    })
}

const showUserForLogin = ( username ) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            {
                sql: 'SELECT * from users_pspt WHERE username =?',
                values: [
                    username
                ]
            },
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve( results );
                }
            }
        )
    })
}

const editNick = ( newNick, username) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            {
                sql:'UPDATE users_pspt SET nickname = ? WHERE username = ?',
                values:[ newNick, username ]
            },
            (error, results) => {
                if ( error ) {
                    console.log('error!!!!');
                    return reject(error);
                } else {
                    console.log('ok!!');
                    return resolve();
                }
            }
        )
    })
}

module.exports = {
    createUser,
    showUserForReg,
    showUserForLogin,
    editNick
};
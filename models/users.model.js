var mysql = require('mysql');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

const createUser = ( values, hash, salt ) => {
    return new Promise (( resolve, reject ) => {
        connection.query({
            sql: 'INSERT INTO users_pspt(name, nickname, username, email, hashed_password, salt) VALUES(?,?,?,?,?,?)',
            values: [
                values.name,
                values,nickname,
                values.username,
                values.email,
                hash,
                salt
            ]
        }, (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

const showUserForReg = () => {
    return new Promise (( resolve, reject ) => {
        connection.query('SELECT nickname,username FROM users_pspt', (error, results) => {
            if (error) {
                reject(error);
            } else if ( results ) {
                reject( results );
            } else {
                resolve();
            }
        })
    })
}

export default {
    createUser,
    showUserForReg
};
const mysql = require('mysql');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const superagent = require('superagent');
const async = require('async');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mycrwaler'
});

module.exports = {
    mysql,
    cheerio,
    express,
    app,
    superagent,
    async,
    pool
}
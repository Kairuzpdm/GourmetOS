const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`,
});

// Wrapper to make 'pg' compatible with 'mysql2' queries using '?'
const queryWrapper = {
    async query(sql, params) {
        let pgSql = sql;
        if (params && params.length > 0) {
            let index = 1;
            pgSql = pgSql.replace(/\?/g, () => `$${index++}`);
        }
        const result = await pool.query(pgSql, params);
        // mysql2 returns [rows, fields]
        return [result.rows, result.fields];
    },
    async getConnection() {
        const client = await pool.connect();
        return {
            async query(sql, params) {
                let pgSql = sql;
                if (params && params.length > 0) {
                    let index = 1;
                    pgSql = pgSql.replace(/\?/g, () => `$${index++}`);
                }
                const result = await client.query(pgSql, params);
                return [result.rows, result.fields];
            },
            async beginTransaction() {
                await client.query('BEGIN');
            },
            async commit() {
                await client.query('COMMIT');
            },
            async rollback() {
                await client.query('ROLLBACK');
            },
            release() {
                client.release();
            }
        };
    }
};

module.exports = queryWrapper;

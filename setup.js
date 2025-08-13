import readline from 'readline';
import fs from 'fs';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
// TODO: 여러가지 DB 지원 import mongoose from 'mongoose';
// TODO: 여러가지 DB 지원 import pg from 'pg';

const db = new Database('wikidata.db');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log('데이터베이스 초기화 진행중...');

db.prepare(`CREATE TABLE IF NOT EXISTS document (
	uuid TEXT NOT NULL,
    namespace TEXT NOT NULL,
	name TEXT NOT NULL,
	content TEXT NOT NULL,
    isfilelicense BOOLEAN NOT NULL,
    isfilecategory BOOLEAN NOT NULL,
    categories ARRAY NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

console.log('데이터베이스 초기화 완료!');

/* TODO: 여러가지 DB 지원

function selectDatabase() {
	rl.question('1: sqlite3\n2: mongodb\n3: postgresql\n사용할 DB를 선택하세요: ', (answer) => {
		if (answer === '1') {
			const db = new Database('wikidata.db');
			console.log('데이터베이스 초기화 진행중...');
			db.prepare(`CREATE TABLE IF NOT EXISTS docs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT UNIQUE,
				content TEXT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)`).run();
			console.log('데이터베이스 초기화 완료!');
			rl.close();
		} else {
			console.log('잘못된 입력값입니다. 다시 시도해주세요.');
			selectDatabase();
		}
	});
}

selectDatabase();*/
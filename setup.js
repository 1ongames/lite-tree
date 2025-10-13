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
	namespace TEXT NOT NULL,
	name TEXT NOT NULL,
	content TEXT NOT NULL,
	isfilelicense INTEGER NOT NULL DEFAULT 0,
	isfilecategory INTEGER NOT NULL DEFAULT 0,
	categories TEXT NOT NULL CHECK (json_valid(categories) AND json_type(categories, '$') = 'array'),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS users (
	uuid TEXT NOT NULL,
	name TEXT NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	isIP INTEGER NOT NULL DEFAULT 0,
	isAutoVerifiedUser INTEGER NOT NULL DEFAULT 0,
	perms TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(perms) AND json_type(perms, '$') = 'array'),
	password TEXT NOT NULL
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
	token TEXT PRIMARY KEY,
	user_name TEXT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	expires DATETIME
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS signup_tokens (
	token TEXT PRIMARY KEY,
	email TEXT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	expires DATETIME
)`).run();

console.log('데이터베이스 초기화 완료!');

rl.question('위키 소유자 닉네임 입력: ', (name) => {
	console.log(`위키 소유자 닉네임: ${name}`);
	// TODO: 추가
});
process.exit(0);
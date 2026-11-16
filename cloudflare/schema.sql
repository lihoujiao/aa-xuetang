-- AA 学堂账号、会话与短信频控。由 D1 绑定 DB 执行。

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  wechat_openid TEXT UNIQUE,
  wechat_unionid TEXT UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sms_sends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  ip TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sms_sends_phone ON sms_sends (phone, created_at);
CREATE INDEX IF NOT EXISTS idx_sms_sends_ip ON sms_sends (ip, created_at);
CREATE INDEX IF NOT EXISTS idx_sms_sends_created ON sms_sends (created_at);

CREATE TABLE IF NOT EXISTS sms_locks (
  phone TEXT PRIMARY KEY,
  fail_count INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mock_sms (
  phone TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS wechat_states (
  state TEXT PRIMARY KEY,
  purpose TEXT NOT NULL,
  user_id TEXT,
  expires_at INTEGER NOT NULL
);

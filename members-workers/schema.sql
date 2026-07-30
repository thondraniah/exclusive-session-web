-- Exclusive Session Members — D1 Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  password TEXT NOT NULL,
  nivel TEXT DEFAULT 'BRONCE',
  visitas INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  activo INTEGER DEFAULT 1,
  terms_accepted INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  saldo REAL DEFAULT 0,
  saldo_congelado REAL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  wallet_id TEXT NOT NULL,
  tipo TEXT NOT NULL,
  monto REAL NOT NULL,
  descripcion TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

CREATE TABLE IF NOT EXISTS referral_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS referral_users (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referred_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referred_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  servicio TEXT NOT NULL,
  artista TEXT NOT NULL,
  precio REAL DEFAULT 0,
  fecha TEXT NOT NULL,
  hora TEXT DEFAULT '',
  estado TEXT DEFAULT 'confirmada',
  pagada_con_saldo INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS streaks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  estrellas INTEGER DEFAULT 0,
  dias_racha INTEGER DEFAULT 0,
  streak_activa INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS gift_cards (
  id TEXT PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  monto REAL NOT NULL,
  saldo REAL NOT NULL,
  usado_por TEXT,
  activo INTEGER DEFAULT 1,
  expires_at TEXT,
  created_at TEXT NOT NULL
);

-- Index para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_fecha ON appointments(fecha);
CREATE INDEX IF NOT EXISTS idx_appointments_artista ON appointments(artista);
CREATE INDEX IF NOT EXISTS idx_referral_codes_codigo ON referral_codes(codigo);

CREATE TABLE subscribers (
  email TEXT PRIMARY KEY,
  signup_date DATE DEFAULT CURRENT_DATE,
  source TEXT,
  status TEXT DEFAULT 'pending',
  confirm_token TEXT,
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP
);
CREATE TABLE tracks (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, genre TEXT NOT NULL,
  bpm INTEGER, key TEXT, duration_seconds INTEGER, suno_id TEXT, suno_prompt TEXT,
  audio_master_url TEXT, audio_preview_url TEXT, cover_image_url TEXT, isrc TEXT, upc TEXT,
  released_at DATE, is_published BOOLEAN DEFAULT 0, is_licensable BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE mixes (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT,
  primary_genre TEXT, duration_seconds INTEGER, youtube_video_id TEXT, spotify_playlist_id TEXT,
  bandcamp_album_url TEXT, thumbnail_url TEXT, visual_loop_url TEXT, released_at DATE,
  is_published BOOLEAN DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE mix_tracks (
  mix_id TEXT NOT NULL, track_id TEXT NOT NULL, position INTEGER NOT NULL, start_seconds INTEGER NOT NULL,
  PRIMARY KEY (mix_id, track_id)
);
CREATE TABLE field_recordings (
  id TEXT PRIMARY KEY, location TEXT NOT NULL, description TEXT, captured_at TIMESTAMP,
  duration_seconds INTEGER, audio_url TEXT, gps_lat REAL, gps_lng REAL
);
CREATE TABLE mix_field_recordings (
  mix_id TEXT NOT NULL, recording_id TEXT NOT NULL, volume_db REAL DEFAULT -25,
  PRIMARY KEY (mix_id, recording_id)
);
CREATE TABLE distributions (
  id TEXT PRIMARY KEY, track_id TEXT NOT NULL, platform TEXT NOT NULL, external_id TEXT, url TEXT, live_since DATE
);
CREATE TABLE royalties (
  id TEXT PRIMARY KEY, track_id TEXT, platform TEXT NOT NULL, period_start DATE NOT NULL,
  period_end DATE NOT NULL, streams INTEGER, earnings_usd REAL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE licenses (
  id TEXT PRIMARY KEY, track_id TEXT NOT NULL, buyer_email TEXT NOT NULL, buyer_name TEXT,
  tier TEXT NOT NULL, price_usd REAL NOT NULL, stripe_payment_id TEXT, pdf_url TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE analytics_daily (
  date DATE NOT NULL, platform TEXT NOT NULL, metric TEXT NOT NULL, value REAL NOT NULL,
  PRIMARY KEY (date, platform, metric)
);
CREATE TABLE submissions (
  id TEXT PRIMARY KEY, track_id TEXT, mix_id TEXT, target_type TEXT NOT NULL, target_name TEXT NOT NULL,
  contact TEXT, submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, response_at TIMESTAMP,
  status TEXT DEFAULT 'pending', notes TEXT
);

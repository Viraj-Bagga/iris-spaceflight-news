import sqlite3

DB_NAME = "space_articles.db"

def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT UNIQUE,
                title TEXT,
                summary TEXT,
                published_at TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS guilds (
                guild_id TEXT PRIMARY KEY,
                channel_id TEXT NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS state (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        conn.commit()


def insert_article(url: str, title: str, summary: str = None, published_at: str = None):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR IGNORE INTO articles (url, title, summary, published_at)
            VALUES (?, ?, ?, ?)
        """, (url, title, summary, published_at))
        conn.commit()


def get_state(key: str, default=None):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM state WHERE key = ?", (key,))
        row = cursor.fetchone()
        return row[0] if row else default


def set_state(key: str, value: str):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO state (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """, (key, value))
        conn.commit()

def article_exists(url: str) -> bool:
    """Checks whether an article URL already exists in the database."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM articles WHERE url = ?", (url,))
        return cursor.fetchone() is not None


def update_article_summary(url: str, summary: str):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE articles SET summary = ? WHERE url = ?", (summary, url))
        conn.commit()
        print(f"  [db] matched {cursor.rowcount} row(s) for {url[:60]}")


def register_guild(guild_id: str, channel_id: str):
    """Records or updates which channel a server wants the feed in."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO guilds (guild_id, channel_id)
            VALUES (?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET channel_id = excluded.channel_id
        """, (guild_id, channel_id))
        conn.commit()

def remove_guild(guild_id: str):
    """Drops a server, e.g. when the bot gets kicked."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM guilds WHERE guild_id = ?", (guild_id,))
        conn.commit()

def get_all_channels() -> list[str]:
    """Every channel_id the feed should post to."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT channel_id FROM guilds")
        return [row[0] for row in cursor.fetchall()]


# Allows you to test table creation directly by running: python db.py
if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")


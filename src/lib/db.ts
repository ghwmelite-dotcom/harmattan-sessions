export async function upsertSubscriber(db: D1Database, email: string, source: string, token: string): Promise<void> {
  await db.prepare(
    `INSERT INTO subscribers (email, source, status, confirm_token)
     VALUES (?1, ?2, 'pending', ?3)
     ON CONFLICT(email) DO UPDATE SET source = excluded.source`
  ).bind(email, source, token).run();
}

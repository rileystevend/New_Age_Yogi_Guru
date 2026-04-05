import type { SQLiteDatabase } from 'expo-sqlite';
import { poses } from '@/data/poses';

/**
 * Database migration and initialization.
 *
 * Uses PRAGMA user_version for schema versioning.
 * Called by SQLiteProvider.onInit before the app renders.
 */

const DATABASE_VERSION = 2;

export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  let currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    console.log(`[DB] Database up to date (v${currentVersion})`);
    return;
  }

  console.log(
    `[DB] Migrating database from v${currentVersion} to v${DATABASE_VERSION}`
  );

  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS poses (
        id TEXT PRIMARY KEY NOT NULL,
        english_name TEXT NOT NULL,
        sanskrit_name TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        body_focus TEXT NOT NULL,
        description TEXT NOT NULL,
        teaching_cues TEXT NOT NULL,
        contraindications TEXT NOT NULL,
        image_url TEXT,
        tags TEXT NOT NULL,
        drishti TEXT NOT NULL,
        breath_cue TEXT NOT NULL,
        is_bilateral INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS pose_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pose_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (pose_id) REFERENCES poses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS sequences (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        style TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        focus_areas TEXT NOT NULL,
        intention TEXT NOT NULL,
        poses_json TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        tags TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS sequence_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sequence_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (sequence_id) REFERENCES sequences(id) ON DELETE CASCADE
      );
    `);

    // Seed poses
    const stmt = await db.prepareAsync(
      `INSERT OR IGNORE INTO poses (id, english_name, sanskrit_name, category, difficulty, body_focus, description, teaching_cues, contraindications, image_url, tags, drishti, breath_cue, is_bilateral)
       VALUES ($id, $english_name, $sanskrit_name, $category, $difficulty, $body_focus, $description, $teaching_cues, $contraindications, $image_url, $tags, $drishti, $breath_cue, $is_bilateral)`
    );

    try {
      for (const pose of poses) {
        await stmt.executeAsync({
          $id: pose.id,
          $english_name: pose.englishName,
          $sanskrit_name: pose.sanskritName,
          $category: pose.category,
          $difficulty: pose.difficulty,
          $body_focus: JSON.stringify(pose.bodyFocus),
          $description: pose.description,
          $teaching_cues: JSON.stringify(pose.teachingCues),
          $contraindications: JSON.stringify(pose.contraindications),
          $image_url: pose.imageUrl,
          $tags: JSON.stringify(pose.tags),
          $drishti: pose.drishti,
          $breath_cue: pose.breathCue,
          $is_bilateral: pose.isBilateral ? 1 : 0,
        });
      }
    } finally {
      await stmt.finalizeAsync();
    }

    console.log(`[DB] Seeded ${poses.length} poses`);
    currentVersion = 1;
  }

  if (currentVersion === 1) {
    // v2: Expanded pose library from 34 to 101 poses
    // Delete old seed data and re-insert all poses
    await db.execAsync('DELETE FROM poses');

    const stmt = await db.prepareAsync(
      `INSERT OR IGNORE INTO poses (id, english_name, sanskrit_name, category, difficulty, body_focus, description, teaching_cues, contraindications, image_url, tags, drishti, breath_cue, is_bilateral)
       VALUES ($id, $english_name, $sanskrit_name, $category, $difficulty, $body_focus, $description, $teaching_cues, $contraindications, $image_url, $tags, $drishti, $breath_cue, $is_bilateral)`
    );

    try {
      for (const pose of poses) {
        await stmt.executeAsync({
          $id: pose.id,
          $english_name: pose.englishName,
          $sanskrit_name: pose.sanskritName,
          $category: pose.category,
          $difficulty: pose.difficulty,
          $body_focus: JSON.stringify(pose.bodyFocus),
          $description: pose.description,
          $teaching_cues: JSON.stringify(pose.teachingCues),
          $contraindications: JSON.stringify(pose.contraindications),
          $image_url: pose.imageUrl,
          $tags: JSON.stringify(pose.tags),
          $drishti: pose.drishti,
          $breath_cue: pose.breathCue,
          $is_bilateral: pose.isBilateral ? 1 : 0,
        });
      }
    } finally {
      await stmt.finalizeAsync();
    }

    console.log(`[DB] Re-seeded ${poses.length} poses (v1 → v2)`);
    currentVersion = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  console.log(`[DB] Migration complete (v${DATABASE_VERSION})`);
}

export const DATABASE_NAME = 'yogi-guru.db';

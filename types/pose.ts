/**
 * Pose data model for New Age Yogi Guru
 *
 * Covers the full taxonomy needed for browsing, sequencing, and teaching:
 * category, difficulty, body focus, contraindications, teaching cues, and more.
 */

export type PoseCategory =
  | 'standing'
  | 'seated'
  | 'supine'
  | 'prone'
  | 'inversion'
  | 'balance'
  | 'twist'
  | 'backbend'
  | 'forward-fold'
  | 'arm-balance'
  | 'restorative';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type BodyFocus =
  | 'hips'
  | 'hamstrings'
  | 'shoulders'
  | 'spine'
  | 'core'
  | 'chest'
  | 'legs'
  | 'arms'
  | 'full-body'
  | 'neck'
  | 'glutes'
  | 'ankles'
  | 'wrists';

export type Side = 'left' | 'right' | 'both' | 'none';

export interface Pose {
  /** Unique identifier, e.g. "mountain-pose" */
  id: string;
  /** English name, e.g. "Mountain Pose" */
  englishName: string;
  /** Sanskrit name, e.g. "Tadasana" */
  sanskritName: string;
  /** Primary category */
  category: PoseCategory;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Body areas targeted */
  bodyFocus: BodyFocus[];
  /** Short description of the pose */
  description: string;
  /** Verbal cues a teacher would say to students */
  teachingCues: string[];
  /** Conditions where this pose should be avoided or modified */
  contraindications: string[];
  /** Image reference (asset path or URL). Null until images are sourced. */
  imageUrl: string | null;
  /** Searchable tags for discovery */
  tags: string[];
  /** Gaze/focus point, e.g. "tip of nose", "upward", "forward" */
  drishti: string;
  /** Breath instruction, e.g. "Inhale to lift, exhale to fold" */
  breathCue: string;
  /** Whether the pose is done on one side */
  isBilateral: boolean;
}

/**
 * A pose placed within a sequence/class, with additional context
 * for how it's used in that specific flow.
 */
export interface SequencePose {
  /** Reference to the base pose */
  poseId: string;
  /** How long to hold (seconds) */
  holdDuration: number;
  /** Which side, if bilateral */
  side: Side;
  /** Teacher's personal notes for this pose in this sequence */
  notes: string;
  /** Override cues for this specific context */
  customCues?: string[];
  /** Transition note to the next pose */
  transitionNote?: string;
}

/**
 * A complete yoga class/sequence
 */
export interface YogaSequence {
  /** Unique identifier */
  id: string;
  /** Class name, e.g. "Morning Vinyasa Flow" */
  name: string;
  /** Style: vinyasa, hatha, yin, restorative, power, etc. */
  style: string;
  /** Target duration in minutes */
  durationMinutes: number;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Primary focus areas */
  focusAreas: BodyFocus[];
  /** Intended outcome, e.g. "hip opening", "stress relief" */
  intention: string;
  /** Ordered list of poses in the sequence */
  poses: SequencePose[];
  /** Class-level notes */
  notes: string;
  /** Tags for organizing the portfolio */
  tags: string[];
  /** When this sequence was created */
  createdAt: string;
  /** When this sequence was last modified */
  updatedAt: string;
}

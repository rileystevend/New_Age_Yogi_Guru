import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface PoseIllustrationProps {
  poseId: string;
  size?: number;
  color?: string;
}

/**
 * Renders a minimalist silhouette illustration for a yoga pose.
 * Each pose is a hand-crafted SVG path in a 100x100 viewBox.
 */
export function PoseIllustration({ poseId, size = 120, color }: PoseIllustrationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const strokeColor = color ?? colors.tint;
  const poseData = posePaths[poseId];

  if (!poseData) {
    // Fallback: generic meditation silhouette
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx="50" cy="22" r="8" fill={strokeColor} opacity={0.7} />
          <Path
            d="M50 30 L50 55 M35 42 L50 38 L65 42 M38 75 L50 55 L62 75"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.7}
          />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G>
          <Circle cx={poseData.head[0]} cy={poseData.head[1]} r={poseData.headR ?? 6} fill={strokeColor} />
          <Path
            d={poseData.body}
            stroke={strokeColor}
            strokeWidth={poseData.strokeWidth ?? 3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface PosePath {
  head: [number, number];
  headR?: number;
  body: string;
  strokeWidth?: number;
}

/**
 * SVG path data for each pose.
 * Coordinate system: 100x100 viewBox, origin top-left.
 * Each pose: head circle + body path (spine, arms, legs).
 */
const posePaths: Record<string, PosePath> = {
  // ── Standing ──────────────────────────────────────────────
  'mountain-pose': {
    head: [50, 18],
    body: 'M50 24 L50 55 M38 36 L50 32 L62 36 M40 85 L50 55 L60 85',
  },
  'warrior-i': {
    head: [50, 14],
    body: 'M50 20 L50 50 M35 10 L50 20 L65 10 M30 80 L50 50 L65 85',
  },
  'warrior-ii': {
    head: [50, 22],
    body: 'M50 28 L50 52 M20 40 L50 35 L80 40 M28 80 L50 52 L72 80',
  },
  'warrior-iii': {
    head: [30, 38],
    body: 'M30 44 L50 44 M25 38 L30 44 L30 30 M50 44 L30 70 M50 44 L75 44',
  },
  'tree-pose': {
    head: [50, 16],
    body: 'M50 22 L50 55 M40 12 L50 22 L60 12 M50 55 L45 85 M50 55 L60 65 L55 55',
  },
  'chair-pose': {
    head: [50, 18],
    body: 'M50 24 L50 50 M38 14 L50 24 L62 14 M38 80 L45 60 L50 50 L55 60 L62 80',
  },
  'standing-forward-fold': {
    head: [50, 62],
    body: 'M50 56 L50 40 M40 62 L50 56 L60 62 M38 85 L44 55 L50 40 L56 55 L62 85',
  },
  'half-forward-fold': {
    head: [38, 42],
    body: 'M38 48 L50 48 L50 40 M28 42 L38 48 M50 40 L45 85 M50 40 L55 85',
  },
  'triangle-pose': {
    head: [30, 55],
    body: 'M30 49 L45 40 L50 50 M30 49 L22 68 M20 40 L45 40 L75 30 M50 50 L45 85 M50 50 L60 85',
  },
  'extended-side-angle': {
    head: [25, 60],
    body: 'M25 54 L40 45 L50 50 M25 54 L18 72 M30 30 L40 45 L80 25 M50 50 L35 80 M50 50 L65 82',
  },
  'revolved-triangle': {
    head: [62, 52],
    body: 'M62 46 L50 42 L50 50 M68 38 L50 42 L30 50 M50 50 L45 85 M50 50 L55 85',
  },
  'revolved-side-angle': {
    head: [65, 48],
    body: 'M65 42 L50 42 L48 52 M70 32 L50 42 L28 38 M48 52 L35 80 M48 52 L62 82',
  },
  'half-moon-pose': {
    head: [35, 35],
    body: 'M35 41 L45 42 L50 50 M25 25 L35 41 L40 28 M50 50 L45 85 M50 50 L75 42',
  },
  'revolved-half-moon': {
    head: [60, 38],
    body: 'M60 44 L50 44 L48 52 M70 30 L60 44 L55 30 M48 52 L45 85 M48 52 L25 48',
  },
  'pyramid-pose': {
    head: [45, 50],
    body: 'M45 44 L48 38 L50 45 M38 50 L45 44 M50 45 L40 85 M50 45 L60 80',
  },
  'wide-legged-forward-fold': {
    head: [50, 58],
    body: 'M50 52 L50 42 M40 58 L50 52 L60 58 M25 85 L50 42 L75 85',
  },
  'crescent-lunge': {
    head: [50, 14],
    body: 'M50 20 L50 50 M38 10 L50 20 L62 10 M32 78 L42 60 L50 50 L60 65 L65 85',
  },
  'high-lunge': {
    head: [50, 16],
    body: 'M50 22 L50 50 M38 12 L50 22 L62 12 M30 75 L42 58 L50 50 L60 65 L70 85',
  },
  'low-lunge': {
    head: [50, 22],
    body: 'M50 28 L50 52 M38 18 L50 28 L62 18 M30 75 L42 60 L50 52 L62 70 L68 85',
  },
  'reverse-warrior': {
    head: [55, 15],
    body: 'M55 21 L50 40 L48 52 M68 18 L55 21 L48 30 M28 80 L48 52 L70 80',
  },
  'eagle-pose': {
    head: [50, 16],
    body: 'M50 22 L50 55 M42 30 L48 22 L50 32 L52 22 L58 30 M48 85 L50 55 L52 85',
  },
  'dancer-pose': {
    head: [40, 18],
    body: 'M40 24 L45 50 M30 15 L40 24 L42 10 M45 50 L42 85 M45 50 L60 38 L70 50',
  },
  'standing-hand-to-big-toe': {
    head: [45, 16],
    body: 'M45 22 L48 50 M38 22 L45 22 L55 22 M48 50 L45 85 M48 50 L70 40 L78 38',
  },
  'standing-splits': {
    head: [45, 55],
    body: 'M45 49 L48 42 M38 55 L45 49 M48 42 L45 85 M48 42 L55 15',
  },
  'star-pose': {
    head: [50, 18],
    body: 'M50 24 L50 52 M25 35 L50 32 L75 35 M25 82 L50 52 L75 82',
  },
  'goddess-pose': {
    head: [50, 18],
    body: 'M50 24 L50 50 M30 30 L50 30 L70 30 M28 78 L40 60 L50 50 L60 60 L72 78',
  },
  'gorilla-pose': {
    head: [50, 60],
    body: 'M50 54 L50 42 M42 68 L50 54 L58 68 M40 85 L46 55 L50 42 L54 55 L60 85',
  },
  // ── Seated ────────────────────────────────────────────────
  'easy-pose': {
    head: [50, 22],
    body: 'M50 28 L50 55 M38 36 L50 32 L62 36 M30 72 L40 65 L50 55 L60 65 L70 72',
  },
  'staff-pose': {
    head: [50, 25],
    body: 'M50 31 L50 58 M38 38 L50 34 L62 38 M50 58 L40 62 L30 62 M50 58 L60 62 L70 62',
  },
  'seated-forward-fold': {
    head: [55, 52],
    body: 'M55 46 L52 42 L50 50 M58 42 L55 46 M50 50 L40 55 L30 55 M50 50 L60 55 L70 55',
  },
  'seated-twist': {
    head: [55, 25],
    body: 'M55 31 L50 55 M62 30 L55 31 L48 38 M30 70 L40 62 L50 55 L60 65 L70 70',
  },
  'head-to-knee': {
    head: [40, 48],
    body: 'M40 42 L45 40 L50 50 M34 42 L40 42 M50 50 L35 58 L28 58 M50 50 L65 55 L75 50',
  },
  'bound-angle': {
    head: [50, 22],
    body: 'M50 28 L50 55 M38 36 L50 32 L62 36 M50 55 L35 68 L40 78 M50 55 L65 68 L60 78',
  },
  'hero-pose': {
    head: [50, 20],
    body: 'M50 26 L50 55 M38 34 L50 30 L62 34 M42 78 L45 65 L50 55 L55 65 L58 78',
  },
  'cow-face-pose': {
    head: [50, 20],
    body: 'M50 26 L50 55 M42 20 L50 26 L55 40 L50 50 M50 30 L58 20 M35 70 L50 55 L65 70',
  },
  'fire-log-pose': {
    head: [50, 22],
    body: 'M50 28 L50 55 M38 36 L50 32 L62 36 M30 68 L40 65 L60 65 M32 78 L42 75 L58 75',
  },
  'lotus-pose': {
    head: [50, 18],
    body: 'M50 24 L50 52 M38 32 L50 28 L62 32 M32 68 L42 58 L50 52 L58 58 L68 68',
  },
  'garland-pose': {
    head: [50, 22],
    body: 'M50 28 L50 52 M40 42 L50 38 L60 42 M28 78 L40 60 L50 52 L60 60 L72 78',
  },
  'thunderbolt-pose': {
    head: [50, 20],
    body: 'M50 26 L50 55 M38 34 L50 30 L62 34 M42 80 L46 65 L50 55 L54 65 L58 80',
  },
  'little-thunderbolt': {
    head: [50, 18],
    body: 'M50 24 L52 55 M40 14 L50 24 L60 14 M44 80 L48 65 L52 55 L56 65 L58 80',
  },
  'half-pigeon-supine': {
    head: [25, 42],
    body: 'M25 36 L30 38 L50 42 M25 36 L20 38 M50 42 L35 55 L30 52 M50 42 L65 50 L70 42',
  },
  'legs-wide-seated-fold': {
    head: [50, 55],
    body: 'M50 49 L50 42 M42 55 L50 49 L58 55 M22 65 L35 55 L50 42 L65 55 L78 65',
  },
  // ── Supine ────────────────────────────────────────────────
  'corpse-pose': {
    head: [18, 50],
    body: 'M24 50 L75 50 M24 50 L18 35 M24 50 L18 65 M75 50 L85 35 M75 50 L85 65',
  },
  'happy-baby': {
    head: [20, 50],
    body: 'M26 50 L50 50 M26 50 L18 40 M26 50 L18 60 M50 50 L60 30 L68 25 M50 50 L60 70 L68 75',
  },
  'supine-spinal-twist': {
    head: [25, 35],
    body: 'M25 41 L50 50 M18 30 L25 41 L15 50 M50 50 L70 60 M50 50 L70 40',
  },
  'reclined-butterfly': {
    head: [18, 50],
    body: 'M24 50 L55 50 M24 50 L15 38 M24 50 L15 62 M55 50 L65 35 L72 40 M55 50 L65 65 L72 60',
  },
  'reclined-hand-to-big-toe': {
    head: [18, 50],
    body: 'M24 50 L55 50 M24 50 L15 40 M24 50 L15 60 M55 50 L70 55 M55 50 L65 20 L60 15',
  },
  'wind-removing-pose': {
    head: [22, 50],
    body: 'M28 50 L50 50 M28 50 L18 40 M28 50 L18 60 M50 50 L58 35 L52 30 M50 50 L58 65 L52 70',
  },
  'constructive-rest': {
    head: [18, 50],
    body: 'M24 50 L55 50 M24 50 L15 40 M24 50 L15 60 M55 50 L65 40 L60 50 M55 50 L65 60 L60 50',
  },
  'legs-up-wall': {
    head: [50, 82],
    body: 'M50 76 L50 55 M40 80 L50 76 L60 80 M50 55 L48 15 M50 55 L52 15',
  },
  'waterfall-pose': {
    head: [50, 82],
    body: 'M50 76 L50 55 M40 80 L50 76 L60 80 M50 55 L45 20 M50 55 L55 20',
  },
  'reclining-hero': {
    head: [15, 50],
    body: 'M21 50 L55 50 M15 42 L21 50 L15 58 M55 50 L65 58 L60 65 M55 50 L65 42 L60 35',
  },
  'banana-pose': {
    head: [18, 40],
    body: 'M24 42 L50 48 L78 50 M18 34 L24 42 L14 48 M78 50 L88 44 M78 50 L88 56',
  },
  // ── Prone ─────────────────────────────────────────────────
  'cobra-pose': {
    head: [35, 30],
    body: 'M35 36 L42 42 L55 48 L75 50 M30 25 L35 36 L40 25 M75 50 L85 55 M75 50 L85 45',
  },
  'upward-facing-dog': {
    head: [30, 25],
    body: 'M30 31 L40 38 L55 42 L75 42 M22 22 L30 31 L22 35 M75 42 L82 52 M65 42 L60 52',
  },
  'locust-pose': {
    head: [25, 40],
    body: 'M31 42 L50 48 L72 42 M25 35 L31 42 M72 42 L82 38 M72 42 L82 46',
  },
  'bow-pose': {
    head: [30, 28],
    body: 'M30 34 L42 42 L55 48 M25 22 L30 34 M55 48 L65 42 L72 30 L78 28 M55 48 L68 55',
  },
  'superman-pose': {
    head: [22, 40],
    body: 'M28 42 L50 48 L72 42 M22 35 L15 32 M28 42 L15 45 M72 42 L82 35 M72 42 L82 48',
  },
  'sphinx-pose': {
    head: [30, 30],
    body: 'M30 36 L45 42 L60 48 L78 50 M24 28 L30 36 L36 28 M60 48 L55 55 M78 50 L85 55 M78 50 L85 45',
  },
  'crocodile-pose': {
    head: [22, 48],
    body: 'M28 50 L55 50 L78 50 M22 42 L15 38 M22 42 L28 50 M78 50 L85 55 M78 50 L85 45',
  },
  'frog-pose': {
    head: [50, 35],
    body: 'M50 41 L50 55 M42 32 L50 41 L58 32 M28 65 L40 58 L50 55 L60 58 L72 65',
  },
  'extended-puppy-pose': {
    head: [30, 42],
    body: 'M30 48 L45 52 L55 60 M22 42 L30 48 L22 52 M55 60 L50 75 M55 60 L60 75',
  },
  // ── Inversions ────────────────────────────────────────────
  'downward-dog': {
    head: [35, 60],
    body: 'M35 54 L50 38 M28 55 L35 54 L28 62 M50 38 L40 82 M50 38 L60 82',
  },
  'headstand': {
    head: [50, 82],
    headR: 7,
    body: 'M50 75 L50 35 M40 55 L50 45 L60 55 M48 15 L50 35 L52 15',
  },
  'shoulder-stand': {
    head: [50, 85],
    headR: 7,
    body: 'M50 78 L50 35 M42 72 L50 68 L58 72 M48 15 L50 35 L52 15',
  },
  'forearm-balance': {
    head: [50, 78],
    body: 'M50 72 L50 40 M42 82 L50 78 L58 82 M48 15 L50 40 L52 15',
  },
  'handstand': {
    head: [50, 75],
    body: 'M50 69 L50 35 M42 82 L50 75 L58 82 M48 15 L50 35 L52 15',
  },
  'dolphin-pose': {
    head: [35, 58],
    body: 'M35 52 L48 40 M28 62 L35 58 L28 68 M48 40 L40 80 M48 40 L58 80',
  },
  'plow-pose': {
    head: [50, 80],
    headR: 7,
    body: 'M50 73 L50 55 L40 48 L25 50 M42 68 L50 62 L58 68',
  },
  'supported-shoulderstand': {
    head: [50, 85],
    headR: 7,
    body: 'M50 78 L50 35 M42 72 L50 60 M58 72 L50 60 M48 15 L50 35 L52 15',
  },
  // ── Balance ───────────────────────────────────────────────
  'boat-pose': {
    head: [38, 25],
    body: 'M38 31 L50 55 M32 22 L38 31 L44 22 M50 55 L38 72 L32 78 M50 55 L62 72 L68 78',
  },
  'revolved-chair': {
    head: [52, 18],
    body: 'M52 24 L50 50 M60 22 L52 24 L42 28 M38 80 L45 60 L50 50 L55 60 L62 80',
  },
  'side-plank': {
    head: [30, 25],
    body: 'M30 31 L50 50 M22 20 L30 31 L20 35 M50 50 L70 75 M50 50 L35 60',
  },
  // ── Twists ────────────────────────────────────────────────
  'bharadvajas-twist': {
    head: [58, 25],
    body: 'M58 31 L50 55 M65 22 L58 31 L50 30 M35 70 L45 62 L50 55 L58 65 L65 72',
  },
  'thread-the-needle': {
    head: [40, 48],
    body: 'M40 54 L50 55 L55 50 M32 48 L40 54 L48 42 M55 50 L52 70 M55 50 L62 70',
  },
  // ── Backbends ─────────────────────────────────────────────
  'bridge-pose': {
    head: [22, 60],
    headR: 5,
    body: 'M22 54 L30 42 L50 38 L65 42 M65 42 L62 58 M65 42 L68 58',
  },
  'wheel-pose': {
    head: [25, 55],
    body: 'M25 49 L30 40 L50 32 L70 40 L75 55 M75 55 L70 70 M75 55 L80 70',
  },
  'camel-pose': {
    head: [50, 25],
    body: 'M50 31 L48 50 M58 22 L50 31 L42 22 M48 50 L40 65 L38 80 M48 50 L56 65 L58 80',
  },
  'fish-pose': {
    head: [25, 42],
    headR: 5,
    body: 'M25 36 L35 32 L55 35 L75 40 M35 32 L30 45 M75 40 L82 45 M75 40 L82 35',
  },
  'wild-thing': {
    head: [30, 30],
    body: 'M30 36 L45 42 L55 50 M22 25 L30 36 L25 40 M55 50 L65 72 M55 50 L40 65',
  },
  'king-pigeon': {
    head: [55, 20],
    body: 'M55 26 L50 45 M60 15 L55 26 L48 20 M50 45 L35 60 L30 58 M50 45 L62 60 L65 55 L68 30',
  },
  'supported-fish': {
    head: [20, 48],
    headR: 5,
    body: 'M20 42 L30 36 L50 35 L72 38 M50 35 L45 48 M72 38 L80 42 M72 38 L80 34',
  },
  'upward-plank': {
    head: [25, 30],
    body: 'M25 36 L50 45 L72 55 M20 25 L25 36 L20 40 M72 55 L68 72 M72 55 L78 72',
  },
  // ── Forward Folds ─────────────────────────────────────────
  'ragdoll': {
    head: [50, 65],
    body: 'M50 59 L50 42 M42 72 L50 65 L58 72 M42 85 L48 55 L50 42 L52 55 L58 85',
  },
  'half-splits': {
    head: [42, 40],
    body: 'M42 46 L48 48 L50 52 M36 40 L42 46 M50 52 L38 68 L35 72 M50 52 L65 58 L72 55',
  },
  // ── Arm Balances ──────────────────────────────────────────
  'crow-pose': {
    head: [40, 28],
    body: 'M40 34 L50 42 M34 24 L40 34 L46 24 M50 42 L42 58 M50 42 L58 58 M50 42 L62 30 L68 25',
  },
  'crane-pose': {
    head: [38, 25],
    body: 'M38 31 L50 40 M32 20 L38 31 L44 20 M50 40 L42 58 M50 40 L58 58 M50 40 L65 25',
  },
  'eight-angle-pose': {
    head: [35, 30],
    body: 'M35 36 L48 42 M28 26 L35 36 L42 26 M48 42 L40 58 M48 42 L58 42 L68 50 L72 60',
  },
  'firefly-pose': {
    head: [50, 25],
    body: 'M50 31 L50 45 M42 22 L50 31 L58 22 M50 45 L38 52 M50 45 L62 52 M25 55 L38 52 M62 52 L75 55',
  },
  'flying-pigeon': {
    head: [38, 28],
    body: 'M38 34 L50 42 M32 24 L38 34 L44 24 M50 42 L42 58 M50 42 L58 58 M50 42 L65 35 L72 42',
  },
  'peacock-pose': {
    head: [30, 42],
    body: 'M30 48 L50 50 L70 48 M24 42 L30 48 L24 52 M70 48 L78 42 M70 48 L78 55',
  },
  'compass-pose': {
    head: [60, 18],
    body: 'M60 24 L50 50 M65 22 L60 24 L68 15 M50 50 L35 62 L30 62 M50 50 L60 65 L65 72',
  },
  // ── Restorative ───────────────────────────────────────────
  'childs-pose': {
    head: [35, 55],
    body: 'M35 49 L50 48 L60 55 M28 55 L35 49 L28 60 M60 55 L55 72 M60 55 L65 72',
  },
  // ── Core / Transitions ────────────────────────────────────
  'plank-pose': {
    head: [22, 42],
    body: 'M22 48 L50 50 L78 52 M16 38 L22 48 L16 50 M78 52 L82 65 M70 52 L68 65',
  },
  'chaturanga': {
    head: [22, 48],
    body: 'M22 54 L50 55 L78 56 M16 44 L22 54 L16 54 M78 56 L82 68 M70 56 L68 68',
  },
  'tabletop': {
    head: [25, 38],
    body: 'M25 44 L45 45 L50 45 M20 34 L25 44 L20 44 M50 45 L48 65 M50 45 L55 65',
  },
  'cat-pose': {
    head: [25, 42],
    body: 'M25 48 L40 38 L55 42 L68 45 M20 38 L25 48 M68 45 L65 62 M68 45 L72 62',
  },
  'cow-pose': {
    head: [25, 38],
    body: 'M25 44 L40 48 L55 45 L68 42 M20 34 L25 44 M68 42 L65 58 M68 42 L72 58',
  },
  'gate-pose': {
    head: [40, 20],
    body: 'M40 26 L42 52 M32 18 L40 26 L55 15 L70 20 M42 52 L35 72 M42 52 L55 72',
  },
  'pigeon-pose': {
    head: [45, 28],
    body: 'M45 34 L48 50 M38 24 L45 34 L52 24 M48 50 L35 62 L30 60 M48 50 L65 58 L75 55',
  },
  'lizard-pose': {
    head: [30, 42],
    body: 'M30 48 L42 52 L50 55 M24 38 L30 48 L24 48 M50 55 L35 72 M50 55 L68 65 L78 62',
  },
};

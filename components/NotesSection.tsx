import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import type { Note } from '@/db';
import {
  getNotesForPose,
  addNoteForPose,
  getNotesForSequence,
  addNoteForSequence,
  updateNote,
  deleteNote,
} from '@/db';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface NotesSectionProps {
  entityId: string;
  entityType: 'pose' | 'sequence';
}

export function NotesSection({ entityId, entityType }: NotesSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const db = useSQLiteContext();

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const table = entityType === 'pose' ? 'pose_notes' : 'sequence_notes';

  const loadNotes = useCallback(async () => {
    const result =
      entityType === 'pose'
        ? await getNotesForPose(db, entityId)
        : await getNotesForSequence(db, entityId);
    setNotes(result);
  }, [db, entityId, entityType]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleAdd = useCallback(async () => {
    const text = newNote.trim();
    if (!text) return;

    if (entityType === 'pose') {
      await addNoteForPose(db, entityId, text);
    } else {
      await addNoteForSequence(db, entityId, text);
    }
    setNewNote('');
    loadNotes();
  }, [db, entityId, entityType, newNote, loadNotes]);

  const handleEdit = useCallback(
    async (noteId: number) => {
      const text = editingText.trim();
      if (!text) return;
      await updateNote(db, table, noteId, text);
      setEditingId(null);
      setEditingText('');
      loadNotes();
    },
    [db, table, editingText, loadNotes]
  );

  const handleDelete = useCallback(
    (noteId: number) => {
      Alert.alert('Delete Note', 'Delete this note?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(db, table, noteId);
            loadNotes();
          },
        },
      ]);
    },
    [db, table, loadNotes]
  );

  const startEditing = useCallback((note: Note) => {
    setEditingId(note.id);
    setEditingText(note.content);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
      <Text style={[styles.title, { color: colors.gold }]}>📝 Notes</Text>

      {/* Existing notes */}
      {notes.map((note) => (
        <View
          key={note.id}
          style={[styles.noteCard, { borderColor: colors.border }]}>
          {editingId === note.id ? (
            <View>
              <TextInput
                style={[
                  styles.editInput,
                  { color: colors.text, borderColor: colors.border },
                ]}
                value={editingText}
                onChangeText={setEditingText}
                multiline
                autoFocus
              />
              <View style={styles.editActions}>
                <Pressable onPress={() => handleEdit(note.id)}>
                  <Text style={[styles.actionText, { color: colors.sage }]}>
                    Save
                  </Text>
                </Pressable>
                <Pressable onPress={() => setEditingId(null)}>
                  <Text style={[styles.actionText, { color: colors.warmGray }]}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              <Text style={[styles.noteText, { color: colors.text }]}>
                {note.content}
              </Text>
              <View style={styles.noteActions}>
                <Text style={[styles.noteDate, { color: colors.warmGray }]}>
                  {new Date(note.updatedAt).toLocaleDateString()}
                </Text>
                <View style={styles.noteActionButtons}>
                  <Pressable onPress={() => startEditing(note)}>
                    <Text style={[styles.actionText, { color: colors.tint }]}>
                      Edit
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => handleDelete(note.id)}>
                    <Text style={[styles.actionText, { color: colors.error }]}>
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      ))}

      {/* Add note input */}
      <View style={styles.addContainer}>
        <TextInput
          style={[
            styles.addInput,
            {
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
          value={newNote}
          onChangeText={setNewNote}
          placeholder="Add a note..."
          placeholderTextColor={colors.warmGray}
          multiline
          numberOfLines={2}
        />
        {newNote.trim().length > 0 && (
          <Pressable
            onPress={handleAdd}
            style={[styles.addButton, { backgroundColor: colors.tint }]}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        )}
      </View>

      {notes.length === 0 && !newNote && (
        <Text style={[styles.emptyHint, { color: colors.warmGray }]}>
          No notes yet — add your observations, cues, or reminders
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  noteCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  noteDate: {
    fontSize: 11,
  },
  noteActionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  addContainer: {
    marginTop: 10,
  },
  addInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  addButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});

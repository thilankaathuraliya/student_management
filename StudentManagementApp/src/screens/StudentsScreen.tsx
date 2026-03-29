import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ApiError } from "../api/client";
import {
  createStudent,
  getStudents,
} from "../api/endpoints";
import type { StudentDto } from "../api/types";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 15;

export default function StudentsScreen() {
  const { token, logout } = useAuth();
  const [items, setItems] = useState<StudentDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      if (!token) return;
      try {
        setError(null);
        const res = await getStudents(token, nextPage, PAGE_SIZE);
        setTotalPages(res.totalPages);
        setPage(res.page);
        setItems((prev) =>
          append ? [...prev, ...res.items] : [...res.items]
        );
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) await logout();
        setError(e instanceof Error ? e.message : "Failed to load students");
      }
    },
    [token, logout]
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        await load(1, false);
        if (!cancelled) setLoading(false);
      })();
      return () => {
        cancelled = true;
      };
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load(1, false);
    setRefreshing(false);
  }

  async function onLoadMore() {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    await load(page + 1, true);
    setLoadingMore(false);
  }

  async function onSaveStudent() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await createStudent(token, name.trim(), subjectName.trim(), teacherName.trim());
      setModalOpen(false);
      setName("");
      setSubjectName("");
      setTeacherName("");
      await load(1, false);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) await logout();
      setError(e instanceof Error ? e.message : "Could not register student");
    } finally {
      setSaving(false);
    }
  }

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => setModalOpen(true)}
      >
        <Text style={styles.primaryBtnText}>Register student</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>Subject: {item.subjectName}</Text>
            <Text style={styles.cardMeta}>Teacher: {item.teacherName}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No students yet.</Text>
        }
      />

      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Register student</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Student name"
            />
            <Text style={styles.label}>Subject name</Text>
            <TextInput
              style={styles.input}
              value={subjectName}
              onChangeText={setSubjectName}
              placeholder="Must match an existing subject"
            />
            <Text style={styles.label}>Teacher name</Text>
            <TextInput
              style={styles.input}
              value={teacherName}
              onChangeText={setTeacherName}
              placeholder="Must match an existing teacher"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setModalOpen(false)}
                disabled={saving}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, styles.modalSave]}
                onPress={onSaveStudent}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  modalSave: { flex: 1, marginBottom: 0, marginLeft: 10 },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { color: "#dc2626", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#0f172a" },
  cardMeta: { fontSize: 14, color: "#64748b", marginTop: 4 },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 24 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0f172a",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  modalActions: { flexDirection: "row", marginTop: 8 },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  secondaryBtnText: { color: "#334155", fontWeight: "600" },
});

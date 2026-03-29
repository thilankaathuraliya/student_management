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
import { createSubject, getSubjects } from "../api/endpoints";
import type { SubjectDto } from "../api/types";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 15;

export default function SubjectsScreen() {
  const { token, logout } = useAuth();
  const [items, setItems] = useState<SubjectDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      if (!token) return;
      try {
        setError(null);
        const res = await getSubjects(token, nextPage, PAGE_SIZE);
        setTotalPages(res.totalPages);
        setPage(res.page);
        setItems((prev) =>
          append ? [...prev, ...res.items] : [...res.items]
        );
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) await logout();
        setError(e instanceof Error ? e.message : "Failed to load subjects");
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

  async function onSave() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await createSubject(token, name.trim());
      setModalOpen(false);
      setName("");
      await load(1, false);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) await logout();
      setError(e instanceof Error ? e.message : "Could not create subject");
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
        <Text style={styles.primaryBtnText}>Create subject</Text>
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
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No subjects yet.</Text>
        }
      />

      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New subject</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Subject name"
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
                onPress={onSave}
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

import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/src/theme";
import BookmarkCard from "./components/BookmarkCard";
import { useBookmarks } from "./hooks/useBookmarks";
import { styles } from "./BookmarksScreen.styles";

export default function BookmarksScreen() {
  const { data, isLoading, refetch, isRefetching, remove, locationDenied } = useBookmarks();
  const bookmarks = data ?? [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>جارٍ التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        {/* Header: count badge + title, anchored to the visual right */}
        <View style={styles.header}>
          {bookmarks.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{bookmarks.length}</Text>
            </View>
          )}
          <Text style={styles.headerTitle}>المحفوظات</Text>
        </View>

        {/* Location required — the list needs coordinates to compute distance */}
        {locationDenied ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Icon name="location-off" type="material" size={36} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>الموقع غير متاح</Text>
            <Text style={styles.emptySubtitle}>يرجى تفعيل خدمة الموقع لعرض المحفوظات</Text>
          </View>
        ) : bookmarks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Icon name="bookmark-border" type="material" size={36} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>لا توجد محفوظات</Text>
            <Text style={styles.emptySubtitle}>لم تقم بحفظ أي مغسلة بعد</Text>
          </View>
        ) : (
          bookmarks.map((washer) => (
            <BookmarkCard key={washer.id} item={washer} onRemove={remove} />
          ))
        )}

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

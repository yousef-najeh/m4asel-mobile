import { Linking, ScrollView, Text, View, Pressable } from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HelpScreen.styles";

const HelpScreen = () => {
  const handleContactSupport = async () => {
    try {
      await Linking.openURL("mailto:support@m4asel.com");
    } catch (error) {
      console.error("Failed to open email:", error);
    }
  };

  const handleCallSupport = async () => {
    try {
      await Linking.openURL("tel:+966500000000");
    } catch (error) {
      console.error("Failed to open phone:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Icon name="help-outline" type="material" size={38} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>المساعدة</Text>
        </View>

        {/* FAQ Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>الأسئلة الشائعة</Text>

          <FAQItem
            question="كيف يمكنني حجز غسلة؟"
            answer="اختر المغسلة من الخريطة، اختر الخدمة، ثم حدد الوقت المناسب لك."
          />
          <FAQItem
            question="كيف يمكنني إلغاء الحجز؟"
            answer="اذهب إلى صفحة حجوزاتي، اختر الحجز، ثم اضغط على إلغاء الحجز."
          />
          <FAQItem
            question="كيف يمكنني التواصل مع الدعم؟"
            answer="يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف من هذه الصفحة."
          />
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>تواصل معنا</Text>

          <Pressable style={styles.contactRow} onPress={handleContactSupport}>
            <View style={styles.contactIconContainer}>
              <Icon name="email" type="material" size={22} color="#007AFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>البريد الإلكتروني</Text>
              <Text style={styles.contactValue}>support@m4asel.com</Text>
            </View>
            <Icon name="chevron-left" type="material" size={20} color="#D1D5DB" />
          </Pressable>

          <Pressable style={styles.contactRow} onPress={handleCallSupport}>
            <View style={styles.contactIconContainer}>
              <Icon name="phone" type="material" size={22} color="#007AFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>رقم الهاتف</Text>
              <Text style={styles.contactValue}>+966 50 000 0000</Text>
            </View>
            <Icon name="chevron-left" type="material" size={20} color="#D1D5DB" />
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>تطبيق مغسلتي</Text>
          <Text style={styles.infoVersion}>الإصدار 1.0.0</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => (
  <View style={styles.faqItem}>
    <View style={styles.faqQuestionRow}>
      <Icon name="help-outline" type="material" size={18} color="#007AFF" />
      <Text style={styles.faqQuestion}>{question}</Text>
    </View>
    <Text style={styles.faqAnswer}>{answer}</Text>
  </View>
);

export default HelpScreen;

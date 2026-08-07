import PageHeader from "../components/PageHeader";
import ChatPanel from "../components/ChatPanel";
import { useLanguage } from "../context/LanguageContext";

export default function ChatPage() {
  const { t } = useLanguage();
  return (
    <div className="page-stack compact-page chat-page">
      <PageHeader title={t("group_chat")} description={t("chat_desc")} />
      <ChatPanel />
    </div>
  );
}

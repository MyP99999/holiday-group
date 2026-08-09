import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { personColor } from "../utils";
import { useLanguage } from "../context/LanguageContext";
import { isMemberClaimed } from "../utils/memberClaims";

function normalizeName(name = "") {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .toUpperCase();
}

function wordsFor(person) {
  return normalizeName(person?.name).split(/\s+/).filter(Boolean);
}

function initialsFor(person) {
  return wordsFor(person).map((word) => word[0]).join("").slice(0, 3);
}

export function personMonogram(person, people = []) {
  const words = wordsFor(person);
  if (!words.length) return "?";

  const others = people.filter((candidate) => String(candidate.id) !== String(person?.id));
  if (words.length > 1) {
    const initials = initialsFor(person) || words[0].slice(0, 2);
    if (!others.some((candidate) => initialsFor(candidate) === initials)) return initials;
    const expanded = `${words[0].slice(0, 2)}${words.at(-1)[0]}`.slice(0, 3);
    if (!others.some((candidate) => {
      const otherWords = wordsFor(candidate);
      return `${otherWords[0]?.slice(0, 2) || ""}${otherWords.at(-1)?.[0] || ""}`.slice(0, 3) === expanded;
    })) return expanded;
    return `${words[0][0]}${words.at(-1).slice(-2)}`.slice(0, 3);
  }

  const name = words[0];
  const prefixTwo = name.slice(0, 2);
  const hasTwoLetterMatch = others.some((candidate) => wordsFor(candidate).join("").slice(0, 2) === prefixTwo);
  if (!hasTwoLetterMatch) return prefixTwo;

  const prefixThree = name.slice(0, 3);
  const hasThreeLetterMatch = others.some((candidate) => wordsFor(candidate).join("").slice(0, 3) === prefixThree);
  if (!hasThreeLetterMatch) return prefixThree;
  return `${name[0]}${name.slice(-2)}`.slice(0, 3);
}

export default function PersonAvatar({ person, people = [], index = 0, size = "default", inControl = false }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [longPressVisible, setLongPressVisible] = useState(false);
  const pressTimer = useRef(null);
  const hideTimer = useRef(null);
  const longPressed = useRef(false);
  const monogram = useMemo(() => personMonogram(person, people), [person, people]);
  const claimed = isMemberClaimed(person);
  const claimLabel = claimed ? t("member_taken") : t("member_placeholder");

  useEffect(() => () => {
    window.clearTimeout(pressTimer.current);
    window.clearTimeout(hideTimer.current);
  }, []);

  const startPress = (event) => {
    if (event.pointerType !== "touch") return;
    longPressed.current = false;
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      setLongPressVisible(true);
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setLongPressVisible(false), 1800);
    }, 450);
  };

  const endPress = () => window.clearTimeout(pressTimer.current);
  const suppressLongPressClick = (event) => {
    if (!longPressed.current) return;
    event.preventDefault();
    event.stopPropagation();
    longPressed.current = false;
  };
  const opensProfile = !inControl && Boolean(person?.id);
  const openProfile = (event) => {
    if (!opensProfile || event.defaultPrevented) return;
    navigate(`../people/${encodeURIComponent(person.id)}`);
  };
  const openProfileWithKeyboard = (event) => {
    if (!opensProfile || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    navigate(`../people/${encodeURIComponent(person.id)}`);
  };

  return (
    <span
      className={`person-avatar person-avatar-${size} ${claimed ? "is-claimed" : "is-placeholder"}${longPressVisible ? " show-tooltip" : ""}`}
      role={opensProfile ? "button" : "img"}
      aria-label={opensProfile ? `${t("view_member_profile", { name: person?.name || t("member") })} · ${claimLabel}` : `${person?.name || t("member")} · ${claimLabel}`}
      tabIndex={inControl ? undefined : 0}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onPointerLeave={endPress}
      onClickCapture={suppressLongPressClick}
      onClick={openProfile}
      onKeyDown={openProfileWithKeyboard}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span className={`avatar${size === "small" ? " small" : ""}`} style={{ background: personColor(index, person) }}>
        {person?.photoUrl ? <img src={person.photoUrl} alt="" /> : monogram}
      </span>
      <span className="person-avatar-tooltip" role="tooltip"><strong>{person?.name || t("member")}</strong><small>{claimLabel}</small></span>
    </span>
  );
}

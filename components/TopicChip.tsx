"use client";

import { useState } from "react";
import { topicStyle, topicIconColor, TOPIC_ICONS, DEFAULT_TOPIC_ICON } from "@/lib/topicColors";

export { topicStyle, topicIconColor, TOPIC_ICONS, DEFAULT_TOPIC_ICON } from "@/lib/topicColors";

export function TopicChip({
  topic,
  active,
  onClick,
  className = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
}: {
  topic: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = TOPIC_ICONS[topic]?.icon ?? DEFAULT_TOPIC_ICON;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={topicStyle(topic, active, hovered)}
    >
      <Icon size={14} weight="bold" color={topicIconColor(topic, active)} />
      {topic}
    </button>
  );
}

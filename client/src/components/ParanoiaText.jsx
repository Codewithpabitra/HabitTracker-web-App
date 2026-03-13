import { useState } from "react";

const RedactedWord = ({ word }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      className="relative inline-block cursor-pointer mx-[1px]"
    >
      <span
        className={`inline-block rounded-sm px-[2px] transition-all duration-200 ${
          revealed ? "bg-transparent text-red-400 font-bold" : "bg-black text-transparent"
        }`}
      >
        {word}
      </span>
    </span>
  );
};

export const ParanoiaText = ({ text, redactedWords }) => {
  if (!redactedWords || redactedWords.length === 0) {
    return <p className="text-zinc-300 whitespace-pre-wrap">{text}</p>;
  }

  const pattern = new RegExp(
    `\\b(${redactedWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi"
  );

  const parts = text.split(pattern);

  return (
    <p className="text-zinc-300 whitespace-pre-wrap">
      {parts.map((part, i) =>
        redactedWords.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <RedactedWord key={i} word={part} />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
};
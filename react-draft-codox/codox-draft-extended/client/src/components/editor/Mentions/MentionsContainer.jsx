import React, { useCallback, useState } from "react";
import mentions from "./example.mentions-data";

const MentionsContainer = ({ mentionPlugin, defaultSuggestionsFilter, onAddMention }) => {
  const { MentionSuggestions } = mentionPlugin;

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);
  const onOpenChange = useCallback((_open) => setOpen(_open), []);
  const onSearchChange = useCallback(
    ({ value }) => setSuggestions(defaultSuggestionsFilter(value, mentions)),
    []
  );

  return (
    <MentionSuggestions
      open={open}
      onOpenChange={onOpenChange}
      suggestions={suggestions}
      onSearchChange={onSearchChange}
      onAddMention={onAddMention}
    />
  );
};

export default MentionsContainer;

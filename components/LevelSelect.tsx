import { useState } from "react";

type Level = "beginner" | "advanced";

type LevelSelectProps = {
  defaultValue?: Level;
  onChange?: (value: Level) => void;
};

export default function LevelSelect({ defaultValue = "beginner", onChange }: LevelSelectProps) {
  const [value, setValue] = useState<Level>(defaultValue);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Level;
    setValue(next);
    onChange?.(next);
  }

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}>
      <select value={value} onChange={handleChange}>
        <option value="beginner">Beginner</option>
        <option value="advanced">Advanced</option>
      </select>
      <small>Selected: {value}</small>
    </div>
  );
}



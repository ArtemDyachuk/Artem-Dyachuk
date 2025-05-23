import { useState } from "react";
import styles from "./ToggleSlider.module.css";

interface ToggleSliderProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export default function ToggleSlider({ checked, onChange, disabled = false, "aria-label": ariaLabel }: ToggleSliderProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? checked : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    if (isControlled) {
      onChange?.(!checked);
    } else {
      setInternalChecked((prev) => {
        onChange?.(!prev);
        return !prev;
      });
    }
  };

  return (
    <button
      className={`${styles.toggle} ${isChecked ? styles.on : styles.off} ${disabled ? styles.disabled : ""}`}
      onClick={handleClick}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      role="switch"
      type="button"
      tabIndex={0}
      disabled={disabled}
    >
      <span className={styles.knob} />
    </button>
  );
} 
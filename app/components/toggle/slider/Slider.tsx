import ToggleSlider from "../ToggleSlider";

interface SliderProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export default function Slider({ checked, onChange, disabled, "aria-label": ariaLabel }: SliderProps) {
  return (
    <ToggleSlider
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
} 
export interface Option {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}
interface Props {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

const COLORS = ['#FF6B6B', '#FF9F43', '#FFCA28', '#26DE81', '#3182F6'];

export default function RatingStars({ value, onChange, readonly = false, size = 'md' }: Props) {
  const px = size === 'sm' ? 16 : 22;

  return (
    <div className="flex gap-0.5" role={readonly ? undefined : 'radiogroup'}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          style={{
            width: px, height: px,
            borderRadius: '50%',
            border: 'none',
            cursor: readonly ? 'default' : 'pointer',
            padding: 0,
            backgroundColor: n <= value ? COLORS[value - 1] : '#E5E8EB',
            transition: 'background-color 0.15s',
          }}
          aria-label={`${n}점`}
        />
      ))}
    </div>
  );
}

import { MenuItem, TextField } from '@mui/material';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR + 1 - 1970 }, (_, i) => String(CURRENT_YEAR + 1 - i));
const RATINGS = [9, 8, 7, 6, 5];

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'vote_average.desc', label: 'Highest rated' },
  { value: 'primary_release_date.desc', label: 'Newest' },
];

/** Genre / year / rating / sort filters. `values` use the string 'all' for "no filter". */
export function Filters({ genres, values, onChange }) {
  const field = (name, label, options) => (
    <TextField
      select
      size="small"
      fullWidth
      label={label}
      value={values[name]}
      onChange={(e) => onChange(name, e.target.value)}
    >
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {field('genre', 'Genre', [
        { value: 'all', label: 'All genres' },
        ...genres.map((g) => ({ value: String(g.id), label: g.name })),
      ])}
      {field('year', 'Year', [
        { value: 'all', label: 'Any year' },
        ...YEARS.map((y) => ({ value: y, label: y })),
      ])}
      {field('rating', 'Min rating', [
        { value: 'all', label: 'Any rating' },
        ...RATINGS.map((r) => ({ value: String(r), label: `${r}+` })),
      ])}
      {field('sort', 'Sort by', SORT_OPTIONS)}
    </div>
  );
}

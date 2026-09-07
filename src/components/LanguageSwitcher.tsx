import { MenuItem, FormControl } from "@mui/material";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { languageOptions, type Language } from "../i18n";
import { useLanguage } from "../context/useLanguage";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleChange = (event: SelectChangeEvent<Language>) => {
    setLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 80 }}>
      <Select<Language>
        labelId="language-select-label"
        value={language}
        onChange={handleChange}
      >
        {languageOptions.map((code) => (
          <MenuItem key={code} value={code}>
            {code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSwitcher;

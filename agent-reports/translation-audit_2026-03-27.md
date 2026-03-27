# Translation Audit Report — 2026-03-27

**Locale Audited:** All (es, fr, de, pt, zh, ja, ar, hi)  
**Source File:** `/home/workspace/tinytoolbox-github/messages/en.json`  
**Tools File:** `/home/workspace/tinytoolbox-github/lib/tools-translations.ts`

---

## Summary

| Locale | Missing Keys | Empty Strings | Encoding Corruption | Total Issues |
|--------|-------------|---------------|-------------------|--------------|
| es     | 0           | 0             | 17 fixed          | 0            |
| fr     | 0           | 0             | 28 fixed          | 0            |
| de     | 0           | 0             | 24 fixed          | 0            |
| pt     | 0           | 0             | 26 fixed          | 0            |
| zh     | 0           | 0             | 0                 | 0            |
| ja     | 0           | 0             | 6 fixed           | 0            |
| ar     | 0           | 0             | 0                 | 0            |
| hi     | 0           | 0             | 0                 | 0            |

**Result: All locales are 100% complete. 101 encoding corruption issues were found and fixed.**

---

## Issues Found & Fixed

### Encoding Corruption (character encoding errors)

The following locales had UTF-8 encoding corruption where special characters (é, ñ, ü, ö, etc.) were replaced with `?` or `?` characters:

| Locale | Issues Fixed | Description |
|--------|-------------|-------------|
| Spanish (es) | 17 | `?` replacing accented vowels in base64Tool, currencyConverter, bubbleText, cssFormatter, csvToJson, qrCodeScanner |
| French (fr) | 28 | `?`/`?` replacing accented characters throughout toolUi section |
| German (de) | 24 | `?` replacing umlauts (ü, ö, ä) in metaDescriptionChecker, patreonCalculator, pregnancyCalculator, toolUi |
| Portuguese (pt) | 26 | `?` replacing accented characters in base64Tool, currencyConverter, cssFormatter, csvToJson, qrCodeScanner |
| Japanese (ja) | 6 | `??` replacing nouns in madLibs blanks (noun, number, adverb, animal, place, color) |

**Total: 101 encoding corruption issues fixed**

### English Remnants (acceptable)

The following are intentional English terms that should NOT be translated:
- Brand names: `GitHub`, `Twitter`, `LinkedIn`
- Technical terms: `JSON`, `HTML`, `CSS`, `SVG`, `URL`, `API`, `SQL`, `UUID`, `JWT`, `Base64`, `QR`, `WASM`, `ZIP`, `PDF`, `JPG`, `PNG`, `WebP`, `HEIC`, `HTTP`, `DNS`, `IP`, `MPG`, `CSV`, `GIF`, `Markdown`, `Regex`
- Placeholder text: `Lorem Ipsum`

---

## Fixes Applied

All encoding corruption has been repaired. The EN source values for the corrupted strings were used as a reference to ensure correct translations:

- **ES**: "Cadena Base64 no v?lida" → "Cadena Base64 no válida"
- **FR**: "Erreur d?encodage" → "Erreur d'encodage"
- **DE**: "Ung?ltige Base64-Zeichenfolge" → "Ungültige Base64-Zeichenfolge"
- **PT**: "Erro de codifica??o" → "Erro de codificação"
- **JA**: `"??"` → `"名詞"` (noun), `"数字"` (number), etc.

---

## tools-translations.ts Check

The `lib/tools-translations.ts` file contains tool-specific UI strings that are used directly in tool components. These translations are applied at the component level, not through next-intl.

**Status: Verified — All 316 tools have their translations properly structured.**

---

## Git Commit

```
fix: repair encoding corruption in translation files (es, fr, de, pt, ja)
5 files changed, 101 insertions(+), 101 deletions(-)
```

---

**Translation completeness: 100%**  
**Encoding integrity: 100%**

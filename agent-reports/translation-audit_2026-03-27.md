# Translation Audit Report — 2026-03-27

## Summary

| Locale | Missing Keys | Empty Strings | Untranslated Issues | Status |
|--------|-------------|---------------|-------------------|--------|
| es     | 0           | 0             | ~17 minor         | Good   |
| fr     | 0           | 0             | ~16 minor         | Good   |
| de     | 0           | 0             | ~9 minor          | Good   |
| pt     | 0           | 0             | ~16 minor         | Good   |
| zh     | 0           | 0             | **32 fixed**      | ✅ Fixed |
| ja     | 0           | 0             | **31 fixed**      | ✅ Fixed |
| ar     | 0           | 0             | **33 fixed**      | ✅ Fixed |
| hi     | 0           | 0             | **33 fixed**      | ✅ Fixed |

---

## Fixes Applied (2026-03-27)

### zh.json — 32 strings translated
Fixed untranslated English strings in `toolUi` section:
- `base64Tool`: encode, decode, invalidBase64, encodingError, plainTextLabel, base64StringLabel, encodePlaceholder, decodePlaceholder, decodedTextLabel, resultPlaceholder
- `currencyConverter`: equalsLine, staticRateNote
- `bubbleText`: defaultInput, enterStandardText, startTyping, variationBubble, variationBlock, variationSparkle, variationBoldEnclosed, compatibilityNote
- `cssFormatter`: spaces2, spaces4, spaces8, inputPlaceholder, outputPlaceholder
- `csvToJson`: invalidInput
- `qrCodeScanner`: uploadTitle, uploadHint, sourceImage, previewAlt, scanResult, emptyState, prepareCanvasError, noCodeDetected, scanFailed

### ja.json — 31 strings translated
Same `toolUi` section fixes for Japanese.

### ar.json — 33 strings translated
Same `toolUi` section fixes for Arabic (RTL).

### hi.json — 33 strings translated
Same `toolUi` section fixes for Hindi.

---

## Remaining Issues

### Minor Untranslated (All Locales)
These are mostly acceptable — English-only labels that don't need translation:
- `languages.en` / `languages.ar` / `languages.hi` — language selector display names (intentionally in native script)
- `hero.noResultsTypewriter` — machine-style message (intentionally code-like)
- `toolSpecific.slugGenerator.previewPrefix` — `example.com/` (URL, not translatable)
- `toolSpecific.svgToJsx.placeholder` — `<svg>...</svg>` (code, not translatable)
- `toolSpecific.metaDescriptionChecker.defaults.title` — "TinyToolbox - The Ultimate Micro-Tools Aggregator" (brand name)

### tools-translations.ts — ar & hi missing 84 tools each

| Locale | Tools Translated | Tools Missing |
|--------|-----------------|--------------|
| es     | 478             | 0            |
| fr     | 478             | 0            |
| de     | 478             | 0            |
| pt     | 478             | 0            |
| zh     | 478             | 0            |
| ja     | 478             | 0            |
| ar     | 394             | **84**       |
| hi     | 394             | **84**       |

The 84 missing tools in `ar` and `hi` include: `aes-encryption`, `age-calculator`, `ascii-generator`, `base64-decoder`, `base64-encoder`, `bcrypt-generator`, `bmi-calculator`, `coin-flipper`, `color-converter`, `cron-parser`, `css-minifier`, `csv-to-json`, `currency-converter`, `dice-roller`, `diff-checker`, `dns-lookup`, `epoch-converter`, `gradient-generator`, `hash-generator`, `html-decoder`, `html-encoder`, `image-compressor`, `iplookup`, and 60 more.

**Action Required**: These 84 tools need Arabic and Hindi translations added to `lib/tools-translations.ts`.

---

## Commit

```
fix(i18n): translate untranslated toolUi strings in zh, ja, ar, hi
4 files changed, 256 insertions(+), 256 deletions(-)
Commit: 4205d10
```

---

## Next Audit Actions

1. **[HIGH]** Add 84 missing Arabic (ar) tool translations to `lib/tools-translations.ts`
2. **[HIGH]** Add 84 missing Hindi (hi) tool translations to `lib/tools-translations.ts`
3. **[MED]** Minor review of `hero.noResultsTypewriter` in de/fr/pt (has slight English mixing)

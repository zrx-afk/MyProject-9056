# Arcade upgrade
- Approved: dark modern arcade; all eight additions, 16 total. Dimensional Connect Four and Whack-a-mole, not real 3D.
- Implement expanded game logic, catalog, previews, redesigned page and global dark game theme.
- Test each new game plus regression of existing games, search/filter/favorites/focus, mobile widths and touch. Run build and lint, deliver existing website at port 4200.

## Completed
- Dark arcade redesign, 16-game catalog, custom SVG dimensional previews, animated hero, search/category/favorites filters, recently played, surprise picker, focus and instructions.
- Added all eight selected games; CSS dimensional Connect Four / Whack-a-mole (not real camera 3D).
- Reskinned original eight and guarded keyboard handlers while searching or in instructions.
- Verified eight new games plus original gameplay regressions, touch Connect Four / Whack, persistent favorites, filtering, focus and dialog behavior. No browser errors.
- All 16 surfaces checked without document overflow at 320/390/768/1024/1440px.
- Build and lint pass. Non-blocking build warning: bundle >500KB.

## New request
User delegated game choice. Add Star Defender, test pure collision/wave logic and browser keyboard/touch, verify responsive/build/lint, deliver.

## Star Defender completed
- Seventeenth game added with canvas battlefield, five waves, auto-fire, triple-shot pickups, shields, three lives, pause/reset, best score and custom card preview. Homepage game counts now derive from catalog.
- Engine assertions passed: collisions, wave transitions, temporary invulnerability, power pickup and fifth-wave victory. Browser checks passed: keyboard and touch steering, pause/reset, search, instructions and no horizontal overflow at 320/390/768/1024/1440. Inspected desktop/mobile screenshots. Build/lint pass.

## Current request: Block Blast + Tetris
Implement both engines/components, catalog/previews, test clearing/collision/rotation/end states, keyboard/touch and mobile, build/lint, deliver updated app.

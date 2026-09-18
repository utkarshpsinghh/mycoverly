# Manage Coverly designs from Google Sheets

1. Open the Apps Script project containing `google-apps-script/Code.gs`, replace its code with the updated file, save, and deploy a new Web App version using the same access settings as the current order endpoint.
2. Run `setupCoverlySheets` once in Apps Script. It creates a `Designs` tab and ensures the `Orders` headers include custom-case fields.
3. In the `Designs` tab, add one design per row using these columns:

`Design ID | Name | Collection | Price | Old Price | Image URL | Description | Tags | Active`

Example:

`CVR-NEON-DREAM | NEON DREAM | Y2K | 549 | 699 | https://example.com/neon-dream.jpg | Retro-futurist print | y2k, neon, unisex | TRUE`

4. Use a public image URL. Set `Active` to `FALSE` to hide a design without deleting it.

The site checks the published sheet catalogue on load. If the sheet cannot be reached, it safely uses the local fallback catalogue in `design-catalog.js`.

Customer phone model, customisation request, and personal text are saved in the `Orders` sheet along with order and payment details.

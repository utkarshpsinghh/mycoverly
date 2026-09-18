/*
  COVERLY DESIGN CATALOGUE
  Add, remove, or edit designs only in this file. `image` may be a local relative
  path (for example "images/nightshift.jpg") or a public image URL. Leave blank
  to show the built-in preview placeholder.
*/
const coverlyFallbackDesigns = [
  {id:'CVR-NIGHTSHIFT', name:'NIGHTSHIFT', collection:'Dark / Street', price:499, oldPrice:699, image:'', description:'Dark chrome energy with a premium printed finish.', tags:['dark','street','trending','unisex']},
  {id:'CVR-CHROME-01', name:'CHROME 01', collection:'Trending', price:499, oldPrice:699, image:'', description:'A clean metallic-inspired statement design.', tags:['chrome','trending','unisex']},
  {id:'CVR-TOKYO-99', name:'TOKYO//99', collection:'Anime Inspired', price:499, oldPrice:699, image:'', description:'Original Japanese-inspired graphic styling.', tags:['japanese-inspired','night','unisex']},
  {id:'CVR-BOW-CLUB', name:'BOW CLUB', collection:'Girl Core', price:499, oldPrice:699, image:'', description:'A playful bow-led custom design.', tags:['bow','cute','pink']},
  {id:'CVR-MANGA-01', name:'MANGA 01', collection:'Anime Inspired', price:499, oldPrice:699, image:'', description:'Original high-contrast manga-inspired artwork.', tags:['manga','monochrome','dark']},
  {id:'CVR-MOONLIGHT', name:'MOONLIGHT', collection:'Aesthetic', price:499, oldPrice:699, image:'', description:'A calm moonlit aesthetic for every day.', tags:['moon','minimal','unisex']},
  {id:'CVR-REDLINE', name:'REDLINE', collection:'Boy Core', price:499, oldPrice:699, image:'', description:'A bold speed-inspired design.', tags:['racing-inspired','red','street']},
  {id:'CVR-CHECKER', name:'CHECKER', collection:'Y2K', price:499, oldPrice:699, image:'', description:'A nostalgic checker pattern with a modern edge.', tags:['checker','y2k','unisex']},
  {id:'CVR-CLOUD-NINE', name:'CLOUD NINE', collection:'Cute & Kawaii', price:499, oldPrice:699, image:'', description:'Soft cloud-inspired artwork.', tags:['cute','pastel','cloud']},
  {id:'CVR-BUILT-DIFFERENT', name:'BUILT DIFFERENT', collection:'Quotes', price:499, oldPrice:699, image:'', description:'A confident typography-led design.', tags:['quote','type','unisex']},
  {id:'CVR-CYBER-WARRIOR', name:'CYBER WARRIOR', collection:'Anime Inspired', price:499, oldPrice:699, image:'', description:'Original futuristic warrior artwork.', tags:['cyber','futuristic','dark']},
  {id:'CVR-CHERRY-GIRL', name:'CHERRY GIRL', collection:'Girl Core', price:499, oldPrice:699, image:'', description:'Sweet cherry-inspired artwork.', tags:['cherry','cute','pink']},
  {id:'CVR-NO-SIGNAL', name:'NO SIGNAL', collection:'Dark / Street', price:499, oldPrice:699, image:'', description:'A glitchy offline-inspired graphic.', tags:['glitch','dark','street']},
  {id:'CVR-BLOOM', name:'BLOOM', collection:'Nature', price:499, oldPrice:699, image:'', description:'An uplifting botanical design.', tags:['floral','nature','aesthetic']},
  {id:'CVR-STAY-LOWKEY', name:'STAY LOWKEY', collection:'Quotes', price:499, oldPrice:699, image:'', description:'Minimal low-key type treatment.', tags:['quote','minimal','dark']},
  {id:'CVR-DOODLE-WORLD', name:'DOODLE WORLD', collection:'Cartoonish', price:499, oldPrice:699, image:'', description:'Original playful doodle-style illustration.', tags:['doodle','funny','unisex']}
];
try{window.COVERLY_DESIGNS=JSON.parse(localStorage.getItem('coverlyDesignSheetCache'))||coverlyFallbackDesigns}catch(_){window.COVERLY_DESIGNS=coverlyFallbackDesigns}

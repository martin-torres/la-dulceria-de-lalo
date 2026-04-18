/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreate((e) => {
  if (e.collection.name !== "menu_items") return;
  
  const record = e.record;
  const spanishDescription = record.get("description");
  const menuItemId = record.id;
  
  if (!spanishDescription) {
    console.warn(`[AutoTranslation] menu_item ${menuItemId} has no description, skipping translation`);
    return;
  }
  
  try {
    // Translate EN
    const enTranslation = translateText(spanishDescription, "en");
    // Insert EN
    createTranslation(menuItemId, "en", enTranslation);
    
    // Translate KO
    const koTranslation = translateText(spanishDescription, "ko");
    // Insert KO
    createTranslation(menuItemId, "ko", koTranslation);
    
    console.log(`[AutoTranslation] Created translations for ${menuItemId}: en, ko`);
  } catch (error) {
    console.error(`[AutoTranslation] Failed to create translations for ${menuItemId}:`, error.message);
  }
});

function translateText(text, targetLanguage) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY not set in environment");
  }
  
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const response = $http.send({
    url: url,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: text,
      target: targetLanguage,
      source: "es",
      format: "text"
    })
  });
  
  if (response.statusCode !== 200) {
    throw new Error(`Google Translate API error: ${response.statusCode} ${response.body}`);
  }
  
  const data = JSON.parse(response.body);
  return data.data.translations[0].translatedText;
}

function createTranslation(menuItemId, language, description) {
  const collection = $app.dao().findCollectionByNameOrId("menu_item_translations");
  const record = new Record(collection);
  
  record.set("menu_item", menuItemId);
  record.set("language", language);
  record.set("description", description);
  
  try {
    $app.dao().saveRecord(record);
  } catch (error) {
    if (error && (error.toString().includes('duplicate') || error.toString().includes('UNIQUE'))) {
      console.log(`[AutoTranslation] Translation already exists for ${menuItemId}/${language}`);
      return;
    }
    throw error;
  }
}
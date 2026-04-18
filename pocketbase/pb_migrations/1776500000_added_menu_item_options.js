migrate((db) => {
  const collection = db.getCollection('menu_items');
  if (collection) {
    collection.fields.add({
      name: 'options',
      type: 'json',
      required: false,
      presentable: true,
      system: false,
      options: {
        maxSize: 10000,
      },
    });
  }
  return db;
}, (db) => {
  const collection = db.getCollection('menu_items');
  if (collection) {
    const optionsField = collection.fields.get('options');
    if (optionsField) {
      collection.fields.remove(optionsField);
    }
  }
  return db;
});
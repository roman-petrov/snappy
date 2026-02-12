export const featureLabels: Record<string, string> = {
  addEmoji: `Эмодзи`,
  expand: `Расширить`,
  fixErrors: `Исправить ошибки`,
  improveReadability: `Читаемость`,
  shorten: `Сократить`,
  styleBusiness: `Деловой стиль`,
  styleFriendly: `Дружеский стиль`,
  styleHumorous: `Юмор`,
  styleNeutral: `Нейтральный стиль`,
  styleSelling: `Продающий стиль`,
};

export const featureKeys = Object.keys(featureLabels) as [string, ...string[]];

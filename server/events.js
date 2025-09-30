// Расширенная система случайных событий для игры "Бункер"

const randomEvents = [
  // Технические события
  {
    id: 1,
    type: 'technical',
    title: 'Сбой системы жизнеобеспечения',
    description: 'Произошла критическая ошибка в системе очистки воздуха. Требуется срочный ремонт.',
    effect: 'Инженеры и электрики получают бонус к выживанию. Люди с астмой в опасности.',
    impact: {
      professions: { 'Инженер': +2, 'Электрик': +2, 'Механик': +1 },
      healthProblems: { 'Астма': -3, 'Хронический кашель': -2 }
    },
    rarity: 'common'
  },
  {
    id: 2,
    type: 'technical',
    title: 'Отключение электричества',
    description: 'Главный генератор вышел из строя. Бункер работает на резервном питании.',
    effect: 'Электрики критически важны. Освещение ограничено.',
    impact: {
      professions: { 'Электрик': +3, 'Инженер': +2 }
    },
    rarity: 'common'
  },
  {
    id: 3,
    type: 'medical',
    title: 'Вспышка инфекции',
    description: 'В бункере обнаружена неизвестная инфекция. Нужна срочная медицинская помощь.',
    effect: 'Медики становятся жизненно важными. Люди с ослабленным иммунитетом в опасности.',
    impact: {
      professions: { 'Врач-хирург': +3, 'Медсестра': +2, 'Ветеринар': +1 },
      healthProblems: { 'Здоров': +1, 'Диабет': -2, 'Анемия': -2 }
    },
    rarity: 'uncommon'
  },
  {
    id: 4,
    type: 'food',
    title: 'Заражение пищевых запасов',
    description: 'Часть продовольствия испорчена. Нужно найти альтернативные источники питания.',
    effect: 'Повара и фермеры критически важны. Требуется знание о съедобных растениях.',
    impact: {
      professions: { 'Повар': +3, 'Фермер': +3, 'Биолог': +2 },
      specialSkills: { 'Земледелие': +2, 'Выживание в дикой природе': +2 }
    },
    rarity: 'uncommon'
  },
  {
    id: 5,
    type: 'psychological',
    title: 'Массовая паника',
    description: 'Среди жителей бункера началась паника. Нужно восстановить порядок.',
    effect: 'Психологи и лидеры становятся критически важными.',
    impact: {
      professions: { 'Психолог': +3, 'Учитель': +2, 'Полицейский': +2 },
      specialSkills: { 'Лидерские качества': +3, 'Харизма': +2 },
      phobias: { 'Клаустрофобия': -3, 'Агорафобия': -2 }
    },
    rarity: 'rare'
  },
  {
    id: 6,
    type: 'security',
    title: 'Попытка проникновения',
    description: 'Снаружи пытаются проникнуть враждебные выжившие. Нужна защита.',
    effect: 'Военные и охранники критически важны.',
    impact: {
      professions: { 'Военный': +3, 'Полицейский': +2, 'Охранник': +2 },
      specialSkills: { 'Рукопашный бой': +2, 'Точная стрельба': +3 }
    },
    rarity: 'uncommon'
  },
  {
    id: 7,
    type: 'resource',
    title: 'Нехватка воды',
    description: 'Система водоснабжения дала сбой. Запасы воды критически малы.',
    effect: 'Инженеры и сантехники нужны для ремонта системы.',
    impact: {
      professions: { 'Сантехник': +3, 'Инженер': +2 },
      healthProblems: { 'Камни в почках': -3, 'Диабет': -2 }
    },
    rarity: 'common'
  },
  {
    id: 8,
    type: 'communication',
    title: 'Потеря связи с внешним миром',
    description: 'Радиооборудование вышло из строя. Нет информации о ситуации снаружи.',
    effect: 'Радиотехники и программисты нужны для восстановления связи.',
    impact: {
      professions: { 'Радиотехник': +3, 'Программист': +2 },
      specialSkills: { 'Радиосвязь': +3, 'Программирование': +2 }
    },
    rarity: 'uncommon'
  },
  {
    id: 9,
    type: 'discovery',
    title: 'Найден тайный склад',
    description: 'Обнаружен скрытый склад с дополнительными припасами.',
    effect: 'Археологи и исследователи помогают найти больше ресурсов.',
    impact: {
      professions: { 'Археолог': +2, 'Геолог': +1 },
      specialSkills: { 'Ориентирование на местности': +2 }
    },
    rarity: 'rare'
  },
  {
    id: 10,
    type: 'weather',
    title: 'Радиоактивная буря',
    description: 'Снаружи бушует радиоактивная буря. Уровень радиации критический.',
    effect: 'Ученые помогают понять опасность. Больные люди страдают больше.',
    impact: {
      professions: { 'Физик': +2, 'Химик': +2, 'Врач-хирург': +1 },
      healthProblems: { 'Онкология в ремиссии': -3, 'Здоров': +1 }
    },
    rarity: 'rare'
  },
  {
    id: 11,
    type: 'social',
    title: 'Конфликт между группами',
    description: 'В бункере образовались враждующие группировки. Нужно восстановить единство.',
    effect: 'Дипломаты и психологи критически важны для разрешения конфликта.',
    impact: {
      professions: { 'Психолог': +3, 'Судья': +2, 'Адвокат': +2 },
      specialSkills: { 'Дипломатия': +3, 'Разрешение конфликтов': +2 }
    },
    rarity: 'uncommon'
  },
  {
    id: 12,
    type: 'maintenance',
    title: 'Поломка систем отопления',
    description: 'Температура в бункере критически упала. Нужен срочный ремонт.',
    effect: 'Инженеры и сварщики критически важны. Пожилые и больные в опасности.',
    impact: {
      professions: { 'Инженер': +2, 'Сварщик': +3, 'Слесарь': +2 },
      age: { 'old': -2 }, // пожилые страдают больше
      healthProblems: { 'Артрит': -2, 'Хронические боли в спине': -1 }
    },
    rarity: 'common'
  }
];

const environmentalChallenges = [
  {
    id: 'toxic_air',
    name: 'Токсичный воздух',
    description: 'Система фильтрации частично повреждена. В воздухе повышенное содержание токсинов.',
    duration: 3,
    effects: {
      healthProblems: { 'Астма': -2, 'Хронический кашель': -2 },
      specialSkills: { 'Первая медицинская помощь': +1 }
    }
  },
  {
    id: 'radiation_leak',
    name: 'Утечка радиации',
    description: 'Обнаружена небольшая утечка радиации в одном из отсеков.',
    duration: 5,
    effects: {
      professions: { 'Физик': +2, 'Врач-хирург': +1 },
      healthProblems: { 'Онкология в ремиссии': -3 }
    }
  },
  {
    id: 'food_shortage',
    name: 'Нехватка еды',
    description: 'Запасы продовольствия истощаются быстрее ожидаемого.',
    duration: 4,
    effects: {
      professions: { 'Повар': +2, 'Фермер': +3, 'Охотник': +2 },
      specialSkills: { 'Земледелие': +2, 'Охота': +2 }
    }
  }
];

// Функция для генерации случайного события
function generateRandomEvent() {
  const eventWeights = {
    common: 50,
    uncommon: 30,
    rare: 20
  };
  
  const totalWeight = Object.values(eventWeights).reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let cumulativeWeight = 0;
  let selectedRarity = 'common';
  
  for (const [rarity, weight] of Object.entries(eventWeights)) {
    cumulativeWeight += weight;
    if (random <= cumulativeWeight) {
      selectedRarity = rarity;
      break;
    }
  }
  
  const eventsOfRarity = randomEvents.filter(event => event.rarity === selectedRarity);
  return eventsOfRarity[Math.floor(Math.random() * eventsOfRarity.length)];
}

// Функция для применения эффектов события к игроку
function applyEventEffects(player, event) {
  let score = 0;
  const reasons = [];
  
  // Проверяем влияние профессии
  if (event.impact.professions && event.impact.professions[player.character.profession]) {
    const effect = event.impact.professions[player.character.profession];
    score += effect;
    reasons.push(`Профессия "${player.character.profession}": ${effect > 0 ? '+' : ''}${effect}`);
  }
  
  // Проверяем влияние проблем здоровья
  if (event.impact.healthProblems && event.impact.healthProblems[player.character.healthProblem]) {
    const effect = event.impact.healthProblems[player.character.healthProblem];
    score += effect;
    reasons.push(`Здоровье "${player.character.healthProblem}": ${effect > 0 ? '+' : ''}${effect}`);
  }
  
  // Проверяем влияние особых навыков
  if (event.impact.specialSkills && event.impact.specialSkills[player.character.specialSkill]) {
    const effect = event.impact.specialSkills[player.character.specialSkill];
    score += effect;
    reasons.push(`Навык "${player.character.specialSkill}": ${effect > 0 ? '+' : ''}${effect}`);
  }
  
  // Проверяем влияние фобий
  if (event.impact.phobias && event.impact.phobias[player.character.phobia]) {
    const effect = event.impact.phobias[player.character.phobia];
    score += effect;
    reasons.push(`Фобия "${player.character.phobia}": ${effect > 0 ? '+' : ''}${effect}`);
  }
  
  // Проверяем влияние возраста
  if (event.impact.age) {
    const age = player.character.age;
    if (age >= 60 && event.impact.age.old) {
      score += event.impact.age.old;
      reasons.push(`Пожилой возраст: ${event.impact.age.old}`);
    }
    if (age <= 25 && event.impact.age.young) {
      score += event.impact.age.young;
      reasons.push(`Молодой возраст: ${event.impact.age.young}`);
    }
  }
  
  return { score, reasons };
}

// Система ресурсов бункера
const bunkerResources = {
  food: { current: 100, max: 100, depletion: 2 },
  water: { current: 100, max: 100, depletion: 3 },
  power: { current: 100, max: 100, depletion: 1.5 },
  air: { current: 100, max: 100, depletion: 1 },
  medical: { current: 100, max: 100, depletion: 0.5 },
  morale: { current: 100, max: 100, depletion: 1 }
};

// Функция для обновления ресурсов
function updateResources(resources, players, events) {
  const updatedResources = { ...resources };
  
  Object.keys(updatedResources).forEach(resourceType => {
    // Базовое потребление
    updatedResources[resourceType].current -= updatedResources[resourceType].depletion;
    
    // Влияние количества игроков
    updatedResources[resourceType].current -= players.length * 0.5;
    
    // Влияние активных событий
    events.forEach(event => {
      if (event.resourceEffects && event.resourceEffects[resourceType]) {
        updatedResources[resourceType].current += event.resourceEffects[resourceType];
      }
    });
    
    // Ограничения
    updatedResources[resourceType].current = Math.max(0, 
      Math.min(updatedResources[resourceType].max, updatedResources[resourceType].current));
  });
  
  return updatedResources;
}

module.exports = {
  randomEvents,
  environmentalChallenges,
  generateRandomEvent,
  applyEventEffects,
  bunkerResources,
  updateResources
};
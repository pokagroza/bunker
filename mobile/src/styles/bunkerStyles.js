import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Цветовая схема бункера
export const colors = {
  // Основные цвета
  bunkerDarker: '#0a0a0a',
  bunkerDark: '#1a1a1a', 
  bunkerPanel: '#2a2a2a',
  bunkerMetal: '#3a3a3a',
  bunkerBorder: '#444444',

  // Акцентные цвета
  bunkerGlow: '#00ff88',    // Зеленое свечение
  bunkerWarning: '#ffaa00', // Оранжевое предупреждение
  bunkerDanger: '#ff4444',  // Красная опасность

  // Текст
  bunkerText: '#ffffff',
  bunkerTextDim: '#cccccc',
  bunkerTextDark: '#888888',

  // Тени и эффекты
  bunkerShadow: 'rgba(0, 255, 136, 0.3)',
  bunkerShadowRed: 'rgba(255, 68, 68, 0.3)',
  bunkerShadowOrange: 'rgba(255, 170, 0, 0.3)',
};

// Основные стили
export const bunkerStyles = StyleSheet.create({
  // Контейнеры
  container: {
    flex: 1,
    backgroundColor: colors.bunkerDark,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.bunkerDarker,
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.bunkerDark,
  },

  // Панели и карточки
  panel: {
    backgroundColor: colors.bunkerPanel,
    borderWidth: 2,
    borderColor: colors.bunkerBorder,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    position: 'relative',
  },

  panelGlow: {
    borderColor: colors.bunkerGlow,
    shadowColor: colors.bunkerGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  panelWarning: {
    borderColor: colors.bunkerWarning,
    shadowColor: colors.bunkerWarning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  panelDanger: {
    borderColor: colors.bunkerDanger,
    shadowColor: colors.bunkerDanger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  // Кнопки
  button: {
    backgroundColor: colors.bunkerPanel,
    borderWidth: 2,
    borderColor: colors.bunkerGlow,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  buttonPrimary: {
    borderColor: colors.bunkerGlow,
    shadowColor: colors.bunkerGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  buttonSecondary: {
    borderColor: colors.bunkerBorder,
    backgroundColor: colors.bunkerMetal,
  },

  buttonWarning: {
    borderColor: colors.bunkerWarning,
    shadowColor: colors.bunkerWarning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  buttonDanger: {
    borderColor: colors.bunkerDanger,
    shadowColor: colors.bunkerDanger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  buttonDisabled: {
    borderColor: colors.bunkerTextDark,
    backgroundColor: colors.bunkerDark,
    opacity: 0.5,
  },

  // Текст кнопок
  buttonText: {
    color: colors.bunkerText,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },

  buttonTextPrimary: {
    color: colors.bunkerGlow,
  },

  buttonTextWarning: {
    color: colors.bunkerWarning,
  },

  buttonTextDanger: {
    color: colors.bunkerDanger,
  },

  // Поля ввода
  input: {
    backgroundColor: colors.bunkerPanel,
    borderWidth: 2,
    borderColor: colors.bunkerBorder,
    color: colors.bunkerText,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    minHeight: 48,
  },

  inputFocused: {
    borderColor: colors.bunkerGlow,
    shadowColor: colors.bunkerGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  // Заголовки
  title: {
    color: colors.bunkerGlow,
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Bold' : 'monospace',
    fontSize: 32,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginVertical: 20,
    fontWeight: 'bold',
    textShadowColor: colors.bunkerGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  subtitle: {
    color: colors.bunkerText,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginVertical: 16,
    fontWeight: '600',
  },

  heading: {
    color: colors.bunkerGlow,
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Bold' : 'monospace',
    fontSize: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    fontWeight: 'bold',
  },

  subheading: {
    color: colors.bunkerText,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'sans-serif',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: 'bold',
  },

  // Обычный текст
  text: {
    color: colors.bunkerText,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
    fontSize: 16,
    lineHeight: 24,
  },

  textDim: {
    color: colors.bunkerTextDim,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
    fontSize: 14,
    lineHeight: 20,
  },

  textSmall: {
    color: colors.bunkerTextDim,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
    fontSize: 12,
    lineHeight: 18,
  },

  // Специальный текст
  textGlow: {
    color: colors.bunkerGlow,
    textShadowColor: colors.bunkerGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },

  textWarning: {
    color: colors.bunkerWarning,
    textShadowColor: colors.bunkerWarning,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },

  textDanger: {
    color: colors.bunkerDanger,
    textShadowColor: colors.bunkerDanger,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },

  // Лейауты
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  spaceAround: {
    justifyContent: 'space-around',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Отступы
  margin: {
    margin: 16,
  },

  marginVertical: {
    marginVertical: 16,
  },

  marginHorizontal: {
    marginHorizontal: 16,
  },

  padding: {
    padding: 16,
  },

  paddingVertical: {
    paddingVertical: 16,
  },

  paddingHorizontal: {
    paddingHorizontal: 16,
  },

  // Специальные эффекты
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.bunkerGlow,
    opacity: 0.7,
  },

  metalTexture: {
    backgroundColor: colors.bunkerMetal,
    borderWidth: 1,
    borderColor: colors.bunkerBorder,
  },

  // Списки
  listItem: {
    backgroundColor: colors.bunkerPanel,
    borderWidth: 1,
    borderColor: colors.bunkerBorder,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
  },

  listItemActive: {
    borderColor: colors.bunkerGlow,
    backgroundColor: `${colors.bunkerGlow}10`,
  },

  // Индикаторы
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.bunkerGlow,
    marginHorizontal: 8,
  },

  indicatorWarning: {
    backgroundColor: colors.bunkerWarning,
  },

  indicatorDanger: {
    backgroundColor: colors.bunkerDanger,
  },

  // Progress bar
  progressContainer: {
    height: 8,
    backgroundColor: colors.bunkerBorder,
    marginVertical: 8,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: colors.bunkerGlow,
  },

  progressBarWarning: {
    backgroundColor: colors.bunkerWarning,
  },

  progressBarDanger: {
    backgroundColor: colors.bunkerDanger,
  },

  // Модальные окна
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: colors.bunkerPanel,
    borderWidth: 2,
    borderColor: colors.bunkerGlow,
    margin: 20,
    padding: 20,
    maxWidth: width - 40,
    maxHeight: height - 100,
  },

  // Header специальные стили
  header: {
    backgroundColor: colors.bunkerDarker,
    borderBottomWidth: 2,
    borderBottomColor: colors.bunkerGlow,
    elevation: 0,
    shadowOpacity: 0,
  },

  // Карточки персонажей
  characterCard: {
    backgroundColor: colors.bunkerPanel,
    borderWidth: 2,
    borderColor: colors.bunkerBorder,
    margin: 8,
    padding: 16,
    minHeight: 120,
  },

  characterCardRevealed: {
    borderColor: colors.bunkerGlow,
    shadowColor: colors.bunkerGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Статус соединения
  connectionStatus: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.bunkerDanger,
  },

  connectionStatusConnected: {
    backgroundColor: colors.bunkerGlow,
  },
});

// Размеры экрана
export const screenDimensions = {
  width,
  height,
  isSmallScreen: width < 375,
  isTablet: width > 768,
};
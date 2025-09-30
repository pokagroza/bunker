import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { bunkerStyles, colors } from '../styles/bunkerStyles';
import { useSocket } from '../context/SocketContext';

const MainMenuScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [adminRoomId, setAdminRoomId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { socket, connected } = useSocket();

  const handleCreateRoom = () => {
    if (!connected) {
      Alert.alert('Ошибка подключения', 'Нет соединения с сервером');
      return;
    }

    if (!playerName.trim()) {
      Alert.alert('Ошибка', 'Введите ваше имя');
      return;
    }

    setLoading(true);
    socket.emit('createRoom', playerName.trim());

    const handleRoomCreated = (data) => {
      setLoading(false);
      navigation.navigate('Lobby', { playerInfo: data });
    };

    const handleError = (message) => {
      setLoading(false);
      Alert.alert('Ошибка', message);
    };

    socket.once('roomCreated', handleRoomCreated);
    socket.once('error', handleError);
  };

  const handleJoinRoom = () => {
    if (!connected) {
      Alert.alert('Ошибка подключения', 'Нет соединения с сервером');
      return;
    }

    if (!playerName.trim() || !roomId.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setLoading(true);
    socket.emit('joinRoom', { 
      roomId: roomId.trim().toUpperCase(), 
      playerName: playerName.trim() 
    });

    const handleRoomJoined = (data) => {
      setLoading(false);
      navigation.navigate('Lobby', { playerInfo: data });
    };

    const handleError = (message) => {
      setLoading(false);
      Alert.alert('Ошибка', message);
    };

    socket.once('roomJoined', handleRoomJoined);
    socket.once('error', handleError);
  };

  const handleOpenAdmin = () => {
    if (!connected) {
      Alert.alert('Ошибка подключения', 'Нет соединения с сервером');
      return;
    }

    if (!adminRoomId.trim()) {
      Alert.alert('Ошибка', 'Введите код комнаты');
      return;
    }

    navigation.navigate('Admin', { roomId: adminRoomId.trim().toUpperCase() });
  };

  const resetForms = () => {
    setShowJoinForm(false);
    setShowAdminForm(false);
  };

  const ConnectionIndicator = () => (
    <View style={[
      bunkerStyles.connectionStatus,
      connected && bunkerStyles.connectionStatusConnected
    ]} />
  );

  return (
    <SafeAreaView style={bunkerStyles.safeArea}>
      <ConnectionIndicator />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={bunkerStyles.container}
      >
        <ScrollView 
          contentContainerStyle={bunkerStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Заголовок */}
          <View style={bunkerStyles.center}>
            <Text style={bunkerStyles.title}>🏠 БУНКЕР 🏠</Text>
            <Text style={[bunkerStyles.text, { textAlign: 'center', marginBottom: 32 }]}>
              Игра на выживание
            </Text>
          </View>

          {/* Описание игры */}
          <View style={bunkerStyles.panel}>
            <Text style={bunkerStyles.heading}>Добро пожаловать в Бункер!</Text>
            <Text style={bunkerStyles.text}>
              Мир поглотила катастрофа, и вы находитесь в бункере. 
              Но места хватит не всем! Вам предстоит убедить других, 
              что именно вы заслуживаете место в убежище.
            </Text>
            
            <View style={{ marginTop: 16 }}>
              <Text style={[bunkerStyles.textDim, { marginBottom: 4 }]}>
                📝 Получите случайного персонажа с характеристиками
              </Text>
              <Text style={[bunkerStyles.textDim, { marginBottom: 4 }]}>
                🎭 Открывайте карточки по одной
              </Text>
              <Text style={[bunkerStyles.textDim, { marginBottom: 4 }]}>
                🗣️ Убеждайте других в своей полезности
              </Text>
              <Text style={[bunkerStyles.textDim, { marginBottom: 4 }]}>
                🗳️ Голосуйте за исключение игроков
              </Text>
              <Text style={[bunkerStyles.textDim, { marginBottom: 4 }]}>
                🏆 Выживите до конца!
              </Text>
            </View>
          </View>

          {/* Основное меню */}
          {!showJoinForm && !showAdminForm ? (
            <View style={bunkerStyles.margin}>
              {/* Создание комнаты */}
              <View style={bunkerStyles.panel}>
                <Text style={bunkerStyles.subheading}>Создать новую игру</Text>
                <TextInput
                  style={bunkerStyles.input}
                  placeholder="Введите ваше имя"
                  placeholderTextColor={colors.bunkerTextDim}
                  value={playerName}
                  onChangeText={setPlayerName}
                  maxLength={20}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={[
                    bunkerStyles.button,
                    bunkerStyles.buttonPrimary,
                    loading && bunkerStyles.buttonDisabled
                  ]}
                  onPress={handleCreateRoom}
                  disabled={loading}
                >
                  <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextPrimary]}>
                    {loading ? '⏳ СОЗДАНИЕ...' : '🏠 СОЗДАТЬ КОМНАТУ'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Разделитель */}
              <Text style={[bunkerStyles.text, { textAlign: 'center', marginVertical: 16 }]}>
                или
              </Text>

              {/* Кнопки навигации */}
              <View style={bunkerStyles.margin}>
                <TouchableOpacity
                  style={[bunkerStyles.button, bunkerStyles.buttonSecondary]}
                  onPress={() => setShowJoinForm(true)}
                >
                  <Text style={bunkerStyles.buttonText}>
                    🚪 ПРИСОЕДИНИТЬСЯ К ИГРЕ
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[bunkerStyles.button, bunkerStyles.buttonWarning]}
                  onPress={() => setShowAdminForm(true)}
                >
                  <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextWarning]}>
                    ⚙️ АДМИН-ПАНЕЛЬ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : showJoinForm ? (
            /* Форма присоединения */
            <View style={bunkerStyles.margin}>
              <View style={bunkerStyles.panel}>
                <Text style={bunkerStyles.subheading}>Присоединиться к игре</Text>
                <TextInput
                  style={bunkerStyles.input}
                  placeholder="Код комнаты (например: ABC123)"
                  placeholderTextColor={colors.bunkerTextDim}
                  value={roomId}
                  onChangeText={(text) => setRoomId(text.toUpperCase())}
                  maxLength={6}
                  autoCapitalize="characters"
                  editable={!loading}
                />
                <TextInput
                  style={bunkerStyles.input}
                  placeholder="Введите ваше имя"
                  placeholderTextColor={colors.bunkerTextDim}
                  value={playerName}
                  onChangeText={setPlayerName}
                  maxLength={20}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={[
                    bunkerStyles.button,
                    bunkerStyles.buttonPrimary,
                    loading && bunkerStyles.buttonDisabled
                  ]}
                  onPress={handleJoinRoom}
                  disabled={loading}
                >
                  <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextPrimary]}>
                    {loading ? '⏳ ПОДКЛЮЧЕНИЕ...' : '➡️ ВОЙТИ В КОМНАТУ'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[bunkerStyles.button, bunkerStyles.buttonSecondary]}
                onPress={resetForms}
              >
                <Text style={bunkerStyles.buttonText}>⬅️ НАЗАД</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Форма админ-панели */
            <View style={bunkerStyles.margin}>
              <View style={[bunkerStyles.panel, bunkerStyles.panelWarning]}>
                <Text style={[bunkerStyles.subheading, bunkerStyles.textWarning]}>
                  🔧 ПАНЕЛЬ АДМИНИСТРАТОРА
                </Text>
                <Text style={bunkerStyles.textDim}>
                  Панель для ведущих игры с расширенными возможностями управления.
                </Text>
                <TextInput
                  style={bunkerStyles.input}
                  placeholder="Код комнаты для администрирования"
                  placeholderTextColor={colors.bunkerTextDim}
                  value={adminRoomId}
                  onChangeText={(text) => setAdminRoomId(text.toUpperCase())}
                  maxLength={6}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[bunkerStyles.button, bunkerStyles.buttonWarning]}
                  onPress={handleOpenAdmin}
                >
                  <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextWarning]}>
                    🔓 ОТКРЫТЬ ПАНЕЛЬ УПРАВЛЕНИЯ
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[bunkerStyles.button, bunkerStyles.buttonSecondary]}
                onPress={resetForms}
              >
                <Text style={bunkerStyles.buttonText}>⬅️ НАЗАД</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Статус подключения */}
          {!connected && (
            <View style={[bunkerStyles.panel, bunkerStyles.panelDanger]}>
              <Text style={[bunkerStyles.text, bunkerStyles.textDanger, { textAlign: 'center' }]}>
                ⚠️ Нет соединения с сервером
              </Text>
              <Text style={[bunkerStyles.textSmall, { textAlign: 'center', marginTop: 8 }]}>
                Проверьте подключение к интернету
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MainMenuScreen;
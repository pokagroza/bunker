import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import { bunkerStyles, colors } from '../styles/bunkerStyles';
import { useSocket } from '../context/SocketContext';

const LobbyScreen = ({ navigation, route }) => {
  const [roomInfo, setRoomInfo] = useState(null);
  const [players, setPlayers] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [loading, setLoading] = useState(false);

  const { socket, connected } = useSocket();
  const { playerInfo } = route.params;

  useEffect(() => {
    if (!connected || !socket) return;

    // Получаем список сценариев
    socket.emit('getScenarios');

    // Настройка обработчиков событий
    socket.on('scenarios', (scenarioList) => {
      setScenarios(scenarioList);
      if (scenarioList.length > 0) {
        setSelectedScenario(scenarioList[0]);
      }
    });

    socket.on('playersUpdate', (playerList) => {
      setPlayers(playerList);
    });

    socket.on('gameStarted', (data) => {
      setLoading(false);
      navigation.navigate('Game', { playerInfo, roomInfo: data });
    });

    socket.on('error', (message) => {
      setLoading(false);
      Alert.alert('Ошибка', message);
    });

    // Запрашиваем информацию о комнате
    socket.emit('getRoomInfo', playerInfo.roomId);

    socket.on('roomInfo', (info) => {
      setRoomInfo(info);
      setPlayers(info.players || []);
    });

    return () => {
      socket.off('scenarios');
      socket.off('playersUpdate');
      socket.off('gameStarted');
      socket.off('error');
      socket.off('roomInfo');
    };
  }, [socket, connected, playerInfo.roomId, navigation, playerInfo]);

  const handleStartGame = () => {
    if (!playerInfo.isHost) {
      Alert.alert('Ошибка', 'Только создатель комнаты может начать игру');
      return;
    }

    if (players.length < 2) {
      Alert.alert('Ошибка', 'Для начала игры нужно минимум 2 игрока');
      return;
    }

    if (!selectedScenario) {
      Alert.alert('Ошибка', 'Выберите сценарий для игры');
      return;
    }

    setLoading(true);
    socket.emit('startGame', { 
      roomId: playerInfo.roomId, 
      scenarioId: scenarios.indexOf(selectedScenario) 
    });
  };

  const handleBackToMenu = () => {
    Alert.alert(
      'Выйти из лобби',
      'Вы уверены, что хотите покинуть игру?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: () => navigation.navigate('MainMenu')
        }
      ]
    );
  };

  const renderPlayer = ({ item }) => (
    <View style={bunkerStyles.listItem}>
      <View style={[bunkerStyles.row, bunkerStyles.spaceBetween]}>
        <Text style={bunkerStyles.text}>
          {item.name}
          {item.isHost && ' 👑'}
        </Text>
        <View style={[
          bunkerStyles.indicator,
          item.isAlive ? null : bunkerStyles.indicatorDanger
        ]} />
      </View>
    </View>
  );

  const renderScenario = ({ item, index }) => (
    <TouchableOpacity
      style={[
        bunkerStyles.listItem,
        selectedScenario === item && bunkerStyles.listItemActive,
        !playerInfo.isHost && bunkerStyles.buttonDisabled
      ]}
      onPress={() => playerInfo.isHost && setSelectedScenario(item)}
      disabled={!playerInfo.isHost}
    >
      <Text style={[
        bunkerStyles.subheading,
        selectedScenario === item && bunkerStyles.textGlow
      ]}>
        {item.title}
      </Text>
      <Text style={bunkerStyles.textDim}>
        {item.description}
      </Text>
      <Text style={[bunkerStyles.textSmall, { marginTop: 8 }]}>
        🏠 Бункер: {item.bunker.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={bunkerStyles.safeArea}>
      <ScrollView contentContainerStyle={bunkerStyles.scrollContainer}>
        {/* Заголовок лобби */}
        <View style={bunkerStyles.panel}>
          <View style={[bunkerStyles.row, bunkerStyles.spaceBetween]}>
            <View>
              <Text style={bunkerStyles.heading}>Лобби игры</Text>
              <Text style={bunkerStyles.textDim}>
                Код комнаты: {playerInfo.roomId}
              </Text>
            </View>
            <View style={[
              bunkerStyles.indicator,
              connected ? null : bunkerStyles.indicatorDanger
            ]} />
          </View>
        </View>

        {/* Список игроков */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.subheading}>
            Игроки ({players.length})
          </Text>
          <FlatList
            data={players}
            renderItem={renderPlayer}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          />
        </View>

        {/* Выбор сценария */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.subheading}>
            Сценарий катастрофы
            {!playerInfo.isHost && ' (только создатель может выбирать)'}
          </Text>
          <FlatList
            data={scenarios}
            renderItem={renderScenario}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        </View>

        {/* Информация о выбранном сценарии */}
        {selectedScenario && (
          <View style={[bunkerStyles.panel, bunkerStyles.panelWarning]}>
            <Text style={[bunkerStyles.subheading, bunkerStyles.textWarning]}>
              Детали сценария
            </Text>
            <Text style={bunkerStyles.text}>
              <Text style={bunkerStyles.textGlow}>Катастрофа:</Text> {selectedScenario.disaster}
            </Text>
            <Text style={bunkerStyles.text}>
              <Text style={bunkerStyles.textGlow}>Время выживания:</Text> {selectedScenario.duration}
            </Text>
            <Text style={bunkerStyles.text}>
              <Text style={bunkerStyles.textGlow}>Угрозы:</Text> {selectedScenario.threats.join(', ')}
            </Text>
            <Text style={bunkerStyles.text}>
              <Text style={bunkerStyles.textGlow}>Ресурсы:</Text> {selectedScenario.resources.join(', ')}
            </Text>
          </View>
        )}

        {/* Кнопки управления */}
        <View style={bunkerStyles.margin}>
          {playerInfo.isHost ? (
            <TouchableOpacity
              style={[
                bunkerStyles.button,
                bunkerStyles.buttonPrimary,
                (loading || players.length < 2) && bunkerStyles.buttonDisabled
              ]}
              onPress={handleStartGame}
              disabled={loading || players.length < 2}
            >
              <Text style={[bunkerStyles.buttonText, bunkerStyles.buttonTextPrimary]}>
                {loading ? '⏳ ЗАПУСК ИГРЫ...' : '🚀 НАЧАТЬ ИГРУ'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[bunkerStyles.panel, bunkerStyles.panelGlow]}>
              <Text style={[bunkerStyles.text, { textAlign: 'center' }]}>
                ⏳ Ожидание начала игры...
              </Text>
              <Text style={[bunkerStyles.textDim, { textAlign: 'center', marginTop: 8 }]}>
                Создатель комнаты запустит игру
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[bunkerStyles.button, bunkerStyles.buttonSecondary]}
            onPress={handleBackToMenu}
          >
            <Text style={bunkerStyles.buttonText}>
              ⬅️ ВЫЙТИ ИЗ ЛОББИ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Инструкции */}
        <View style={bunkerStyles.panel}>
          <Text style={bunkerStyles.subheading}>Как играть</Text>
          <Text style={bunkerStyles.textDim}>
            1. Дождитесь, пока все игроки присоединятся к лобби{'\n'}
            2. Создатель комнаты выбирает сценарий катастрофы{'\n'}
            3. Нажмите "Начать игру" для старта{'\n'}
            4. Каждый игрок получит персонажа с характеристиками{'\n'}
            5. Убеждайте других в своей полезности для выживания!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LobbyScreen;
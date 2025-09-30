import React, { useState, useEffect } from 'react';
import './Character.css';

const VotingInterface = ({ votingInfo, onVote, canVote }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 секунд на голосование

  useEffect(() => {
    setHasVoted(false);
    setTimeLeft(60);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [votingInfo]);

  const handleVote = (vote) => {
    if (canVote && !hasVoted && timeLeft > 0) {
      onVote(vote);
      setHasVoted(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voting-interface">
      <div className="voting-container">
        <div className="voting-header">
          <h3>� ЭКСТРЕННОЕ ГОЛОСОВАНИЕ 🚨</h3>
          <div className="voting-target">
            <span className="target-label">КАНДИДАТ НА ИСКЛЮЧЕНИЕ:</span>
            <span className="target-name">{votingInfo.targetPlayerName}</span>
          </div>
          
          {timeLeft > 0 && (
            <div className="voting-timer">
              <span style={{
                color: timeLeft <= 10 ? 'var(--bunker-warning)' : 'var(--bunker-glow)',
                fontSize: '1.5rem',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 'bold'
              }}>
                ⏱️ {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>

        <div className="voting-question">
          <p>
            Должен ли <strong>{votingInfo.targetPlayerName}</strong> покинуть бункер 
            и остаться снаружи в зоне катастрофы?
          </p>
          <p className="voting-rule">
            ⚖️ Для исключения требуется больше половины голосов "ЗА"
          </p>
        </div>

        {canVote && !hasVoted && timeLeft > 0 && (
          <div className="voting-buttons">
            <button
              className="btn btn-danger vote-btn"
              onClick={() => handleVote('yes')}
            >
              👍 ЗА ИСКЛЮЧЕНИЕ
            </button>
            <button
              className="btn btn-success vote-btn"
              onClick={() => handleVote('no')}
            >
              👎 ПРОТИВ ИСКЛЮЧЕНИЯ
            </button>
          </div>
        )}

        {hasVoted && (
          <div className="vote-confirmation">
            ✅ ВАШ ГОЛОС УЧТЕН! Ожидание решений других жителей бункера...
          </div>
        )}

        {!canVote && (
          <div className="vote-disabled">
            ⏸️ Вы не можете участвовать в голосовании 
            {votingInfo.targetPlayerId === 'currentPlayerId' ? ' (вы являетесь кандидатом на исключение)' : ' (вы исключены из бункера)'}
          </div>
        )}

        {timeLeft === 0 && !hasVoted && canVote && (
          <div className="vote-disabled">
            ⏰ ВРЕМЯ ГОЛОСОВАНИЯ ИСТЕКЛО
          </div>
        )}

        <div className="voting-progress">
          <div className="progress-info">
            <span>ПРОГОЛОСОВАЛО: {votingInfo.votesCount || 0} из {votingInfo.alivePlayers?.length || 0}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((votingInfo.votesCount || 0) / (votingInfo.alivePlayers?.length || 1)) * 100}%` 
              }}
            />
          </div>
        </div>

        <div className="voting-players">
          <h4>👥 ЖИТЕЛИ БУНКЕРА:</h4>
          <div className="voters-list">
            {votingInfo.alivePlayers?.map((player) => (
              <div key={player.id} className="voter-item">
                <span className="voter-name">
                  {player.name}
                  {player.id === votingInfo.targetPlayerId && ' 🎯'}
                </span>
                <span className="voter-status">
                  {player.id === votingInfo.targetPlayerId ? '🎯 НА ИСКЛЮЧЕНИЕ' : '🗳️ ГОЛОСУЕТ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingInterface;
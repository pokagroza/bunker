import React from 'react';
import './Character.css';

const CharacterCard = ({ character, isOwn, onRevealCard, revealedCards = [] }) => {
  const cardTypes = {
    profession: 'Профессия',
    hobby: 'Хобби',
    healthProblem: 'Проблема здоровья',
    specialSkill: 'Особый навык',
    phobia: 'Фобия',
    additionalInfo: 'Дополнительная информация',
    age: 'Возраст',
    gender: 'Пол',
    bodyType: 'Телосложение'
  };

  const getCardIcon = (cardType) => {
    const icons = {
      profession: '👔',
      hobby: '🎯',
      healthProblem: '🏥',
      specialSkill: '⭐',
      phobia: '😰',
      additionalInfo: 'ℹ️',
      age: '📅',
      gender: '👤',
      bodyType: '🏋️'
    };
    return icons[cardType] || '📋';
  };

  const handleRevealCard = (cardType) => {
    if (isOwn && !revealedCards.includes(cardType)) {
      onRevealCard(cardType);
    }
  };

  return (
    <div className="character-card hologram">
      <div className="character-grid">
        {Object.entries(cardTypes).map(([cardType, cardName]) => {
          const isRevealed = revealedCards.includes(cardType);
          const cardValue = character[cardType];

          return (
            <div
              key={cardType}
              className={`character-trait ${isRevealed ? 'revealed' : 'hidden'} ${isOwn ? 'own' : ''}`}
              onClick={() => handleRevealCard(cardType)}
            >
              <div className="trait-header">
                <span className="trait-icon">{getCardIcon(cardType)}</span>
                <span className="trait-name">{cardName}</span>
              </div>
              
              <div className="trait-content">
                {isRevealed ? (
                  <span className="trait-value">{cardValue}</span>
                ) : (
                  <div className="trait-hidden">
                    {isOwn ? (
                      <div className="hidden-card-own">
                        <div className="hidden-preview" title={cardValue}>
                          {cardValue}
                        </div>
                        <button
                          className="btn-reveal"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRevealCard(cardType);
                          }}
                        >
                          🔓 ОТКРЫТЬ
                        </button>
                      </div>
                    ) : (
                      <div className="hidden-card-other">
                        <span className="hidden-placeholder">???</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {isOwn && (
        <div className="character-summary">
          <p>
            💡 <strong>ИНСТРУКЦИЯ:</strong> Щелкните по карточке или кнопке "ОТКРЫТЬ", 
            чтобы раскрыть характеристику всем игрокам. Стратегически выбирайте, 
            что показать, чтобы убедить других в своей ценности для выживания!
          </p>
          <div className="progress-info">
            <span>ОТКРЫТО КАРТОЧЕК:</span>
            <span>{revealedCards.length}/{Object.keys(cardTypes).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
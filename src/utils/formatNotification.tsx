import React from 'react';

export const renderNotificationMessage = (message: string) => {
  if (!message) return null;

  // On utilise une expression régulière globale pour extraire tous les blocs "(de [ancien] à [nouveau])"
  const regex = /\(de (.*?) à (.*?)\)/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(message)) !== null) {
    // Ajouter le texte avant la correspondance
    if (match.index > lastIndex) {
      elements.push(<span key={lastIndex}>{message.substring(lastIndex, match.index)}</span>);
    }

    // Ajouter le rendu avec le style (boîtes rouge et verte)
    elements.push(
      <span key={match.index} className="inline-flex items-center gap-1.5 mx-1 align-middle">
        <span className="px-1.5 py-0.5 bg-red-100/90 text-red-700 line-through rounded font-mono text-[11px] border border-red-200">
          {match[1].trim()}
        </span>
        <span className="text-gray-400 font-bold text-[10px]">➔</span>
        <span className="px-1.5 py-0.5 bg-green-100/90 text-green-700 font-bold rounded font-mono text-[11px] shadow-sm border border-green-200">
          {match[2].trim()}
        </span>
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  // Ajouter le reste du texte
  if (lastIndex < message.length) {
    elements.push(<span key={lastIndex}>{message.substring(lastIndex)}</span>);
  }

  // Si des modifications de type (de... à...) ont été trouvées on les rend
  if (elements.length > 0) {
    return <span className="leading-loose">{elements}</span>;
  }

  return <span>{message}</span>;
};

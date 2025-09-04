import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

// This function takes a line of text and parses inline markdown, like **bold**.
// It returns an array of strings and React elements.
const parseInlineText = (text: string) => {
  // Split by bold markdown, keeping the delimiters
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split content into major blocks based on one or more empty lines
  const blocks = content.split(/\n\s*\n/).filter(Boolean);

  return (
    <div>
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n');
        
        // Check if the block is an ordered list
        const isOl = lines.every(line => /^\s*\d+\.\s/.test(line));
        if (isOl) {
          return (
            <ol key={blockIndex}>
              {lines.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInlineText(item.replace(/^\s*\d+\.\s/, ''))}</li>
              ))}
            </ol>
          );
        }

        // Check if the block is an unordered list
        const isUl = lines.every(line => /^\s*\*\s/.test(line));
        if (isUl) {
          return (
            <ul key={blockIndex}>
              {lines.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInlineText(item.replace(/^\s*\*\s/, ''))}</li>
              ))}
            </ul>
          );
        }

        // Otherwise, treat it as a paragraph.
        // We re-join lines with <br> for paragraphs that have line breaks.
        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {parseInlineText(line)}
                {lineIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;

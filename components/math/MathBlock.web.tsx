import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';
import { createElement } from 'react';

export type MathBlockProps = {
  latex: string;
  display?: boolean;
  textColor: string;
  mathBackground: string;
  minHeight?: number;
};

export function MathBlock({
  latex,
  display = true,
  textColor,
  mathBackground,
  minHeight = 44,
}: MathBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      return `<span style="font-family:system-ui;color:${textColor}">${escapeHtml(latex)}</span>`;
    }
  }, [latex, display, textColor]);

  return createElement(
    'div',
    {
      style: {
        backgroundColor: mathBackground,
        borderRadius: 12,
        padding: display ? '14px 12px' : '6px 8px',
        minHeight,
        width: '100%',
        display: 'flex',
        justifyContent: display ? 'center' : 'flex-start',
        alignItems: 'center',
        boxSizing: 'border-box' as const,
      },
    },
    createElement('div', {
      style: { color: textColor, width: '100%' },
      dangerouslySetInnerHTML: { __html: html },
    })
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

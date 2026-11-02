"use client";

export default function BookLink({ onClick }) {
  return (
    <>
      <button type="button" className="book-link" onClick={onClick}>
        <span className="book-link__line" aria-hidden="true" />
        <span>Book your chair</span>
      </button>

      <style jsx>{`
        .book-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          min-height: 44px;
          background: none;
          border: 0;
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: rgba(239, 237, 230, 0.6);
          transition: color 0.3s ease, transform 0.2s ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .book-link__line {
          display: block;
          width: 24px;
          height: 1.5px;
          background: currentColor;
          transition: width 0.4s cubic-bezier(0.6, 0, 0.2, 1);
        }

        .book-link:hover,
        .book-link:active,
        .book-link:focus-visible {
          color: #efede6;
        }

        .book-link:hover .book-link__line,
        .book-link:active .book-link__line,
        .book-link:focus-visible .book-link__line {
          width: 48px;
        }

        .book-link:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 4px;
        }

        @media (min-width: 640px) {
          .book-link {
            font-size: 15px;
            gap: 12px;
          }
          .book-link__line {
            width: 28px;
          }
          .book-link:hover .book-link__line,
          .book-link:active .book-link__line,
          .book-link:focus-visible .book-link__line {
            width: 56px;
          }
        }

        @media (min-width: 1024px) {
          .book-link {
            font-size: 16px;
            gap: 14px;
          }
          .book-link__line {
            width: 32px;
          }
          .book-link:hover .book-link__line,
          .book-link:active .book-link__line,
          .book-link:focus-visible .book-link__line {
            width: 64px;
          }
        }
      `}</style>
    </>
  );
}

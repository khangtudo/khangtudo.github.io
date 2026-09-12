import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

const horizCssPatch = `
    /* Horizontal Card Adaptive Layout - Prevents Overflow */
    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 520px);
      height: min(42dvh, 320px);
    }
    @media (min-width: 1024px) {
      .card-perspective.horizontal {
        max-width: 580px;
        height: min(46dvh, 360px);
      }
    }
    .card-perspective.horizontal .card-face {
      padding: clamp(12px, 2vh, 18px) clamp(16px, 2.5vw, 24px);
      overflow: hidden;
    }
    .card-perspective.horizontal .person-row {
      gap: 12px;
    }
    .card-perspective.horizontal .card-avatar {
      width: clamp(44px, 9vw, 54px);
      height: clamp(44px, 9vw, 54px);
    }
    .card-perspective.horizontal .contact-list {
      margin: 6px 0;
      gap: 3px;
    }
    .card-perspective.horizontal .contact-item {
      font-size: clamp(0.75rem, 2vw, 0.84rem);
    }
    .card-perspective.horizontal .card-bottom {
      margin-top: auto;
      gap: 10px;
      align-items: center;
    }
    .card-perspective.horizontal .social-icons-box {
      flex: 1;
      display: flex;
      gap: 6px;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      padding-bottom: 2px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .card-perspective.horizontal .social-icons-box::-webkit-scrollbar {
      display: none;
    }
    .card-perspective.horizontal .soc-circle-btn {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
    }
    .card-perspective.horizontal .btn-toggle-orient-card {
      font-size: 0.72rem;
      padding: 5px 10px;
      white-space: nowrap;
      flex-shrink: 0;
    }
`;

// Replace horizontal CSS in index.html
const oldHorizCss = `    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 480px);
      height: min(38dvh, 310px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 420px;
        height: min(64dvh, 540px);
      }
      .card-perspective.horizontal {
        max-width: 560px;
        height: min(44dvh, 360px);
      }
    }`;

const newHorizCss = `    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 520px);
      height: min(42dvh, 320px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 420px;
        height: min(64dvh, 540px);
      }
      .card-perspective.horizontal {
        max-width: 580px;
        height: min(46dvh, 360px);
      }
    }
${horizCssPatch}`;

if (html.includes(oldHorizCss)) {
  html = html.replace(oldHorizCss, newHorizCss);
  console.log('✅ Updated horizontal CSS to completely prevent social profile overflow!');
} else {
  console.error('oldHorizCss not found!');
}

fs.writeFileSync(p, html, 'utf8');

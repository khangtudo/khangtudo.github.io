import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Sửa chiều cao của .card-perspective để không bao giờ bị 0
const oldPerspCss = `    /* Card Perspective & Proportions */
    .card-perspective {
      perspective: 1400px;
      width: 100%;
      max-width: clamp(300px, 86vw, 380px);
      height: 100%;
      max-height: min(58dvh, 480px);
      display: flex;
      align-items: center;
      margin: 0 auto;
    }
    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 500px);
      max-height: min(42dvh, 320px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 400px;
        max-height: 520px;
      }
      .card-perspective.horizontal {
        max-width: 540px;
        max-height: 350px;
      }
    }`;

const newPerspCss = `    /* Card Perspective & Proportions */
    .card-perspective {
      perspective: 1400px;
      width: 100%;
      max-width: clamp(310px, 88vw, 370px);
      height: clamp(400px, 52dvh, 460px);
      display: flex;
      align-items: center;
      margin: 0 auto;
    }
    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 500px);
      height: clamp(280px, 38dvh, 320px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 400px;
        height: 500px;
      }
      .card-perspective.horizontal {
        max-width: 540px;
        height: 340px;
      }
    }`;

html = html.replace(oldPerspCss, newPerspCss);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Fixed card-perspective explicit height!');

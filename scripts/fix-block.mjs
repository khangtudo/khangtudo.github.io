import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Thay đổi CSS cho .card-stage, .card-perspective, .card-3d
const oldStageCss = `    .card-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 0;
    }

    /* Card Perspective & Proportions */
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
    }
    .card-3d {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }`;

const newStageCss = `    .card-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex: 1;
    }

    /* Card Perspective & Proportions */
    .card-perspective {
      perspective: 1400px;
      width: 100%;
      max-width: clamp(310px, 88vw, 370px);
      height: 440px;
      min-height: 440px;
      display: block;
      margin: 0 auto;
      position: relative;
    }
    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 500px);
      height: 300px;
      min-height: 300px;
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 400px;
        height: 480px;
        min-height: 480px;
      }
      .card-perspective.horizontal {
        max-width: 540px;
        height: 330px;
        min-height: 330px;
      }
    }
    .card-3d {
      width: 100%;
      height: 100%;
      min-height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: block;
    }`;

html = html.replace(oldStageCss, newStageCss);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Applied min-height: 440px and display: block!');

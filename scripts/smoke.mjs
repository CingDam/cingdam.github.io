/**
 * 포트폴리오 스모크 테스트 — 실제 브라우저로 띄워서 확인한다.
 * 사용: node scripts/smoke.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const errors = [];
const browser = await chromium.launch({ args: ['--no-sandbox'] });

async function newPage(width, height, colorScheme = 'dark', reducedMotion = 'reduce') {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme,
    reducedMotion,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', (r) =>
    errors.push(`[404?] ${r.url()} — ${r.failure()?.errorText ?? ''}`),
  );
  return { ctx, page };
}

/** 가로 스크롤이 생기는지 — 구버전의 대표적 회귀 지점 */
async function checkOverflow(page, label) {
  const r = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  const overflow = r.scrollW > r.clientW + 1;
  console.log(
    `  가로 스크롤: ${overflow ? `❌ 있음 (${r.scrollW} > ${r.clientW})` : '✅ 없음'}  [${label}]`,
  );
  return overflow;
}

let failed = false;

/* ---------- 데스크톱 1440px ---------- */
{
  console.log('\n=== 데스크톱 1440x900 ===');
  const { ctx, page } = await newPage(1440, 900);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=정제원의');
  await page.screenshot({ path: `${OUT}/desktop-hero.png` });
  failed |= await checkOverflow(page, 'desktop hero');

  // 전체 페이지
  await page.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });

  // 프로젝트 섹션
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/desktop-projects.png` });

  const cards = await page.locator('#projects article').count();
  console.log(`  프로젝트 카드: ${cards}개 ${cards === 4 ? '✅' : '❌ (4개 기대)'}`);
  if (cards !== 4) failed = true;

  // 첫 카드(Planit) 모달 열기
  await page.locator('#projects article').first().getByText('자세히 보기').click();
  await page.waitForSelector('[role="dialog"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/desktop-modal.png` });

  const title = await page.locator('[role="dialog"] h3').first().textContent();
  console.log(`  모달 제목: "${title}" ${title === 'Planit' ? '✅' : '❌'}`);
  if (title !== 'Planit') failed = true;

  // ESC 로 닫히는지 — 구버전에 없던 기능
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = (await page.locator('[role="dialog"]').count()) === 0;
  console.log(`  ESC 닫기: ${closed ? '✅' : '❌'}`);
  if (!closed) failed = true;

  // 스크린샷 있는 카드(Helpus)의 캐러셀 확인
  await page.locator('#projects article').nth(2).getByText('자세히 보기').click();
  await page.waitForSelector('[role="dialog"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/desktop-modal-helpus.png` });
  const slides = await page.locator('[role="dialog"] .swiper-slide').count();
  console.log(`  Helpus 캐러셀 슬라이드: ${slides}개 ${slides > 0 ? '✅' : '❌'}`);
  if (slides === 0) failed = true;

  await page.keyboard.press('Escape');
  await ctx.close();
}

/* ---------- 모바일 390px ---------- */
{
  console.log('\n=== 모바일 390x844 ===');
  const { ctx, page } = await newPage(390, 844);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=정제원의');
  await page.screenshot({ path: `${OUT}/mobile-hero.png` });
  failed |= await checkOverflow(page, 'mobile hero');

  await page.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });

  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/mobile-projects.png` });
  failed |= await checkOverflow(page, 'mobile projects');

  await page.locator('#projects article').first().getByText('자세히 보기').click();
  await page.waitForSelector('[role="dialog"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/mobile-modal.png` });
  failed |= await checkOverflow(page, 'mobile modal');

  await page.keyboard.press('Escape');
  await ctx.close();
}

/* ---------- 태블릿 768px ---------- */
{
  console.log('\n=== 태블릿 768x1024 ===');
  const { ctx, page } = await newPage(768, 1024);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=정제원의');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/tablet-projects.png` });
  failed |= await checkOverflow(page, 'tablet');
  await ctx.close();
}

/* ---------- 스크롤 등장 애니메이션 ---------- */
{
  console.log('\n=== 스크롤 애니메이션 ===');
  // Playwright 기본값이 reduced-motion:reduce 라서 명시적으로 꺼야 한다.
  const { ctx, page } = await newPage(1440, 900, 'dark', 'no-preference');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const opacities = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('#projects article')].map(
        (a) => +(+getComputedStyle(a).opacity).toFixed(2),
      ),
    );

  // 화면 밖에서는 숨어 있어야 한다
  const hidden = (await opacities()).every((o) => o === 0);
  console.log(`  진입 전 숨김: ${hidden ? '✅' : '❌ (등장 애니메이션이 안 걸렸다)'}`);
  if (!hidden) failed = true;

  // 스크롤 진입 후 카드가 "동시에" 가 아니라 순차적으로 나타나야 한다
  const top = await page.evaluate(() => document.getElementById('projects').offsetTop);
  await page.evaluate((y) => window.scrollTo({ top: y - 200, behavior: 'instant' }), top);
  await page.waitForTimeout(300);
  const mid = await opacities();
  const staggered = new Set(mid).size > 1;
  console.log(`  순차 등장: ${staggered ? '✅' : '❌ (한 덩어리로 나타난다)'}  ${JSON.stringify(mid)}`);
  if (!staggered) failed = true;

  await page.waitForTimeout(900);
  const done = (await opacities()).every((o) => o === 1);
  console.log(`  최종 표시: ${done ? '✅' : '❌'}`);
  if (!done) failed = true;

  await ctx.close();
}

/* ---------- 테마: 시스템 설정 자동 추종 ---------- */
{
  console.log('\n=== 테마 ===');

  // OS 가 라이트면 라이트로 떠야 한다
  const { ctx: lc, page: lp } = await newPage(1440, 900, 'light');
  await lp.goto(BASE, { waitUntil: 'networkidle' });
  const lightOk = !(await lp.evaluate(() => document.documentElement.classList.contains('dark')));
  const lightBg = await lp.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(`  OS=light → 라이트: ${lightOk ? '✅' : '❌'}  (body ${lightBg})`);
  if (!lightOk) failed = true;
  await lp.screenshot({ path: `${OUT}/light-hero.png` });
  await lp.locator('#projects').scrollIntoViewIfNeeded();
  await lp.waitForTimeout(700);
  await lp.screenshot({ path: `${OUT}/light-projects.png` });
  await lp.locator('#skills').scrollIntoViewIfNeeded();
  await lp.waitForTimeout(700);
  await lp.locator('#skills').screenshot({ path: `${OUT}/light-skills.png` });

  // 토글로 다크 전환 후 새로고침해도 유지되는지
  await lp.locator('header button[aria-label]').click();
  await lp.waitForTimeout(400);
  const toggledDark = await lp.evaluate(() =>
    document.documentElement.classList.contains('dark'),
  );
  console.log(`  토글 → 다크: ${toggledDark ? '✅' : '❌'}`);
  if (!toggledDark) failed = true;

  await lp.reload({ waitUntil: 'networkidle' });
  const persisted = await lp.evaluate(() =>
    document.documentElement.classList.contains('dark'),
  );
  console.log(`  새로고침 후 유지: ${persisted ? '✅' : '❌'}`);
  if (!persisted) failed = true;
  await lc.close();

  // OS 가 다크면 다크로 떠야 한다
  const { ctx: dc, page: dp } = await newPage(1440, 900, 'dark');
  await dp.goto(BASE, { waitUntil: 'networkidle' });
  const darkOk = await dp.evaluate(() => document.documentElement.classList.contains('dark'));
  const darkBg = await dp.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(`  OS=dark  → 다크:  ${darkOk ? '✅' : '❌'}  (body ${darkBg})`);
  if (!darkOk) failed = true;
  await dp.locator('#skills').scrollIntoViewIfNeeded();
  await dp.waitForTimeout(700);
  await dp.locator('#skills').screenshot({ path: `${OUT}/dark-skills.png` });
  await dc.close();
}

await browser.close();

console.log('\n=== 콘솔 에러 ===');
if (errors.length === 0) {
  console.log('  ✅ 없음');
} else {
  failed = true;
  for (const e of [...new Set(errors)].slice(0, 15)) console.log(`  ❌ ${e}`);
}

console.log(`\n스크린샷 → ${OUT}/`);
process.exit(failed ? 1 : 0);

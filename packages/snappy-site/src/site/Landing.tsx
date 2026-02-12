import { Button } from "../shared/Button";
import { LocaleSwitcher } from "../shared/LocaleSwitcher";
import { Theme } from "../Theme";
import { SiteLocale, t } from "./Locale";

const TelegramIcon = () => <span className="icon-telegram" aria-hidden="true" />;

type LandingProps = { onThemeToggle?: () => void };

export const Landing = ({ onThemeToggle }: LandingProps = {}) => (
  <>
    <header className="site-header">
      <div className="header-inner">
        <a href="/" className="logo" title={t(`themeToggle`)} onClick={Theme.onLogoClick(onThemeToggle)}>
          <img src="/favicon.svg" alt="" className="logo-icon" aria-hidden="true" /> Snappy
        </a>
        <nav>
          <a href="#features">{t(`nav.features`)}</a>
          <a href="#examples">{t(`nav.examples`)}</a>
          <a href="#who">{t(`nav.who`)}</a>
          <a href="#faq">{t(`nav.faq`)}</a>
          <a href="#start">{t(`nav.start`)}</a>
          <a href="/app">{t(`nav.cabinet`)}</a>
          <LocaleSwitcher getLocale={SiteLocale.getSiteLocale} setLocale={SiteLocale.setSiteLocale} />
        </nav>
      </div>
    </header>
    <main id="main">
      <section className="hero">
        <h1>{t(`hero.title`)}</h1>
        <p className="hero-lead">{t(`hero.lead`)}</p>
        <Button href="https://t.me/sn4ppy_bot" primary large>
          <TelegramIcon /> {t(`hero.cta`)}
        </Button>
      </section>

      <section id="features" className="section">
        <h2>{t(`features.title`)}</h2>
        <p className="section-lead">{t(`features.lead`)}</p>
        <div className="features-grid">
          <div className="card">
            <span className="card-icon">📝</span>
            <h3>{t(`features.fixErrors.title`)}</h3>
            <p>{t(`features.fixErrors.desc`)}</p>
          </div>
          <div className="card">
            <span className="card-icon">✂️</span>
            <h3>{t(`features.shorten.title`)}</h3>
            <p>{t(`features.shorten.desc`)}</p>
          </div>
          <div className="card">
            <span className="card-icon">📖</span>
            <h3>{t(`features.expand.title`)}</h3>
            <p>{t(`features.expand.desc`)}</p>
          </div>
          <div className="card">
            <span className="card-icon">👁️</span>
            <h3>{t(`features.readability.title`)}</h3>
            <p>{t(`features.readability.desc`)}</p>
          </div>
          <div className="card">
            <span className="card-icon">😊</span>
            <h3>{t(`features.emoji.title`)}</h3>
            <p>{t(`features.emoji.desc`)}</p>
          </div>
          <div className="card">
            <span className="card-icon">🎭</span>
            <h3>{t(`features.styles.title`)}</h3>
            <p>{t(`features.styles.desc`)}</p>
          </div>
        </div>
      </section>

      <section id="examples" className="section">
        <h2>{t(`examples.title`)}</h2>
        <p className="section-lead">{t(`examples.lead`)}</p>
        <div className="example-block">
          <p className="example-label">{t(`examples.fixErrors`)}</p>
          <div className="example-row">
            <div className="example-panel example-before">
              <span className="example-title">{t(`examples.before`)}</span>
              <p>
                привет написал тебе вчера насчёт встречи не знаю получилось ли у тебя прочитать давай созвонимся в
                среду?
              </p>
            </div>
            <span className="example-arrow" aria-hidden="true">
              →
            </span>
            <div className="example-panel example-after">
              <span className="example-title">{t(`examples.after`)}</span>
              <p>
                Привет! Написал тебе вчера насчёт встречи — не знаю, получилось ли у тебя прочитать. Давай созвонимся в
                среду?
              </p>
            </div>
          </div>
        </div>
        <div className="example-block">
          <p className="example-label">{t(`examples.friendlyStyle`)}</p>
          <div className="example-row">
            <div className="example-panel example-before">
              <span className="example-title">{t(`examples.before`)}</span>
              <p>Семинар переносится на 15:00. Уведомляю всех участников.</p>
            </div>
            <span className="example-arrow" aria-hidden="true">
              →
            </span>
            <div className="example-panel example-after">
              <span className="example-title">{t(`examples.after`)}</span>
              <p>
                Эй, друзья! 👋 Семинар переносим на <strong>15:00</strong> — предупреждаю заранее, чтобы все успели. До
                встречи! ✨
              </p>
            </div>
          </div>
        </div>
        <div className="example-block">
          <p className="example-label">{t(`examples.readability`)}</p>
          <div className="example-row">
            <div className="example-panel example-before">
              <span className="example-title">{t(`examples.before`)}</span>
              <p>
                Мы занимаемся доставкой по городу в течение 2 часов при заказе от 1000 рублей при этом у нас действует
                скидка 10% для новых клиентов.
              </p>
            </div>
            <span className="example-arrow" aria-hidden="true">
              →
            </span>
            <div className="example-panel example-after">
              <span className="example-title">{t(`examples.after`)}</span>
              <p>
                Доставка по городу — <strong>до 2 часов</strong> 🚚
                <br />
                <br />• При заказе от 1000 ₽<br />•<em>Скидка 10%</em> для новых клиентов 🎁
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="styles" className="section">
        <h2>{t(`styles.title`)}</h2>
        <p className="section-lead">{t(`styles.lead`)}</p>
        <div className="styles-pills">
          <div className="pill">
            <span className="pill-left">{t(`styles.business.name`)}</span>
            <span className="pill-right">{t(`styles.business.hint`)}</span>
          </div>
          <div className="pill">
            <span className="pill-left">{t(`styles.friendly.name`)}</span>
            <span className="pill-right">{t(`styles.friendly.hint`)}</span>
          </div>
          <div className="pill">
            <span className="pill-left">{t(`styles.neutral.name`)}</span>
            <span className="pill-right">{t(`styles.neutral.hint`)}</span>
          </div>
          <div className="pill">
            <span className="pill-left">{t(`styles.selling.name`)}</span>
            <span className="pill-right">{t(`styles.selling.hint`)}</span>
          </div>
          <div className="pill">
            <span className="pill-left">{t(`styles.humorous.name`)}</span>
            <span className="pill-right">{t(`styles.humorous.hint`)}</span>
          </div>
        </div>
      </section>

      <section id="who" className="section">
        <h2>{t(`who.title`)}</h2>
        <p className="section-lead">{t(`who.lead`)}</p>
        <div className="who-list">
          <div className="who-item">
            <span className="who-icon">📱</span>
            <h3>{t(`who.smm.title`)}</h3>
            <p>{t(`who.smm.desc`)}</p>
          </div>
          <div className="who-item">
            <span className="who-icon">✉️</span>
            <h3>{t(`who.emails.title`)}</h3>
            <p>{t(`who.emails.desc`)}</p>
          </div>
          <div className="who-item">
            <span className="who-icon">📄</span>
            <h3>{t(`who.ads.title`)}</h3>
            <p>{t(`who.ads.desc`)}</p>
          </div>
          <div className="who-item">
            <span className="who-icon">🎓</span>
            <h3>{t(`who.study.title`)}</h3>
            <p>{t(`who.study.desc`)}</p>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <h2>{t(`faq.title`)}</h2>
        <p className="section-lead">{t(`faq.lead`)}</p>
        <dl className="faq-list">
          <div className="faq-item">
            <dt>{t(`faq.free.q`)}</dt>
            <dd>{t(`faq.free.a`)}</dd>
          </div>
          <div className="faq-item">
            <dt>{t(`faq.registration.q`)}</dt>
            <dd>{t(`faq.registration.a`)}</dd>
          </div>
          <div className="faq-item">
            <dt>{t(`faq.languages.q`)}</dt>
            <dd>{t(`faq.languages.a`)}</dd>
          </div>
          <div className="faq-item">
            <dt>{t(`faq.privacy.q`)}</dt>
            <dd>{t(`faq.privacy.a`)}</dd>
          </div>
          <div className="faq-item">
            <dt>{t(`faq.length.q`)}</dt>
            <dd>{t(`faq.length.a`)}</dd>
          </div>
          <div className="faq-item">
            <dt>{t(`faq.difference.q`)}</dt>
            <dd>{t(`faq.difference.a`)}</dd>
          </div>
        </dl>
      </section>

      <section id="start" className="section">
        <h2>{t(`start.title`)}</h2>
        <p className="section-lead">{t(`start.lead`)}</p>
        <div className="steps-timeline">
          <ol className="steps">
            <li>{t(`start.step1`)}</li>
            <li>{t(`start.step2`)}</li>
            <li>{t(`start.step3`)}</li>
            <li>{t(`start.step4`)}</li>
          </ol>
        </div>
      </section>

      <section className="cta-block">
        <h2>{t(`cta.title`)}</h2>
        <p>{t(`cta.lead`)}</p>
        <Button href="https://t.me/sn4ppy_bot" primary large>
          <TelegramIcon /> {t(`cta.button`)}
        </Button>
      </section>
    </main>
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="logo">
          <img src="/favicon.svg" alt="" className="logo-icon" aria-hidden="true" /> Snappy
        </span>
        <p>{t(`footer.tagline`)}</p>
        <a href="https://t.me/sn4ppy_bot" target="_blank" rel="noopener">
          @sn4ppy_bot
        </a>
      </div>
    </footer>
  </>
);

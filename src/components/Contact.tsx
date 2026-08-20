import { FiGithub, FiMail, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Section, staggerParent, fadeUp, VIEWPORT } from './Section';

const GITHUB_URL = 'https://github.com/CingDam';
const EMAIL = 'mmd011375@gmail.com';
const PHONE = '010-4153-6975';

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="연락처"
      lead="함께 일할 기회나 궁금한 점이 있다면 편하게 연락 주세요."
      align="center"
    >
      <motion.div
        variants={staggerParent(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="grid gap-4 sm:grid-cols-3"
      >
        <ContactCard
          icon={<FiMail size={20} />}
          label="Email"
          value={EMAIL}
          href={`mailto:${EMAIL}`}
        />
        <ContactCard
          icon={<FiPhone size={20} />}
          label="Phone"
          value={PHONE}
          href={`tel:${PHONE.replace(/-/g, '')}`}
        />
        <ContactCard
          icon={<FiGithub size={20} />}
          label="GitHub"
          value="github.com/CingDam"
          href={GITHUB_URL}
          external
        />
      </motion.div>

      <p className="mt-10 text-center text-xs text-content-subtle">
        © {new Date().getFullYear()} 정제원
      </p>
    </Section>
  );
}

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

function ContactCard({ icon, label, value, href, external }: CardProps) {
  return (
    <motion.a
      variants={fadeUp}
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className="group flex items-center gap-4 rounded-xl border border-line bg-card p-5 transition-colors hover:border-accent/40 hover:bg-card-raised"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wider text-content-subtle">{label}</span>
        {/* select-text: 구버전은 body 에 user-select:none 이 걸려 복사가 안 됐다 */}
        <span className="mt-0.5 block select-text truncate text-sm font-medium text-content">
          {value}
        </span>
      </span>
    </motion.a>
  );
}

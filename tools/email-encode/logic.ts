export function encodeEmailHtml(email: string): string {
  return email.split('').map(c => `&#${c.charCodeAt(0)};`).join('');
}

export function encodeEmailJs(email: string): string {
  const parts = email.split('').map(c => `'${c}'`).join('+');
  return `<script>document.write(${parts})</script>`;
}

export function encodeEmailCss(email: string): string {
  const [user, domain] = email.split('@');
  return `<span class="email" data-user="${user}" data-domain="${domain}"></span>`;
}

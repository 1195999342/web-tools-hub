export function htmlToUbb(html: string): string {
  return html
    .replace(/<b>(.*?)<\/b>/gi, '[b]$1[/b]')
    .replace(/<strong>(.*?)<\/strong>/gi, '[b]$1[/b]')
    .replace(/<i>(.*?)<\/i>/gi, '[i]$1[/i]')
    .replace(/<em>(.*?)<\/em>/gi, '[i]$1[/i]')
    .replace(/<u>(.*?)<\/u>/gi, '[u]$1[/u]')
    .replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[url=$1]$2[/url]')
    .replace(/<img\s+src="([^"]*)"[^>]*\/?>/gi, '[img]$1[/img]')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '');
}

export function ubbToHtml(ubb: string): string {
  return ubb
    .replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>')
    .replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>')
    .replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
    .replace(/\[url=([^\]]*)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>')
    .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" />')
    .replace(/\n/g, '<br />');
}

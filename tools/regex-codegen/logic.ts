// Regex Code Generator logic

export type Language = 'javascript' | 'python' | 'java' | 'csharp' | 'go' | 'php' | 'ruby' | 'rust';

export const languages: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
];

export function generateCode(regex: string, flags: string, lang: Language): string {
  const esc = regex.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  switch (lang) {
    case 'javascript':
      return `const regex = /${regex}/${flags};\nconst match = "test string".match(regex);\nconsole.log(match);`;
    case 'python':
      return `import re\n\npattern = re.compile(r"${regex}"${flags.includes('i') ? ', re.IGNORECASE' : ''})\nmatch = pattern.search("test string")\nif match:\n    print(match.group())`;
    case 'java':
      return `import java.util.regex.*;\n\nPattern pattern = Pattern.compile("${esc}"${flags.includes('i') ? ', Pattern.CASE_INSENSITIVE' : ''});\nMatcher matcher = pattern.matcher("test string");\nwhile (matcher.find()) {\n    System.out.println(matcher.group());\n}`;
    case 'csharp':
      return `using System.Text.RegularExpressions;\n\nvar regex = new Regex(@"${regex}"${flags.includes('i') ? ', RegexOptions.IgnoreCase' : ''});\nvar match = regex.Match("test string");\nif (match.Success)\n    Console.WriteLine(match.Value);`;
    case 'go':
      return `package main\n\nimport (\n    "fmt"\n    "regexp"\n)\n\nfunc main() {\n    re := regexp.MustCompile(\`${regex}\`)\n    fmt.Println(re.FindString("test string"))\n}`;
    case 'php':
      return `<?php\n$pattern = '/${regex}/${flags}';\npreg_match($pattern, "test string", $matches);\nprint_r($matches);\n?>`;
    case 'ruby':
      return `regex = /${regex}/${flags.includes('i') ? 'i' : ''}\nmatch = "test string".match(regex)\nputs match[0] if match`;
    case 'rust':
      return `use regex::Regex;\n\nfn main() {\n    let re = Regex::new(r"${regex}").unwrap();\n    if let Some(m) = re.find("test string") {\n        println!("{}", m.as_str());\n    }\n}`;
  }
}

import { MoonStar, Sun } from 'lucide-react';
import { Theme, useTheme } from 'remix-themes';

import { useIsMounted } from '@documenso/lib/client-only/hooks/use-is-mounted';

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useTheme();
  const isMounted = useIsMounted();
  const isDarkTheme = isMounted && theme === Theme.DARK;
  const nextTheme = isDarkTheme ? Theme.LIGHT : Theme.DARK;

  return (
    <div className="bg-muted rounded-full border border-border p-1">
      <button
        type="button"
        className="bg-background text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full"
        onClick={() => setTheme(nextTheme)}
      >
        {isDarkTheme ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
      </button>
    </div>
  );
};

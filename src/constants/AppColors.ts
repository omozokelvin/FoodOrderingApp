const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

type ColorSchema = 'light' | 'dark';

type ColorsOptions = Record<
  ColorSchema,
  {
    text: string;
    background: string;
    tint: string;
    tabIconDefault: string;
    tabIconSelected: string;
    error: string;
    primary: string;
    success: string;
    white: string;
  }
>;

const AppColors: ColorsOptions = {
  light: {
    text: '#000000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    error: 'red',
    primary: tintColorLight,
    success: 'green',
    white: '#ffffff',
  },
  dark: {
    text: '#ffffff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    error: 'red',
    primary: tintColorDark,
    success: 'green',
    white: '#ffffff',
  },
};

export default AppColors;

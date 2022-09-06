import { Platform } from 'react-native'
import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    primary: '#2b44d9',
    secondary: '#4e81df',
    error: '#f13a59',
  },
  appContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        width: '30rem',
        alignSelf: 'center',

      },
      default: {
        width: '100%',
      },

    }),
  },
}

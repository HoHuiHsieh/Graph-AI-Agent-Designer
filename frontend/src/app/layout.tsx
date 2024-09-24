/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { Box } from '@mui/material';
import SideBar from '@/components/SideBar';


/**
 * 
 * @param props 
 * @returns 
 */
export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="zh-Hant-TW">
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        <Box sx={{ display: 'flex' }}>
                            <CssBaseline />
                            <SideBar />
                            {props.children}
                        </Box>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
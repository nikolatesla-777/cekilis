import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
    title: 'Resmi Çekiliş Sonuç Ekranı',
    description: 'Kurumsal ve şeffaf çekiliş sistemi.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
            <body className="antialiased min-h-screen bg-[#020617] text-white">
                {children}
            </body>
        </html>
    )
}

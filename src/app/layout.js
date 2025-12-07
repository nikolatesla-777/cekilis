export const metadata = {
    title: 'Çekiliş - Büyük Ödül Seni Bekliyor',
    description: 'Günlük çekiliş heyecanına katıl!',
}

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className="dark">
            <body className="bg-slate-950 text-slate-50 antialiased min-h-screen selection:bg-purple-500/30">
                {children}
            </body>
        </html>
    )
}

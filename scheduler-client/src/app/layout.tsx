
'use client'


import { Inter } from 'next/font/google'
import './globals.css'
import SideBar from './components/sidebar/sidebar'
import { FaTasks } from 'react-icons/fa'
import { RxDashboard } from 'react-icons/rx'
import styles from './page.module.css';
import { useSelectedLayoutSegment } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })


export enum Page {
  dashboard = "dashboard",
  jobs = "jobs",
}

export namespace Page {
  export function fromString(str: string | null): Page {
    switch (str) {
      case "dashboard":
        return Page.dashboard
      case "jobs":
        return Page.jobs
      default:
        return Page.dashboard
    }
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const segment = useSelectedLayoutSegment()
  const activePage = Page.fromString(segment)

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.home}>
          <SideBar activePage={activePage} navItems={[
            {
              page: Page.dashboard,
              icon: <RxDashboard />,
              link: "/"
            },
            {
              page: Page.jobs,
              icon: <FaTasks />,
              link: `/${Page.jobs}`
            },
          ]}>
            {children}
          </SideBar>
        </div>
      </body>
    </html>
  )
}

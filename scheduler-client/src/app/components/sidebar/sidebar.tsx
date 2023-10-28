import { Page } from "../../layout";
import NavItem from "../navitem/navitem";
import styles from './sidebar.module.css';

export default function SideBar(
    props: {
        navItems: {
            page: Page;
            icon: React.ReactNode;
            link: string;
        }[];
        activePage: Page
        children?: React.ReactNode;
    }
) {

    return <div className={styles.container}>
        <div className={styles.navItems}>
            <div className={styles.title}>
                Scheduler
            </div>
            <ul>
                {props.navItems.map((item, index) => {
                    return <NavItem title={item.page} icon={item.icon} link={item.link} key={index} isActive={props.activePage == item.page} />
                })}
            </ul>
        </div>
        <div className={styles.content}>
            {props.children}
        </div>
    </div>
}
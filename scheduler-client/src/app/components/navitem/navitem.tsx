import Link from 'next/link';
import styles from './navitem.module.css';

export default function NavItem(props: {
    title: string;
    icon: React.ReactNode;
    link: string;
    isActive: boolean;
}) {
    return (
        <Link href={props.link}>
            <div className={`${styles.navItemContainer} ${props.isActive ? styles.navIconContainerActive : ''}`}>
                <span className={styles.navItemIcon}>
                    {props.icon}
                </span>
                {props.title}
            </div>
        </Link>
    );
}
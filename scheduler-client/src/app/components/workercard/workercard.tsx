import { IoGitNetworkOutline } from 'react-icons/io5'
import styles from './workercard.module.css'

export default function Workercard(props: {
    height?: string
    width?: string
}) {
    return <div style={{ width: props.width, height: props.height ?? '180px', padding: '10px' }}>
        <div className='card no-elevation'>
            <section className={styles['worker-card-header']}>
                <div className="row">
                    <h5>Worker(345-44332)</h5>
                    <IoGitNetworkOutline />
                </div>
            </section>
            <section className={styles['worker-card-body']}>
                <p>
                    Queued
                </p>
                <h1>
                    #567
                </h1>
            </section>
            <section className={`row ${styles['worker-card-footer']}`}>
                <span>Uptime:<span> 2h 34m</span></span>
                <span>Heartbeat:<span> 12s ago</span></span>
            </section>
        </div>
    </div>
}
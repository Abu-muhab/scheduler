"use client"

import { IoGitNetworkOutline } from 'react-icons/io5'
import styles from './workercard.module.css'
import { Worker } from '../../data/workers.repo'

export default function Workercard(props: {
    height?: string
    width?: string
    worker: Worker
}) {
    return <div style={{ width: props.width, height: props.height ?? '180px', padding: '10px' }}>
        <div className='card no-elevation'>
            <section className={styles['worker-card-header']}>
                <div className="row">
                    <h5>Worker({props.worker.id.split('-')[0]})</h5>
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
                <span>Uptime:<span> {props.worker.uptime} ago</span></span>
                <span>Heartbeat:<span> {props.worker.lastHeartbeat} ago</span></span>
            </section>
        </div>
    </div>
}
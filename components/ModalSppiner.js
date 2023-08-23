import styles from '../styles/sppiner.module.css'

export const ModalSppiner = () => {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className={`${styles.skchase}`}>
                <div className={`${styles.skchasedot}`}></div>
                <div className={`${styles.skchasedot}`}></div>
                <div className={`${styles.skchasedot}`}></div>
                <div className={`${styles.skchasedot}`}></div>
                <div className={`${styles.skchasedot}`}></div>
                <div className={`${styles.skchasedot}`}></div>
            </div>
        </div>
    )
}
